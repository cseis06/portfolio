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
    kind: "Landing Page",
    year: "2023",
    description:
      "It's a landing page for a photography school; first version of this site was launched in 2023, but it had a rework in 2026  — currently in production. Stack: Next.js + React.js and TailwindCSS",
    image: "/projects/fotearte.jpg",
    link: "https://www.fotearte.com/",
  },
  {
    id: "zentry",
    channel: 2,
    title: "Zentry",
    kind: "Brand Experience",
    year: "2025",
    description:
      "A website inspired by zentry.com, made to experiment with animations in GSAP — find the code in my github repo. Stack: React.js and TailwindCSS",
    image: "/projects/zentry.jpg",
    link: "https://github.com/cseis06/zentry",
  },
  {
    id: "maras",
    channel: 3,
    title: "Marra's",
    kind: "Web App",
    year: "2026",
    description:
      "It's a management system for a healthy lifestyle company — currently in pre-production. Stack: React.js and TailwindCSS",
    image: "/projects/marras.jpg",
  },
  {
    id: "lunardi",
    channel: 4,
    title: "Lunardi",
    kind: "Landing Page",
    year: "2026",
    description:
      "It's a landing page made for a wholesale bakery — currently in pre-production. Stack: Next.js + React.js and TailwindCSS",
    image: "/projects/lunardi.jpg",
  },
  {
    id: "patriota",
    channel: 5,
    title: "Patriota",
    kind: "Web Catalog + Admin",
    year: "2025",
    description:
      "It's a web catalog made for a flip-flop store, it includes its admin panel — the project was cancelled, but you can find it in my github repo. Stack: Next.js + React.js and TailwindCSS, Node.js + Express and MongoDB",
    image: "/projects/patriota.jpg",
    link: "https://github.com/cseis06/app-patriota",
  },
  {
    id: "xora",
    channel: 6,
    title: "Xora",
    kind: "Landing Page",
    year: "2024",
    description:
      "A landing page for an AI editing model, made to experiment with UX/UI concepts — find it in my GitHub repo. Stack: React.js and TailwindCSS",
    image: "/projects/xora.jpg",
    link: "https://github.com/cseis06/xora",
  },
  {
    id: "kiren",
    channel: 7,
    title: "Kiren",
    kind: "E-commerce & Admin",
    year: "2024",
    description:
      "An e-commerce platform with its respective administrative panel for a women's clothing store — currently in staging. Stack: Next.js + React.js and TailwindCSS, Supabase",
    image: "/projects/kiren.jpg",
    link: "https://app.netlify.com/projects/kiren-ecommerce",
  },
];