import { useRef, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Info } from "lucide-react";
import { motion } from "framer-motion";

import ProjectMovie from "../../assets/project2.avif";
import ProjectBook from "../../assets/project3.avif";
import SectionParticles from "../SectionParticles/SectionsParticles";
import ProjectHawkeye from "../../assets/project1.avif";

gsap.registerPlugin(ScrollTrigger);

interface ProjectProps {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

function FlipCard({ project }: { project: ProjectProps }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 relative h-[400px] w-full cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              {project.title}
            </h3>
            <p className="text-white/80">{project.description}</p>
            <button className="mt-4 bg-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm border border-white/20">
              <Info size={16} />
              View Details
            </button>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden bg-secondary p-6 rounded-xl flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h3 className="text-2xl font-bold mb-4">{project.title}</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <p className="flex-grow">{project.description}</p>

          <div className="flex gap-4 mt-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={20} />
                Source Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={18} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const projects: ProjectProps[] = [
  {
    title: "HawkEye",
    description:
      "A 3D reconstruction app of a volleyball court using SfM techniques",
    imageUrl: ProjectHawkeye,
    technologies: ["Python", "OpenCV", "PyVista", "NumPy", "Matplotlib"],
    githubUrl: "https://github.com/FadyDMK/hawkeye",
  },
  {
    title: "Movie Logger App",
    description:
      "A full-stack movie logging application with user authentication",
    imageUrl: ProjectMovie,
    technologies: [
      "SvelteKit",
      "PostgreSQL",
      "Tailwind CSS",
      "Prisma",
      "Node.js",
    ],
    githubUrl: "https://github.com/FadyDMK/movie-logger",
    liveUrl: "https://fanciful-genie-6dfa4d.netlify.app/",
  },
  {
    title: "Book Loaning App",
    description:
      "Book loaning application with user authentication and admin features",
    imageUrl: ProjectBook,
    technologies: ["SpringBoot", "h2", "Hibernate", "ThymeLeaf", "JWT"],
    githubUrl: "https://github.com/FadyDMK/library-management",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: ProjectProps;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={cardRef}
      className={`relative flex flex-col lg:flex-row gap-8 ${
        index % 2 === 1 ? "lg:flex-row-reverse" : ""
      } mb-16`}
    >
      <div className="lg:w-1/2">
        <div className="relative overflow-hidden rounded-lg aspect-video bg-muted">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="lg:w-1/2 flex flex-col justify-center">
        <h3 className="text-3xl font-bold mb-3">{project.title}</h3>
        <p className="text-lg text-muted-foreground mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
                Source Code
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button size="sm" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={18} />
                Live Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".projects-heading",
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-4 max-w-7xl mx-auto">
      <SectionParticles
        color="#940A31"
        count={500}
        size={0.1}
        opacity={0.2}
        zIndex={-5}
      />
      <h2 className="projects-heading text-4xl md:text-5xl font-bold text-center mb-16">
        My Projects
      </h2>

      <div className="space-y-24">
        {projects.map((project, index) => (
          <>
            <div className="hidden lg:block">
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            </div>
            <div className="lg:hidden">
              <FlipCard key={project.title} project={project} />
            </div>
          </>
        ))}
      </div>
    </section>
  );
}

export default Projects;
