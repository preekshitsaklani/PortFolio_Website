"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { ProjectCarousel, Project } from "./ProjectCard";

interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
    showProjects?: boolean;
}

interface DigitalTwinChatProps {
    isChatActive: boolean;
    onChatActivityChange: (active: boolean) => void;
}

const SUGGESTIONS = ["ME", "Projects", "SKILLS", "CONTACT"];

// Keywords that indicate a project-related query
const PROJECT_KEYWORDS = ["project", "projects", "work", "portfolio", "built", "created", "developed", "made"];

export const DigitalTwinChat = ({ isChatActive, onChatActivityChange }: DigitalTwinChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                const data = await response.json();
                setProjects(data.projects || []);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };
        fetchProjects();
    }, []);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isChatActive]);

    // Auto-focus input when activating chat
    useEffect(() => {
        if (isChatActive && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 500);
        }
    }, [isChatActive]);

    const isProjectQuery = (message: string): boolean => {
        const lowerMessage = message.toLowerCase();
        return PROJECT_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        const isProjectRelated = isProjectQuery(userMessage);

        const newMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userMessage,
        };

        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "bot",
                    content: isProjectRelated
                        ? "I've worked on some exciting projects! Here are a few highlights:"
                        : (data.response || "I couldn't process that request. Please try again."),
                    showProjects: isProjectRelated,
                },
            ]);
        } catch (error) {
            console.error('Chat API error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "bot",
                    content: "I'm experiencing technical difficulties. Please try again in a moment.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (text: string) => {
        setInput(text);
        if (inputRef.current) inputRef.current.focus();
    };

    return (
        <>
            {/* Back Button (Top Right) - Only visible when chat is active */}
            <AnimatePresence>
                {isChatActive && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => onChatActivityChange(false)}
                        className="fixed top-8 right-8 z-[60] p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 backdrop-blur-md group"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Main Chat Interface */}
            <div
                className={clsx(
                    "fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isChatActive
                        ? "inset-0 flex flex-col items-center justify-center p-4 md:p-8"
                        : "bottom-32 left-1/2 -translate-x-1/2 w-full max-w-lg px-4"
                )}
            >
                {/* Chat History Area - Only visible when active */}
                <AnimatePresence>
                    {isChatActive && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="w-full max-w-3xl flex-1 mb-8 overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                            >
                                {messages.map((msg) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg.id}
                                        className={clsx(
                                            "flex gap-4",
                                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-lg backdrop-blur-sm overflow-hidden",
                                                msg.role === "user" ? "bg-white/5 border border-white/10" : ""
                                            )}
                                        >
                                            {msg.role === "user" ? (
                                                <User size={18} />
                                            ) : (
                                                <img
                                                    src="/logo_in_dark_mode.png"
                                                    alt="Twin"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div
                                            className={clsx(
                                                "max-w-[80%] text-base leading-relaxed",
                                                msg.role === "user"
                                                    ? "bg-white text-black rounded-2xl px-6 py-4 backdrop-blur-md shadow-sm"
                                                    : "text-neutral-200 py-2 px-0"
                                            )}
                                        >
                                            {msg.content}
                                            {/* Render project cards if this is a project response */}
                                            {msg.showProjects && projects.length > 0 && (
                                                <div className="mt-4">
                                                    <ProjectCarousel projects={projects} />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Interaction Area */}
                <motion.div
                    layout
                    className="w-full max-w-2xl flex flex-col gap-4"
                    onClick={() => !isChatActive && onChatActivityChange(true)}
                >
                    {/* Suggestion Chips - Only visible when active */}
                    <AnimatePresence>
                        {isChatActive && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: 10, height: 0 }}
                                className="flex justify-center gap-2 mb-2"
                            >
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSuggestionClick(s);
                                        }}
                                        className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm font-medium text-neutral-300 hover:bg-white/10 hover:text-white hover:border-emerald-500/50 transition-all backdrop-blur-md"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input Bar */}
                    <motion.div
                        layout
                        className={clsx(
                            "relative flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 transition-all duration-300 group",
                            isChatActive ? "rounded-3xl p-4 md:p-5 shadow-2xl border-white/20" : "rounded-full px-6 py-4 shadow-lg hover:border-white/30 cursor-pointer"
                        )}
                    >
                        {/* Text Input */}
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            readOnly={!isChatActive}
                            placeholder={isChatActive ? "Ask me anything..." : "Ask me anything..."}
                            className="flex-1 bg-transparent text-white placeholder-neutral-500 outline-none text-base md:text-lg pl-2"
                        />

                        {/* Send Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSend();
                            }}
                            className={clsx(
                                "flex items-center justify-center rounded-full transition-all",
                                isChatActive
                                    ? "bg-white text-black h-10 w-10 hover:bg-emerald-400 hover:scale-105"
                                    : "bg-white/10 text-neutral-400 h-8 w-8 group-hover:bg-white group-hover:text-black"
                            )}
                        >
                            <Send size={isChatActive ? 18 : 14} />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};
