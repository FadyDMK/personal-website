import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";


function FloatingParticles({ count = 100, color = "#ffffff", size = 0.05 }) {
  const particles = useRef<THREE.Points>(null!);

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      speeds[i] = 0.2 + Math.random() * 0.8;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));
    return geometry;
  }, [count]);

  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size,
      transparent: true,
      blending: THREE.AdditiveBlending,
      map: createParticleTexture(),
      depthWrite: false,
      color: new THREE.Color(color),
    });
  }, [color, size]);

  function createParticleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;

    const context = canvas.getContext("2d")!;
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);

    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.3)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  useFrame(({ clock }) => {
    if (!particles.current) return;

    const time = clock.getElapsedTime();
    const positions = particles.current.geometry.attributes.position;
    const speeds = particles.current.geometry.attributes.speed;

    for (let i = 0; i < count; i++) {
      const speed = speeds.getX(i);

      positions.setY(i, positions.getY(i) + speed * 0.005);

      positions.setX(i, positions.getX(i) + Math.sin(time * 0.5 + i) * 0.003);

      if (positions.getY(i) > 8) {
        positions.setY(i, -8);
      }
    }

    positions.needsUpdate = true;
  });

  return (
    <points ref={particles}>
      <primitive object={particlesGeometry} />
      <primitive object={particleMaterial} />
    </points>
  );
}


export default FloatingParticles;