import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

//SKYRIM CONSTELLATION LESSGOO

interface SkillData {
  id: string;
  name: string;
  category: "frontend" | "backend" | "design" | "tools" | "languages";
  proficiency: number;
  description?: string;
  connections?: string[];
  position?: [number, number];
}

const skills: SkillData[] = [
  // Frontend Constellation
  {
    id: "react",
    name: "React",
    category: "frontend",
    proficiency: 0.9,
    description: "Component-based UI library",
    position: [50, 30],
    connections: ["typescript", "nextjs", "redux"],
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "frontend",
    proficiency: 0.8,
    description: "React framework for production",
    position: [70, 20],
    connections: ["react"],
  },
  {
    id: "svelte",
    name: "Svelte",
    category: "frontend",
    proficiency: 0.8,
    description: "The frontend framework that all devs love but no one uses",
    position: [30, 40],
    connections: ["react"],
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "frontend",
    proficiency: 0.75,
    description: "3D graphics in the browser",
    position: [60, 50],
    connections: ["gsap"],
  },
  {
    id: "gsap",
    name: "GSAP",
    category: "frontend",
    proficiency: 0.8,
    description: "Animation library",
    position: [40, 60],
    connections: ["threejs", "css", "react"],
  },
  {
    id: "css",
    name: "CSS/Tailwind",
    category: "frontend",
    proficiency: 0.85,
    description: "Styling and design",
    position: [20, 50],
    connections: ["gsap", "html"],
  },
  {
    id: "html",
    name: "HTML",
    category: "frontend",
    proficiency: 0.9,
    description: "Web markup language",
    position: [10, 30],
    connections: ["css"],
  },
  {
    id: "thymeLeaf",
    name: "Thymeleaf",
    category: "frontend",
    proficiency: 0.6,
    description: "HTML template generator for SpringBoot",
    position: [20, 30],
    connections: ["html"],
  },

  // Backend Constellation
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    proficiency: 0.8,
    description: "JavaScript runtime",
    position: [50, 30],
    connections: ["express", "mongodb"],
  },
  {
    id: "express",
    name: "Express",
    category: "backend",
    proficiency: 0.8,
    description: "Web framework for Node.js",
    position: [70, 30],
    connections: ["nodejs"],
  },
  {
    id: "plsql",
    name: "PL/SQL",
    category: "backend",
    proficiency: 0.7,
    description: "API query language",
    position: [60, 50],
    connections: ["nodejs", "postgres"],
  },
  {
    id: "springboot",
    name: "SpringBoot",
    category: "backend",
    proficiency: 0.75,
    description: "Java framework for building APIs",
    position: [30, 60],
    connections: ["postgres"],
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "backend",
    proficiency: 0.7,
    description: "Relational database",
    position: [70, 70],
    connections: ["prisma"],
  },
  {
    id: "mssql",
    name: "MS SQL",
    category: "backend",
    proficiency: 0.7,
    description: "Microsoft's relational database",
    position: [80, 50],
    connections: ["prisma", "plsql", "postgres"],
  },
  {
    id: "prisma",
    name: "Prisma",
    category: "backend",
    proficiency: 0.65,
    description: "ORM for TypeScript",
    position: [90, 60],
    connections: ["postgres", "typescript"],
  },

  // Languages Constellation
  {
    id: "javascript",
    name: "JavaScript",
    category: "languages",
    proficiency: 0.9,
    description: "Web programming language",
    position: [50, 40],
    connections: ["typescript", "nodejs"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "languages",
    proficiency: 0.85,
    description: "Typed superset of JavaScript",
    position: [70, 40],
    connections: ["javascript", "react", "prisma"],
  },
  {
    id: "python",
    name: "Python",
    category: "languages",
    proficiency: 0.7,
    description: "General-purpose language",
    position: [30, 40],
    connections: ["javascript"],
  },

  {
    id: "csharp",
    name: "C#",
    category: "languages",
    proficiency: 0.6,
    description: "Object-oriented language for .NET",
    position: [60, 70],
    connections: ["javascript"],
  },
  {
    id: "java",
    name: "Java",
    category: "languages",
    proficiency: 0.7,
    description: "Object-oriented language for enterprise",
    position: [40, 70],
    connections: ["javascript", "csharp"],
  },
  // Tools Constellation
  {
    id: "git",
    name: "Git",
    category: "tools",
    proficiency: 0.9,
    description: "Version control system",
    position: [40, 30],
    connections: ["github"],
  },
  {
    id: "github",
    name: "GitHub",
    category: "tools",
    proficiency: 0.85,
    description: "Code hosting platform",
    position: [60, 40],
    connections: ["git", "docker"],
  },
  {
    id: "figma",
    name: "Figma",
    category: "tools",
    proficiency: 0.7,
    description: "UI/UX design tool",
    position: [80, 30],
    connections: [],
  },
  {
    id: "blender",
    name: "Blender",
    category: "tools",
    proficiency: 0.6,
    description: "3D modeling and animation software",
    position: [70, 20],
    connections: ["figma"],
  },
  {
    id: "opencv",
    name: "OpenCV",
    category: "tools",
    proficiency: 0.6,
    description: "Computer vision library",
    position: [15, 30],
    connections: [],
  },
  {
    id: "pyvista",
    name: "PyVista",
    category: "tools",
    proficiency: 0.6,
    description: "3D visualization library for Python",
    position: [20, 50],
    connections: ["opencv"],
  },
  {
    id: "docker",
    name: "Docker",
    category: "tools",
    proficiency: 0.7,
    description: "Containerization platform",
    position: [80, 50],
    connections: ["github"],
  },
  {
    id: "linux",
    name: "Linux",
    category: "tools",
    proficiency: 0.7,
    description: "Open-source operating system",
    position: [50, 50],
    connections: ["docker"],
  },
  
  {
    id: "bash",
    name: "Bash Terminal",
    category: "tools",
    proficiency: 0.7,
    description: "Command-line shell and scripting language",
    position: [35, 40],
    connections: ["git","linux"],
  },
  {
    id: "aws",
    name: "AWS",
    category: "tools",
    proficiency: 0.65,
    description: "Cloud services platform",
    position: [60, 70],
    connections: ["docker"],
  },
];

