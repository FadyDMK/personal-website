import { useRef, useMemo, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";
import FloatingParticles from "../FloatingParticles/FloatingParticles";

function GradientBackground({
  color1 = "#fafcfc",
  color2 = "#191c1b",
  distribution = 0.85,
}) {
  const materialRef = useRef(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorBottom: { value: new THREE.Color(color1) },
        colorTop: { value: new THREE.Color(color2) },
        distribution: { value: distribution }, // Add distribution uniform
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorBottom;
        uniform vec3 colorTop;
        uniform float distribution;
        varying vec2 vUv;
        
        void main() {
          // Apply distribution to control gradient
          // This creates a sharper transition at the specified distribution point
          float mixFactor = smoothstep(0.0, distribution * 2.0, vUv.y);
          
          vec3 color = mix(colorBottom, colorTop, mixFactor);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      depthWrite: false,
    });
  }, [color1, color2, distribution]);

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[100, 100]} />
      <primitive object={material} ref={materialRef} />
    </mesh>
  );
}

function NeonWaves({ opacity = 0.8 }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => new THREE.PlaneGeometry(10, 10, 64, 64), []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color("#416b5f") },
        glowColor: { value: new THREE.Color("#686fa1") },
        opacity: { value: opacity }, // Add opacity uniform
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying float vWaveHeight;

        void main() {
          vPosition = position;
          
          float x = position.x;
          float y = position.y;
          
          float waveX = 0.2 * sin(x * 2.0 + time * 0.7);
          float waveY = 0.2 * sin(y * 2.0 + time * 0.7);
          float waveXY = 0.05 * sin((x + y) * 3.0 + time * 0.4);
          
          vec3 pos = position;
          pos.z = waveX + waveY + waveXY;
          
          vWaveHeight = pos.z * 3.0;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 baseColor;
        uniform vec3 glowColor;
        uniform float opacity;  // Use the opacity uniform
        varying float vWaveHeight;
        
        void main() {
          float intensity = abs(vWaveHeight) * 2.0;
          vec3 color = mix(baseColor, glowColor, intensity);
          float brighten = pow(intensity, 1.5) * 0.8;
          color += brighten * glowColor;
          
          // Use the opacity uniform here
          gl_FragColor = vec4(color, opacity);
        }
      `,
      transparent: true,
    });
  }, [opacity]); // Re-create material when opacity changes

  useFrame(({ clock }) => {
    material.uniforms.time.value = clock.getElapsedTime();

    material.uniforms.opacity.value = opacity;

    const time = clock.getElapsedTime();
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);

      const waveX = 0.2 * Math.sin(x * 2.0 + time * 0.7);
      const waveY = 0.2 * Math.sin(y * 2.0 + time * 0.7);
      const waveXY = 0.05 * Math.sin((x + y) * 3.0 + time * 0.4);

      position.setZ(i, waveX + waveY + waveXY);
    }

    position.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 6, 0, 0]} position={[0, -1, 0]}>
      <primitive object={geometry} />
      <primitive object={material} />
    </mesh>
  );
}

const WaveBackground = memo(({ opacity = 0.8 }: { opacity: number }) => {
  const gradientStyle = {
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(4, 4, 133, 1) 50%)",
  };
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#0042ff") },
      uColorB: { value: new THREE.Color("#00fff2") },
    }),
    []
  );

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div style={gradientStyle}>
        <Canvas camera={{ position: [0, -11, 5], fov: 10 }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <GradientBackground />

          <NeonWaves opacity={opacity} />

          <FloatingParticles count={200} color="#940A31" size={0.5} />

          <EffectComposer>
            <Bloom
              intensity={1}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
            <ChromaticAberration offset={[0.0005, 0.0005]} />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
});

export default WaveBackground;
