"use client";

import { motion } from "framer-motion";

const PROJECTS = [
    {
        year: "2024",
        title: "The Titan AI",
        desc: "Autonomous agentic system for complex code generation.",
        tech: ["Python", "Neo4j", "LangChain"]
    },
    {
        year: "2023",
        title: "Quantum Ledger",
        desc: "High-frequency trading bot with < 1ms latency.",
        tech: ["Rust", "C++", "Solana"]
    },
    {
        year: "2022",
        title: "Neural Vision",
        desc: "Real-time object detection for autonomous drones.",
        tech: ["PyTorch", "CUDA", "OpenCV"]
    }
];

export const Ledger = () => {
    return (
        <section className="min-h-screen w-full flex flex-col items-center pt-32 px-4 pb-32 text-white">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full"
            >
                <header className="mb-24 text-center">
                    <h2 className="text-6xl font-serif mb-4">THE LEDGER</h2>
                    <p className="text-neutral-400 font-mono text-sm tracking-widest uppercase">
                        A History of Violence & Victory
                    </p>
                </header>

                <div className="space-y-32">
                    {/* Metrics / Power Section */}
                    <div className="grid grid-cols-3 gap-8 border-y border-white/10 py-12">
                        <div className="text-center">
                            <h4 className="text-4xl font-serif">15+</h4>
                            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">Major Projects</p>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <h4 className="text-4xl font-serif">1.2M</h4>
                            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">Lines of Code</p>
                        </div>
                        <div className="text-center border-l border-white/10">
                            <h4 className="text-4xl font-serif">∞</h4>
                            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">Potential</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative border-l border-white/10 ml-4 md:ml-0 md:pl-0">
                        {PROJECTS.map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="mb-24 relative pl-12 md:pl-0 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-12 items-center"
                            >
                                {/* Dot */}
                                <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 top-2 h-2.5 w-2.5 rounded-full bg-white ring-4 ring-black" />

                                <div className={`md:text-right ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : 'md:col-start-3 md:row-start-1'}`}>
                                    <span className="font-mono text-xs text-blue-400 mb-2 block">{project.year}</span>
                                    <h3 className="text-3xl font-serif mb-4">{project.title}</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                                        {project.desc}
                                    </p>
                                    <div className={`flex flex-wrap gap-2 ${index % 2 === 1 ? 'md:justify-end' : 'md:justify-start'}`}>
                                        {project.tech.map(t => (
                                            <span key={t} className="px-2 py-1 text-[10px] border border-white/10 rounded-md text-neutral-500">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
