import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import skills from "../../data/skills";
import type { SkillData } from "@/types/types";

//SKYRIM CONSTELLATION LESSGOO

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
      <div className="relative mb-6">
        {/* Fade indicators to show scrollable content */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#12123e] to-transparent pointer-events-none z-10 md:hidden"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#12123e] to-transparent pointer-events-none z-10 md:hidden"></div>

        {/* Scrollable container */}
        <div className="flex py-2 px-4 overflow-x-auto no-scrollbar gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`px-4 py-2 rounded-lg text-sm uppercase tracking-wider whitespace-nowrap ${
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
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .no-scrollbar::-webkit-scrollbar {
             display: none;  /* Chrome, Safari, Opera */
          }
        `}</style>
      </div>
    </div>
  );
}

export default SkillConstellation;
