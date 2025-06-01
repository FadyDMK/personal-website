import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Here’s how it works: The 7 dots simply move around a circle, 
// increasing the distance from each other while the sine and cosine parts of the circle go 
// out of sync (this makes it look like the circle is “turning” in space). 
// Sometimes the dots overlap to give the impression of fewer dots. It’s hard to explain, 
// but I find it extremely cool that they chose to use 7 dots (rather than the more pedestrian 8).



interface PS2LoadingScreenProps {
  onLoadingComplete: () => void;
}

function LoadingScreen({ onLoadingComplete }: PS2LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const previousTimeRef = useRef<number>(0);
  const dotsRef = useRef<Array<{
    x: number, 
    y: number, 
    trail: Array<{x: number, y: number, age: number}>
  }>>([]);
  
  // Animation parameters
  const dotCount = 7;
  const baseRadius = 60;
  const dotRadius = 4;
  const maxTrailLength = 15; // Increased trail length
  const rotationSpeed = 0.0015;
  const expansionFactor = 0.5;
  
  // Initialize the dots
  useEffect(() => {
    dotsRef.current = Array(dotCount).fill(0).map((_, i) => {
      const angle = (i / dotCount) * Math.PI * 2;
      const x = Math.cos(angle) * baseRadius;
      const y = Math.sin(angle) * baseRadius;
      return { 
        x, 
        y, 
        trail: [] // Initialize empty trail
      };
    });
  }, []);
  
  // Loading progress simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 200);
    
    return () => clearInterval(timer);
  }, [onLoadingComplete]);
  
  // PS2-style animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 240 * dpr;
    canvas.height = 240 * dpr;
    ctx.scale(dpr, dpr);
    
    // Enable shadow for glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(120, 180, 255, 0.8)';
    
    // Animation loop
    const animate = (time: number) => {
      if (!previousTimeRef.current) {
        previousTimeRef.current = time;
      }
      
      const deltaTime = time - previousTimeRef.current;
      previousTimeRef.current = time;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate center of canvas
      const centerX = canvas.width / (2 * dpr);
      const centerY = canvas.height / (2 * dpr);
      
      // Update and render each dot
      dotsRef.current.forEach((dot, i) => {
        // Save previous position
        const prevX = dot.x;
        const prevY = dot.y;
        
        // Calculate new position with PS2 effect
        const angle = (i / dotCount) * Math.PI * 2;
        const timeFactor = time * rotationSpeed;
        const xOffset = Math.cos(angle + timeFactor) * (baseRadius + Math.sin(timeFactor * 0.6) * baseRadius * expansionFactor);
        const yOffset = Math.sin(angle + timeFactor * 1.2) * (baseRadius + Math.cos(timeFactor * 0.6) * baseRadius * expansionFactor);
        
        dot.x = centerX + xOffset;
        dot.y = centerY + yOffset;
        
        // Add current position to trail
        dot.trail.unshift({ x: dot.x, y: dot.y, age: 0 });
        
        // Limit trail length
        if (dot.trail.length > maxTrailLength) {
          dot.trail.pop();
        }
        
        // Age all trail points
        dot.trail.forEach(point => {
          point.age += 1;
        });
        
        // Draw trail segments
        if (dot.trail.length > 1) {
          for (let j = 0; j < dot.trail.length - 1; j++) {
            const point = dot.trail[j];
            const nextPoint = dot.trail[j + 1];
            const alpha = 1 - (point.age / maxTrailLength);
            
            // Draw trail with gradient
            const gradient = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y);
            gradient.addColorStop(0, `rgba(90, 150, 255, ${alpha * 0.8})`);
            gradient.addColorStop(1, `rgba(30, 100, 255, ${alpha * 0.3})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = dotRadius * (1.2 - point.age / maxTrailLength * 0.8);
            ctx.lineCap = 'round';
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
          }
        }
        
        // Draw glow around dot
        ctx.beginPath();
        const glowGradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, dotRadius * 3
        );
        glowGradient.addColorStop(0, 'rgba(150, 200, 255, 0.8)');
        glowGradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.3)');
        glowGradient.addColorStop(1, 'rgba(50, 100, 255, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.arc(dot.x, dot.y, dotRadius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw the dot itself
        ctx.shadowBlur = 10;
        ctx.beginPath();
        const dotGradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, dotRadius
        );
        dotGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        dotGradient.addColorStop(0.5, 'rgba(220, 240, 255, 0.9)');
        dotGradient.addColorStop(1, 'rgba(200, 220, 255, 0.7)');
        
        ctx.fillStyle = dotGradient;
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-60 h-60 mb-8">
        <canvas 
          ref={canvasRef} 
          className="w-60 h-60"
          style={{ width: '240px', height: '240px' }}
        />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4">Loading Experience</h2>
      
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500" // PS2 blue
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-white/70 mt-2">{Math.round(progress)}%</p>
    </motion.div>
  );
}

export default LoadingScreen;