export interface Skill {
  /** Folder name under public/skills/ */
  slug: string;
  /** Display name for accessibility + caption */
  name: string;
  /** Short tagline for the side panel */
  tagline: string;
}

// Scroll order = display order. The user sees skills[0] first, then 1, etc.
export const skills: Skill[] = [
  {
    slug: "javascript-typescript",
    name: "JavaScript & TypeScript",
    tagline: "the lingua franca.",
  },
  {
    slug: "react",
    name: "React",
    tagline: "components, all the way down.",
  },
  {
    slug: "next",
    name: "Next.js",
    tagline: "the framework I reach for first.",
  },
  {
    slug: "tailwindcss",
    name: "Tailwind CSS",
    tagline: "utility-first, opinion-light.",
  },
  {
    slug: "node-express",
    name: "Node.js & Express",
    tagline: "the back of house.",
  },
  {
    slug: "postgresql",
    name: "PostgreSQL",
    tagline: "relations, properly kept.",
  },
  {
    slug: "mongodb",
    name: "MongoDB",
    tagline: "documents, when shape is fluid.",
  },
];

export const STAGES = ["skill", "wrinkle", "break", "pieces"] as const;
export type Stage = (typeof STAGES)[number];