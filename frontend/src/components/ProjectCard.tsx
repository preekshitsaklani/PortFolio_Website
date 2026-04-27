"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Linkedin, Youtube } from "lucide-react";

export interface Project {
    name: string;
    tagline: string;
    category: string;
    year: string;
    gradient: string;
    description: string;
    tech_stack: string[];
    links: {
        website?: string;
        github?: string;
        linkedin?: string;
        youtube?: string;
    };
}

// Gradient mapping for project cards
const GRADIENT_STYLES: Record<string, string> = {
    "from-purple-600 to-indigo-900": "linear-gradient(135deg, #9333ea 0%, #312e81 100%)",
    "from-emerald-600 to-teal-900": "linear-gradient(135deg, #059669 0%, #134e4a 100%)",
    "from-rose-600 to-red-900": "linear-gradient(135deg, #e11d48 0%, #7f1d1d 100%)",
    "from-amber-600 to-orange-900": "linear-gradient(135deg, #d97706 0%, #7c2d12 100%)",
};

interface ProjectCardProps {
    project: Project;
    index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const gradientStyle = GRADIENT_STYLES[project.gradient] || "linear-gradient(135deg, #6366f1 0%, #1e1b4b 100%)";

    return (
        <>
            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setIsModalOpen(true)}
                style={{ background: gradientStyle }}
                className="flex-shrink-0 w-48 h-64 rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl flex flex-col justify-between overflow-hidden relative group"
            >
                {/* Category Badge */}
                <div className="text-white/70 text-xs font-medium">
                    {project.category}
                </div>

                {/* Project Name */}
                <div className="mt-auto">
                    <h3 className="text-white text-xl font-bold leading-tight">
                        {project.name}
                    </h3>
                    <p className="text-white/60 text-xs mt-1 line-clamp-2">
                        {project.tagline}
                    </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">View Details</span>
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-white/10"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-neutral-400 text-sm">{project.category}</span>
                                        <h2 className="text-white text-2xl font-bold mt-1">{project.name}</h2>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <X size={20} className="text-neutral-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Year */}
                                <div className="text-neutral-500 text-sm border-l-2 border-neutral-700 pl-3">
                                    {project.year}
                                </div>

                                {/* Description */}
                                <p className="text-neutral-300 text-sm leading-relaxed">
                                    {project.description}
                                </p>

                                {/* Tech Stack */}
                                <div>
                                    <h4 className="text-neutral-500 text-xs uppercase tracking-wider mb-3">Technologies</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded-full border border-neutral-700"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Links */}
                                {Object.keys(project.links).length > 0 && (
                                    <div>
                                        <h4 className="text-neutral-500 text-xs uppercase tracking-wider mb-3">Links</h4>
                                        <div className="space-y-2">
                                            {project.links.website && (
                                                <a
                                                    href={project.links.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors group"
                                                >
                                                    <span className="text-neutral-300 text-sm">Website</span>
                                                    <ExternalLink size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
                                                </a>
                                            )}
                                            {project.links.github && (
                                                <a
                                                    href={project.links.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors group"
                                                >
                                                    <span className="text-neutral-300 text-sm">Github</span>
                                                    <Github size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
                                                </a>
                                            )}
                                            {project.links.linkedin && (
                                                <a
                                                    href={project.links.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors group"
                                                >
                                                    <span className="text-neutral-300 text-sm">Linkedin</span>
                                                    <Linkedin size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
                                                </a>
                                            )}
                                            {project.links.youtube && (
                                                <a
                                                    href={project.links.youtube}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors group"
                                                >
                                                    <span className="text-neutral-300 text-sm">Youtube Video</span>
                                                    <Youtube size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

interface ProjectCarouselProps {
    projects: Project[];
    introText?: string;
}

export const ProjectCarousel = ({ projects, introText }: ProjectCarouselProps) => {
    return (
        <div className="w-full">
            {introText && (
                <p className="text-neutral-300 text-base mb-4">{introText}</p>
            )}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent -mx-2 px-2">
                {projects.map((project, index) => (
                    <ProjectCard key={project.name} project={project} index={index} />
                ))}
            </div>
        </div>
    );
};
