export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;        // "Feb 2025"
  endDate: string;          // "Oct 2025" or "Present"
  isPresent: boolean;
  description: string;
  /** Numeric sort key (year * 12 + month). */
  sortKey: number;
}

// Sorted reverse-chronological by start date.
// Note: dates flagged for review — Central Shop's range conflicts with
// "currently working" copy, and LP Soft starts in the future. Adjust before launch.
export const experience: ExperienceEntry[] = [
  {
    id: "lp-soft",
    company: "LP Soft S.A.",
    role: "Frontend Developer",
    startDate: "Nov 2025",
    endDate: "Present",
    isPresent: true,
    description:
      "Responsible for the creation, development, and maintenance of software modules across various enterprise systems. Focused on building responsive, maintainable user interfaces, ensuring code scalability, and collaborating closely with the development team to deliver robust software solutions.",
    sortKey: 2025 * 12 + 11,
  },
  {
    id: "central-shop",
    company: "Central Shop",
    role: "Web Developer",
    startDate: "Feb 2025",
    endDate: "Oct 2025",
    isPresent: false,
    description:
      "Worked as a Web Developer at Central Shop, in charge of the development and maintenance of a complex e-commerce platform. Responsibilities included managing multiple interfaces for customers and administrators, as well as the development of an internal management application. Used React and Next.js on the frontend, combined with Node.js and Express on the backend, with databases via MongoDB and MariaDB. Implemented SEO strategies and improved the user experience by optimizing performance and navigation. Day-to-day work included technical problem-solving, team coordination, and ensuring code quality.",
    sortKey: 2025 * 12 + 2,
  },
  {
    id: "freelance",
    company: "Freelance Projects",
    role: "Independent Developer",
    startDate: "2023",
    endDate: "Present",
    isPresent: true,
    description:
      "Designed and developed multiple digital projects independently. Notable among them is Patriota, the full development of a digital catalog (frontend with React, Next.js, and TailwindCSS; backend with Node.js and Express; MongoDB database — currently in pre-production). Also designed and developed Lunardi, a landing page using React, Next.js, and TailwindCSS, and Fotearte, a landing page developed in React already deployed in production.",
    sortKey: 2023 * 12 + 1,
  },
  {
    id: "posibillian",
    company: "Posibillian Tech S.A.",
    role: "Development Intern",
    startDate: "Oct 2024",
    endDate: "Nov 2024",
    isPresent: false,
    description:
      "Focused on designing and creating interactive Fortnite maps using Unreal Editor for Fortnite (UEFN) and the Verse language. Applied programming logic to build interactive environments and develop immersive experiences for players.",
    sortKey: 2024 * 12 + 10,
  },
];