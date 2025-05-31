import { Canvas } from "@react-three/fiber";
import FloatingParticles from "../FloatingParticles/FloatingParticles";

interface SectionParticlesProps {
  color?: string;
  count?: number;
  size?: number;
  opacity?: number;
  zIndex?: number;
}

function SectionParticles({
  color = "#940A31",
  count = 100,
  size = 0.5,
  opacity = 0.6,
  zIndex = -5,
}: SectionParticlesProps) {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none" 
      style={{ zIndex, opacity }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <FloatingParticles count={count} color={color} size={size} />
      </Canvas>
    </div>
  );
}

export default SectionParticles;