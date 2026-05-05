export interface Project {
  id: string;
  channel: number;
  title: string;
  kind: string;
  year: string;
  description: string;
  image: string;
  link?: string;
  repoLink?: string;
}

// Real titles/descriptions are placeholders until you swap them in.
// The image paths are wired up correctly to your /public/projects/ folder.
export const projects: Project[] = [
  {
    id: "fotearte",
    channel: 1,
    title: "Fotearte",
    kind: "Web Platform",
    year: "2025",
    description:
      "Placeholder description for Fotearte — replace with the real story when ready.",
    image: "/projects/fotearte.jpg",
  },
  {
    id: "patriota",
    channel: 2,
    title: "Patriota",
    kind: "Web Application",
    year: "2025",
    description:
      "Placeholder description for Patriota — swap in the real content here.",
    image: "/projects/patriota.jpg",
  },
  {
    id: "xora",
    channel: 3,
    title: "Xora",
    kind: "Landing Page",
    year: "2024",
    description:
      "Placeholder description for Xora — to be filled with the real summary.",
    image: "/projects/xora.jpg",
  },
  {
    id: "zentry",
    channel: 4,
    title: "Zentry",
    kind: "Brand Experience",
    year: "2024",
    description:
      "Placeholder description for Zentry — replace before launch.",
    image: "/projects/zentry.jpg",
  },
];