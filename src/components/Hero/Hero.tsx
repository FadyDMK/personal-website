import { useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import WaveBackground from "../WaveBackground/WaveBackground";

interface HeroProps {
  name?: string;
  title?: string;
  description?: string;
}

export function Hero({
  name = "Your Name",
  title = "Software Developer",
  description = "I build modern web applications with React, TypeScript, and cutting-edge technologies.",
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          duration: 0.8,
          ease: "power3.out",
        },
      });

      // Set initial opacity to prevent flash
      gsap.set(
        [nameRef.current, titleRef.current, descRef.current, btnRef.current],
        {
          opacity: 0,
          y: 20,
        }
      );

      tl.to(nameRef.current, {
        opacity: 1,
        y: 0,
        delay: 0.2,
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
          },
          "-=0.6"
        )
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
          },
          "-=0.6"
        )
        .to(
          btnRef.current,
          {
            opacity: 1,
            y: 0,
          },
          "-=0.6"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 text-center overflow-hidden"
    >
      <WaveBackground opacity={0.4}/>

      <div className="max-w-3xl relative z-10">
        <h1
          ref={nameRef}
          className="text-5xl md:text-7xl font-bold tracking-tight text-black drop-shadow-sm"
        >
          {name}
        </h1>
        <h2
          ref={titleRef}
          className="text-2xl md:text-3xl mt-4 text-primary drop-shadow-sm"
        >
          {title}
        </h2>
        <p
          ref={descRef}
          className="mt-6 text-lg md:text-xl "
        >
          {description}
        </p>

        <div ref={btnRef} className="mt-8 flex gap-4 justify-center">
          <Button size="lg">View My Work</Button>
          <Button variant="outline" size="lg">
            Contact Me
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
