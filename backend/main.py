from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Preekshit Saklani Portfolio API")

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "The Titan's Digital Twin is Online."}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    # Placeholder for LangChain/Neo4j integration
    return {"response": f"I received your message: '{request.message}'. My memory banks are initializing..."}

@app.post("/api/update_knowledge")
async def update_knowledge():
    # Placeholder for RAG update
    return {"status": "Knowledge graph updated."}
