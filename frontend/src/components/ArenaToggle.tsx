"use client";

import { motion } from "framer-motion";
import { Brain, Trophy } from "lucide-react";
import clsx from "clsx";

interface ArenaToggleProps {
    mode: "chess" | "football";
    setMode: (mode: "chess" | "football") => void;
}

export const ArenaToggle = ({ mode, setMode }: ArenaToggleProps) => {
    return (
        <div className="flex items-center gap-4 rounded-full bg-white/5 p-1 backdrop-blur-md border border-white/10">
            <button
                onClick={() => setMode("chess")}
                className={clsx(
                    "relative flex items-center gap-2 rounded-full px-6 py-2 transition-all duration-300",
                    mode === "chess" ? "text-white" : "text-neutral-400 hover:text-white"
                )}
            >
                {mode === "chess" && (
                    <motion.div
                        layoutId="active-arena"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
                <Brain size={16} />
                <span className="font-serif z-10">Grandmaster</span>
            </button>

            <button
                onClick={() => setMode("football")}
                className={clsx(
                    "relative flex items-center gap-2 rounded-full px-6 py-2 transition-all duration-300",
                    mode === "football" ? "text-white" : "text-neutral-400 hover:text-white"
                )}
            >
                {mode === "football" && (
                    <motion.div
                        layoutId="active-arena"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
                <Trophy size={16} />
                <span className="font-serif z-10">Striker</span>
            </button>
        </div>
    );
};
