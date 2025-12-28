import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profilePic from "../../assets/pic.avif";
import SectionParticles from "../SectionParticles/SectionsParticles";
import SkillConstellation from "../SkillConstellation/SkillConstellation";

gsap.registerPlugin(ScrollTrigger);

const getAboutParticleBudget = () => {
  if (typeof window === "undefined") return 200;
  return window.innerWidth < 768 ? 90 : 200;
};

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [particleCount, setParticleCount] = useState(getAboutParticleBudget);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // heading
      gsap.fromTo(
        ".about-heading",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom-=100",
          },
        }
      );

      gsap.fromTo(
        ".about-content > *",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top bottom-=100",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setParticleCount(getAboutParticleBudget());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-secondary/10 relative">
      {hasEntered && (
        <SectionParticles
          color="#940A31"
          count={particleCount}
          size={0.3}
          opacity={0.2}
          zIndex={-5}
        />
      )}
      <div className="max-w-4xl mx-auto">
        <h2 className="about-heading text-4xl md:text-5xl font-bold text-center mb-16">
          About Me
        </h2>

        <div ref={contentRef} className="about-content space-y-6 text-lg">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <div className="md:w-1/3">
              <div className="rounded-full overflow-hidden w-48 h-48 mx-auto border-4 border-primary/20">
                <img
                  src={profilePic}
                  alt="Fady Damak"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className="md:w-2/3">
              <p className="mb-4">
                Aspiring Software Engineer with a focus on back-end and
                full-stack development. A Computer Engineering student at the
                University of Pécs
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-12 mb-4">My Skills</h3>

          
          <div className="relative h-[600px] mb-16">
            {hasEntered ? (
              <SkillConstellation />
            ) : (
              <div
                className="w-full h-full rounded-[32px] bg-black/20 animate-pulse"
                aria-hidden="true"
              />
            )}
          </div>
          <h3 className="text-2xl font-bold mt-12 mb-4 pt-[50px]">My Journey</h3>
          <p>
            My journey in IT started when I was a kid amazed by this magic box
            that responds to my commands through a mouse and keyboard. I started
            playing games and I wanted to know how computer can do all of this.
            I started learning how to code in 2018, and since then, I have been
            on a journey of continuous learning and growth. I have worked on
            various projects, from simple web applications to complex software
            solutions, always striving to improve my skills and deliver
            high-quality work.
          </p>

          <h3 className="text-2xl font-bold mt-12 mb-4">When I'm Not Coding</h3>
          <p>
            When I am not working on some personal projects, you can usually
            find me at the gym or biking in the forest.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