function SkillConstellation() {
  const [activeCategory, setActiveCategory] = useState<string>("frontend");
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const constellationRef = useRef<HTMLDivElement>(null);
  const categories = Array.from(new Set(skills.map((skill) => skill.category)));

  // Create twinkling stars background effect
  useEffect(() => {
    if (!constellationRef.current) return;

    const starsCount = 100;
    const container = constellationRef.current;

    // Clear any existing stars
    const existingStars = container.querySelectorAll(".twinkle-star");
    existingStars.forEach((star) => star.remove());

    // Create new background stars
    for (let i = 0; i < starsCount; i++) {
      const star = document.createElement("div");
      star.className = "twinkle-star";
      star.style.width = `${Math.random() * 2 + 1}px`;
      star.style.height = star.style.width;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(star);
    }
  }, [activeCategory]);

  // Filter skills by active category
  const categorySkills = skills.filter(
    (skill) => skill.category === activeCategory
  );


  return (
    <div className="relative w-full h-[700px] flex flex-col">
      {/* Category navigation */}
      <div className="flex justify-center space-x-4 mb-4">
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`px-4 py-2 rounded-lg text-sm uppercase tracking-wider ${
              activeCategory === category
                ? "bg-primary text-white"
                : "bg-secondary/30 text-primary"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveCategory(category);
              setSelectedSkill(null);
            }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Main constellation view */}
      <div
        ref={constellationRef}
        className="relative flex-1 bg-gradient-to-b from-black to-[#12123e] rounded-lg overflow-hidden"
      >
        {/* Constellation connections (lines between skills) */}
        <svg className="absolute inset-0 w-full h-full">
          {categorySkills.map((skill) =>
            (skill.connections || []).map((connectionId) => {
              const connectedSkill = categorySkills.find(
                (s) => s.id === connectionId
              );
              if (
                !connectedSkill ||
                !skill.position ||
                !connectedSkill.position
              )
                return null;

              return (
                <line
                  key={`${skill.id}-${connectionId}`}
                  x1={`${skill.position[0]}%`}
                  y1={`${skill.position[1]}%`}
                  x2={`${connectedSkill.position[0]}%`}
                  y2={`${connectedSkill.position[1]}%`}
                  stroke="#5b78a0"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
              );
            })
          )}
        </svg>

        {/* Skills as stars */}
        {categorySkills.map((skill) => (
          <motion.div
            key={skill.id}
            className={`absolute cursor-pointer translate-x-[-50%] translate-y-[-50%] ${
              selectedSkill?.id === skill.id ? "z-20" : "z-10"
            }`}
            style={{
              left: `${skill.position?.[0]}%`,
              top: `${skill.position?.[1]}%`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
            onClick={() => setSelectedSkill(skill)}
          >
            {/* Proficiency indicator (now on top for selected skill) */}
            {selectedSkill?.id === skill.id && (
              <motion.div
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-24"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-blue-200 mb-1 text-center">
                  {Math.floor(skill.proficiency * 100)}% Mastery
                </div>
                <div className="h-1 w-full bg-white/20 rounded-full">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${skill.proficiency * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            )}

            {/* Star glow effect */}
            <div
              className={`
              absolute -inset-2 rounded-full blur-md
              ${
                selectedSkill?.id === skill.id
                  ? "bg-white/30 animate-pulse"
                  : "bg-white/10"
              }
            `}
            ></div>

            {/* Star node */}
            <div
              className={`
                relative flex items-center justify-center
                rounded-full border-2 bg-black
                ${
                  selectedSkill?.id === skill.id
                    ? "w-5 h-5 border-white"
                    : "w-4 h-4 border-blue-300/70"
                }
              `}
            >
              <div
                className={`
                  absolute rounded-full bg-white
                  ${
                    selectedSkill?.id === skill.id
                      ? "w-3 h-3 animate-pulse"
                      : "w-2 h-2"
                  }
                `}
              ></div>
            </div>

            {/* Skill name */}
            <div
              className={`
                absolute mt-2 top-full left-1/2 -translate-x-1/2
                text-center whitespace-nowrap pointer-events-none
                ${
                  selectedSkill?.id === skill.id
                    ? "text-white font-semibold"
                    : "text-blue-200/80"
                }
              `}
            >
              {skill.name}
            </div>
          </motion.div>
        ))}

        {/* Selected skill detail panel */}
        {selectedSkill && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-blue-900/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h3 className="text-xl font-bold text-blue-300">
              {selectedSkill.name}
            </h3>
            <p className="text-blue-100/80 mt-1">
              {selectedSkill.description ||
                `Proficiency: ${Math.floor(selectedSkill.proficiency * 100)}%`}
            </p>
          </motion.div>
        )}

        {/* CSS for twinkling stars animation */}
        <style>{`
          .twinkle-star {
            position: absolute;
            background-color: #fff;
            border-radius: 50%;
            opacity: 0.7;
            animation: twinkle 4s infinite;
          }
          
          @keyframes twinkle {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default SkillConstellation;
