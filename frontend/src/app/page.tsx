"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SovereignDock } from "@/components/SovereignDock";
import { ThreeBackground } from "@/components/ThreeBackground";
import { SpotlightBackground } from "@/components/SpotlightBackground";
import { AiNewsOverlay } from "@/components/AiNewsOverlay";
import { DigitalTwinChat } from "@/components/DigitalTwinChat";
import { Arena } from "@/modules/Arena";
import { Ledger } from "@/modules/Ledger/Portfolio";

export default function Home() {
    const [currentView, setCurrentView] = useState("enigma");
    const [isChatActive, setIsChatActive] = useState(false);

    return (
        <main
            className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden text-white"
        >
            <SpotlightBackground isChatActive={isChatActive} />
            <ThreeBackground />
            <AiNewsOverlay isChatActive={isChatActive} />

            {/* Main Content Wrapper - Fades out when chat is active */}
            <div className={`z-10 w-full flex flex-col items-center justify-between min-h-screen transition-all duration-700 ${isChatActive ? 'opacity-0 pointer-events-none scale-95 blur-sm' : 'opacity-100'}`}>
                <div className="fixed top-0 left-0 w-full z-10 flex items-center justify-between p-8 font-mono text-sm max-w-7xl mx-auto pointer-events-none">
                    <h1 className="text-xl font-serif tracking-wider pointer-events-auto">PREEKSHIT SAKLANI</h1>
                </div>

                <AnimatePresence mode="wait">
                    {currentView === "enigma" && (
                        <motion.div
                            key="enigma"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                        >
                            <div className="text-center group cursor-default pointer-events-auto">
                                <h2 className="text-6xl md:text-9xl font-serif tracking-tighter mix-blend-overlay opacity-50">
                                    NAMASKARAM
                                </h2>
                                <p className="text-white/30 text-lg font-light tracking-[0.3em] uppercase mt-4 mb-8">
                                    Crafting Intelligence Through Algorithm
                                </p>

                                <div className="relative inline-block mt-8">
                                    <span className="text-emerald-400/50 text-sm tracking-widest border border-emerald-400/20 px-4 py-2 rounded-full transition-all duration-500 group-hover:opacity-0">
                                        HOVER HERE
                                    </span>

                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                                        <p className="text-white font-light tracking-wider text-sm leading-relaxed bg-black/80 backdrop-blur-sm p-6 rounded-lg border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                                            A VISUAL SYNTHESIS OF NEURAL NETWORK TOPOLOGY AND LOSS SURFACE OPTIMIZATION
                                            <br /><br />
                                            <span className="text-emerald-400 animate-pulse">MOVE THE CURSOR TO EXPLORE MORE</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentView === "ledger" && (
                        <motion.div
                            key="ledger"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="w-full z-20 h-screen overflow-y-auto"
                        >
                            <Ledger />
                        </motion.div>
                    )}
                </AnimatePresence>

                <SovereignDock currentView={currentView} onNavigate={setCurrentView} />
            </div>

            <DigitalTwinChat isChatActive={isChatActive} onChatActivityChange={setIsChatActive} />
        </main>
    )
}

