"use client";

import { Html } from "@react-three/drei";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FACTS = [
    "Once debugged a production issue at 3 AM using only 'print' statements.",
    "Built an entire chess engine in Python over a weekend.",
    "Believes 'vim' is the only true editor.",
    "Recovered a deleted database from a backup 2 seconds before the deadline.",
    "Won 'Best UI' at a hackathon using only CSS gradients.",
];

interface RandomDotProps {
    position: [number, number, number];
}

export const RandomDot = ({ position }: RandomDotProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [fact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)]);

    return (
        <group position={position}>
            <mesh
                onClick={() => setIsOpen(!isOpen)}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={isOpen ? "white" : "#444"} emissive={isOpen ? "white" : "black"} emissiveIntensity={0.5} />
            </mesh>

            <Html distanceFactor={10}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className="w-48 rounded-xl border border-white/10 bg-black/80 p-3 backdrop-blur-md"
                        >
                            <p className="font-mono text-xs text-neutral-300">
                                {fact}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Html>
        </group>
    );
};
