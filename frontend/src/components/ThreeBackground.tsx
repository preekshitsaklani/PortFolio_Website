"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RandomDot } from "@/components/RandomDot";

export const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 3], fov: 75 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.5} />
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                <RandomDot position={[-1, 1, 0.5]} />
                <RandomDot position={[1.5, -0.5, 0]} />
                <RandomDot position={[-0.5, -1, 0.2]} />
                <RandomDot position={[0, 0.5, 0.8]} />
            </Canvas>
        </div>
    );
};
