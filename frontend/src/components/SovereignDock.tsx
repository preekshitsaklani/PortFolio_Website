"use client";

import { motion } from "framer-motion";
import { Link as LinkIcon, User, Layers, Code, Brain } from "lucide-react";
import clsx from "clsx";

interface DockItemProps {
    icon: any;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
}

const DockItem = ({ icon: Icon, label, onClick, isActive }: DockItemProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={clsx(
                "group relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300",
                isActive
                    ? "bg-white/20 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
                "backdrop-blur-md border",
                "shadow-lg shadow-black/20"
            )}
        >
            <Icon className={clsx("h-6 w-6 transition-colors", isActive ? "text-white" : "text-neutral-400 group-hover:text-white")} />
            <span className="absolute -top-10 scale-0 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                {label}
            </span>
        </motion.button>
    );
};

interface DockProps {
    currentView: string;
    onNavigate: (view: string) => void;
}

export const SovereignDock = ({ currentView, onNavigate }: DockProps) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="flex items-center gap-4 rounded-3xl bg-neutral-950/80 p-3 backdrop-blur-xl border border-white/5 shadow-2xl"
            >
                <DockItem
                    icon={User}
                    label="The Enigma"
                    isActive={currentView === "enigma"}
                    onClick={() => onNavigate("enigma")}
                />
            </motion.div>
        </div>
    );
};
