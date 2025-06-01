interface SkillData {
  id: string;
  name: string;
  category: "frontend" | "backend" | "design" | "tools" | "languages";
  proficiency: number;
  description?: string;
  connections?: string[];
  position?: [number, number];
}

interface SectionParticlesProps {
  color?: string;
  count?: number;
  size?: number;
  opacity?: number;
  zIndex?: number;
}

interface ProjectProps {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface PS2LoadingScreenProps {
  onLoadingComplete: () => void;
}

export type { SkillData, SectionParticlesProps, ProjectProps, PS2LoadingScreenProps };
