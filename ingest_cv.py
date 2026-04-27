import os
import json
from typing import List, Optional
from dotenv import load_dotenv
from neo4j import GraphDatabase
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

load_dotenv()

URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("NEO4J_USERNAME")
PASSWORD = os.getenv("NEO4J_PASSWORD")

if not all([URI, USERNAME, PASSWORD]):
    raise ValueError("Please set NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD in your .env file")

# --- Pydantic Models ---

class Skill(BaseModel):
    name: str
    category: str = Field(description="Category of the skill e.g. Languages, Frameworks, Tools, Concepts")

class Education(BaseModel):
    institution: str
    degree: str
    year: str
    location: str

class Experience(BaseModel):
    company: str
    role: str
    duration: str
    type: str = Field(description="Remote, On-site, Hybrid")
    description: str
    skills_used: List[str]

class Project(BaseModel):
    name: str
    tagline: str
    description: str
    tech_stack: List[str]

class Achievement(BaseModel):
    name: str
    rank: str
    context: str
    track: Optional[str] = ""

class Person(BaseModel):
    name: str
    email: str
    phone: str
    role: str
    bio: str

class CVData(BaseModel):
    person: Person
    skills: List[Skill]
    education: List[Education]
    experience: List[Experience]
    projects: List[Project]
    achievements: List[Achievement]


# --- Embedding Generator ---

