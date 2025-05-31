import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profilePic from "../../assets/pic.jpg";
import SectionParticles from "../SectionParticles/SectionsParticles";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate heading
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

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-secondary/10 relative">
      <SectionParticles
        color="#940A31"
        count={200}
        size={0.3}
        opacity={0.2}
        zIndex={-5}
      />
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
                />
              </div>
            </div>

            <div className="md:w-2/3">
              <p className="mb-4">
                Aspiring Software Engineer with a focus on back-end and
                full-stack development. A Computer Engineering student at the
                University of Pécs
              </p>
              <p>
                With hands-on experience in JavaScript, TypeScript, C# ,Java
                ,and Python, strong foundation in software development, web
                technologies, and agile teamwork. Eager to grow in a fast-paced,
                collaborative environment.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-12 mb-4">My Skills</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "JavaScript",
              "TypeScript",
              "React",
              "Java",
              "SpringBoot",
              "SvelteKit",
              "PL/SQL",
              "PostgreSQL",
              "Tailwind CSS",
              "Blender",
              "Three.js",
              "Git",
            ].map((skill) => (
              <div
                key={skill}
                className="bg-card p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow"
              >
                {skill}
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold mt-12 mb-4">My Journey</h3>
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
