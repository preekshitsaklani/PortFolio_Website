"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AI_NEWS = [
    "DeepMind's AlphaFold 3 predicts structure of nearly all of life's molecules.",
    "OpenAI releases GPT-5 with reasoning capabilities surpassing human experts.",
    "Figure 02 robot demonstrates end-to-end neural network control for precise manipulation.",
    "Google's Gemini 2.0 achieves breakthrough in multimodal long-context understanding.",
    "Neuralink successfully implants second patient with Telepathy brain-chip interface.",
    "Stability AI introduces Stable Diffusion 4, enabling real-time 8k video generation.",
    "Meta open sources Llama 4, a 400B parameter model optimized for consumer hardware.",
    "Anthropic's Claude 4 Opus shows signs of self-reflective novel reasoning.",
    "Tesla FSD v13 achieves Level 4 autonomy in complex urban environments.",
    "Medical AI agent diagnoses rare genetic disorder from facial scan in seconds."
];

interface AiNewsOverlayProps {
    isChatActive?: boolean;
}

export const AiNewsOverlay = ({ isChatActive = false }: AiNewsOverlayProps) => {
    const [activeNews, setActiveNews] = useState<string | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Initialize offscreen canvas and load image
    useEffect(() => {
        const img = new Image();
        img.src = '/logo_in_dark_mode.png';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvasRef.current = canvas;
                imageRef.current = img;
                setIsImageLoaded(true);
            }
        };
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        // If chat is active or image/canvas not ready, do nothing and hide news
        if (isChatActive) {
            setActiveNews(null);
            return;
        }

        if (!canvasRef.current || !imageRef.current) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const img = imageRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Calculate image rendering dimensions (equivalent to object-fit: contain)
        const imageAspect = img.width / img.height;
        const screenAspect = innerWidth / innerHeight;

        let renderWidth, renderHeight, offsetX, offsetY;

        if (screenAspect > imageAspect) {
            // Screen is wider than image (cover width, crop height)
            renderWidth = innerWidth;
            renderHeight = img.height * (innerWidth / img.width);
            offsetX = 0;
            offsetY = (innerHeight - renderHeight) / 2;
        } else {
            // Screen is narrower than image (cover height, crop width)
            renderHeight = innerHeight;
            renderWidth = img.width * (innerHeight / img.height);
            offsetX = (innerWidth - renderWidth) / 2;
            offsetY = 0;
        }

        // Map mouse coordinates to image coordinates
        const relativeX = clientX - offsetX;
        const relativeY = clientY - offsetY;

        // Check if cursor is within the rendered image area
        if (relativeX >= 0 && relativeX <= renderWidth && relativeY >= 0 && relativeY <= renderHeight) {
            // Scale coordinates to original image size
            const imageX = Math.floor((relativeX / renderWidth) * img.width);
            const imageY = Math.floor((relativeY / renderHeight) * img.height);

            try {
                const pixel = ctx.getImageData(imageX, imageY, 1, 1).data;
                // Check brightness/alpha to detect lines
                // Assuming lines are brighter than the background (black or dark)
                // Adjust threshold as needed based on the actual image
                const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;
                const alpha = pixel[3];

                // Threshold: Not fully transparent AND has some brightness
                if (alpha > 20 && brightness > 30) {
                    // We are on a line
                    if (!activeNews) {
                        const randomNews = AI_NEWS[Math.floor(Math.random() * AI_NEWS.length)];
                        setActiveNews(randomNews);
                    }
                    setCursorPos({ x: clientX, y: clientY });
                } else {
                    setActiveNews(null);
                }
            } catch (err) {
                // Ignore cross-origin errors if any (shouldn't happen with local file)
            }
        } else {
            setActiveNews(null);
        }

    }, [activeNews, isImageLoaded, isChatActive]);

    useEffect(() => {
        if (isImageLoaded) {
            window.addEventListener("mousemove", handleMouseMove);
            return () => window.removeEventListener("mousemove", handleMouseMove);
        }
    }, [handleMouseMove, isImageLoaded]);

    return (
        <AnimatePresence>
            {activeNews && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'fixed',
                        left: cursorPos.x,
                        top: cursorPos.y,
                        zIndex: 50,
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -120%)' // Center horizontally, position above cursor
                    }}
                >
                    <div className="bg-black/80 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-xl text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] max-w-sm text-center">
                        <span className="text-emerald-400 font-mono text-[10px] uppercase block tracking-widest mb-1">
                            System Alert
                        </span>
                        <span className="font-light tracking-wide text-sm leading-snug block text-emerald-50">
                            {activeNews}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