class EmbeddingGenerator:
    """Generates embeddings using sentence-transformers (local, fast, free)."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        print(f"Loading embedding model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        print("Embedding model loaded.")
    
    def embed(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        return self.model.encode(text).tolist()
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        return self.model.encode(texts).tolist()


# --- Database Ingestion Logic ---

class CVIngester:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        self.embedder = EmbeddingGenerator()

    def close(self):
        self.driver.close()

    def clear_database(self):
        """Wipes the database clean before ingestion to avoid duplicates."""
        with self.driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
            print("Database cleared.")

    def create_vector_index(self):
        """Create a vector index on Document nodes for semantic search."""
        with self.driver.session() as session:
            try:
                session.run("""
                    CREATE VECTOR INDEX document_embeddings IF NOT EXISTS
                    FOR (d:Document)
                    ON (d.embedding)
                    OPTIONS {indexConfig: {
                        `vector.dimensions`: 384,
                        `vector.similarity_function`: 'cosine'
                    }}
                """)
                print("Vector index created (or already exists).")
            except Exception as e:
                print(f"Note: Vector index creation returned: {e}")
                print("This is normal if the index already exists or Neo4j version doesn't support it.")

    def create_document(self, session, doc_type: str, title: str, content: str, metadata: dict = None):
        """Create a Document node with embedding for semantic search."""
        embedding = self.embedder.embed(content)
        
        query = """
            CREATE (d:Document {
                type: $type,
                title: $title,
                content: $content,
                embedding: $embedding
            })
        """
        params = {
            "type": doc_type,
            "title": title,
            "content": content,
            "embedding": embedding
        }
        
        if metadata:
            # Add metadata as additional properties
            for key, value in metadata.items():
                query = query.replace("embedding: $embedding", f"embedding: $embedding, {key}: ${key}")
                params[key] = value
        
        session.run(query, params)

    def ingest(self, data: CVData):
        if not data:
            print("No data to ingest.")
            return

        with self.driver.session() as session:
            # Clear existing data
            self.clear_database()
            
            # Create vector index
            self.create_vector_index()

            # 1. Create Person node
            print(f"Creating Person: {data.person.name}...")
            session.run("""
                CREATE (p:Person {name: $name, email: $email, phone: $phone, role: $role, bio: $bio})
            """, data.person.dict())
            
            # Create a document for the person's bio
            if data.person.bio:
                self.create_document(
                    session, 
                    "bio", 
                    f"About {data.person.name}",
                    f"{data.person.name} - {data.person.role}. {data.person.bio}"
                )

            # 2. Create Skill documents
            print(f"Creating {len(data.skills)} Skills...")
            skills_by_category = {}
            for skill in data.skills:
                session.run("""
                    MATCH (p:Person {name: $person_name})
                    CREATE (s:Skill {name: $name, category: $category})
                    CREATE (p)-[:MASTERED]->(s)
                """, {**skill.dict(), "person_name": data.person.name})
                
                # Group skills by category for document creation
                if skill.category not in skills_by_category:
                    skills_by_category[skill.category] = []
                skills_by_category[skill.category].append(skill.name)
            
            # Create a document for each skill category
            for category, skills in skills_by_category.items():
                self.create_document(
                    session,
                    "skills",
                    f"{category} Skills",
                    f"{data.person.name} has expertise in {category}: {', '.join(skills)}."
                )

            # 3. Create Education documents
            print(f"Creating {len(data.education)} Education entries...")
            for edu in data.education:
                session.run("""
                    MATCH (p:Person {name: $person_name})
                    CREATE (e:Education {institution: $institution, degree: $degree, year: $year, location: $location})
                    CREATE (p)-[:STUDIED_AT]->(e)
                """, {**edu.dict(), "person_name": data.person.name})
                
                self.create_document(
                    session,
                    "education",
                    f"Education at {edu.institution}",
                    f"{data.person.name} is pursuing {edu.degree} at {edu.institution} ({edu.year}), located in {edu.location}."
                )

            # 4. Create Experience documents
            print(f"Creating {len(data.experience)} Experience entries...")
            for exp in data.experience:
                session.run("""
                    MATCH (p:Person {name: $person_name})
                    CREATE (j:Job {role: $role, company: $company, duration: $duration, type: $type, description: $description})
                    CREATE (c:Company {name: $company})
                    CREATE (p)-[:WORKED_AT]->(j)
                    CREATE (j)-[:AT_COMPANY]->(c)
                """, {**exp.dict(), "person_name": data.person.name})
                
                self.create_document(
                    session,
                    "experience",
                    f"{exp.role} at {exp.company}",
                    f"{data.person.name} worked as {exp.role} at {exp.company} ({exp.duration}, {exp.type}). {exp.description} Skills used: {', '.join(exp.skills_used)}."
                )

            # 5. Create Project documents
            print(f"Creating {len(data.projects)} Projects...")
            for proj in data.projects:
                session.run("""
                    MATCH (p:Person {name: $person_name})
                    CREATE (pr:Project {name: $name, tagline: $tagline, description: $description})
                    CREATE (p)-[:CREATED]->(pr)
                """, {**proj.dict(), "person_name": data.person.name})
                
                self.create_document(
                    session,
                    "project",
                    proj.name,
                    f"Project: {proj.name} - {proj.tagline}. {proj.description} Tech stack: {', '.join(proj.tech_stack)}."
                )

            # 6. Create Achievement documents
            print(f"Creating {len(data.achievements)} Achievements...")
            for ach in data.achievements:
                session.run("""
                    MATCH (p:Person {name: $person_name})
                    CREATE (a:Award {name: $name, rank: $rank, context: $context, track: $track})
                    CREATE (p)-[:WON]->(a)
                """, {**ach.dict(), "person_name": data.person.name})
                
                rank_text = f" (Rank: {ach.rank})" if ach.rank else ""
                self.create_document(
                    session,
                    "achievement",
                    ach.name,
                    f"Achievement: {ach.name}{rank_text}. {ach.context}"
                )

            # Create a comprehensive summary document
            all_skills = [s.name for s in data.skills]
            all_projects = [p.name for p in data.projects]
            self.create_document(
                session,
                "summary",
                f"Summary of {data.person.name}",
                f"{data.person.name} is an AI/ML specialist with expertise in {', '.join(all_skills[:10])} and more. "
                f"Notable projects include {', '.join(all_projects)}. "
                f"Education: {data.education[0].degree} from {data.education[0].institution}."
            )

            print("✅ Graph Ingestion Complete with Vector Embeddings! The Titan is online.")


if __name__ == "__main__":
    json_path = "cv_data.json"
    
    if os.path.exists(json_path):
        print(f"Loading data from {json_path}...")
        with open(json_path, 'r') as f:
            raw_data = json.load(f)
            data_to_ingest = CVData(**raw_data)
        
        ingester = CVIngester(URI, USERNAME, PASSWORD)
        try:
            ingester.ingest(data_to_ingest)
        finally:
            ingester.close()
    else:
        print(f"No data file found at {json_path}. Please create it first.")
