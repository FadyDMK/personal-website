import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import ProjectMovie from "../../assets/project2.png";
import ProjectBook from "../../assets/project3.png";
import SectionParticles from "../SectionParticles/SectionsParticles";

gsap.registerPlugin(ScrollTrigger);

interface ProjectProps {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const projects: ProjectProps[] = [
  {
    title: "HawkEye",
    description:
      "A 3D reconstruction app of a volleyball court using SfM techniques",
    imageUrl: "/project1.jpg",
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
      <SectionParticles
        color="#940A31"
        count={10}
        size={0.3}
        opacity={0.2}
        zIndex={-5}
      />
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
    <section ref={sectionRef} className="py-24 px-4 max-w-7xl mx-auto">
      <h2 className="projects-heading text-4xl md:text-5xl font-bold text-center mb-16">
        My Projects
      </h2>

      <div className="space-y-24">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
