import { useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { Link as ScrollLink } from "react-scroll";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import WaveBackground from "../WaveBackground/WaveBackground";

function TerminalIntro() {
  const [text] = useTypewriter({
    words: [
      "> Full Stack Developer",
      "> Computer Science Engineering Student",
      "> Constant Learner",
      "> Ready for my next challenge!",
    ],
    loop: 3,
    typeSpeed: 70,
    deleteSpeed: 20,
    delaySpeed: 1500,
  });

  return (
    <div className="font-mono bg-black/80 text-green-400 p-4 text-center rounded-md shadow-lg max-w-lg mx-auto mb-8">
      <div className="flex gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="h-24 flex items-center justify-center text-lg">
        <span>{text}</span>
        <Cursor cursorColor="white" />
      </div>
    </div>
  );
}

export function Hero({name="Fady Damak"}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          duration: 0.8,
          ease: "power3.out",
        },
      });

      // Only target elements that exist
      gsap.set([btnRef.current], {
        opacity: 0,
        y: 20,
      });

      // Simple animation sequence
      tl.to(btnRef.current, {
        opacity: 1,
        y: 0,
        delay: 0.2,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 text-center overflow-hidden"
    >
      <WaveBackground opacity={0.4} />

      <div className="max-w-3xl relative z-10">
        <h1
          ref={nameRef}
          className="text-5xl md:text-7xl font-bold tracking-tight text-black drop-shadow-sm pb-4 md:pb-6"
        >
          {name}
        </h1>

        <TerminalIntro />

        <div ref={btnRef} className="mt-8 flex gap-4 justify-center">
          <Button size="lg" asChild>
            <ScrollLink
              to="projects"
              spy={true}
              smooth={true}
              duration={500}
              offset={-70}
            >
              View My Work
            </ScrollLink>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <ScrollLink
              to="contact"
              spy={true}
              smooth={true}
              duration={500}
              offset={-70}
            >
              Contact Me
            </ScrollLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
export default Hero;
