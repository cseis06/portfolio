"use client";
import { twMerge } from "tailwind-merge";

import { TracingBeam } from "@/components/ui/tracing-beams";

export function ExperienceSection() {
  return (
    <>
      <h1
        id="experience"
        className="mx-auto max-w-5xl px-8 pb-8 pt-20 text-2xl font-bold dark:text-white md:pt-32 md:text-7xl"
      >
        Experience
      </h1>
      <TracingBeam className="px-6">
        <div className="relative mx-auto max-w-2xl pb-32 pt-4 text-white antialiased">
          {experience.map((item, index) => (
            <div key={`content-${index}`} className="mb-10 mt-4 md:mt-0">
              <h2 className={twMerge("text-xl text-black dark:text-white")}>
                {item.title}
              </h2>
              <span className="w-fit rounded-full py-1 text-sm italic text-neutral-800 dark:text-neutral-200">
                {item.badge}
              </span>
              <div className="prose prose-sm dark:prose-invert mt-2 text-sm text-black dark:text-white">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </TracingBeam>
    </>
  );
}

const experience = [
  {
    title: "Central Shop",
    description: (
      <ul className="list-disc">
        <li>
          Development and maintenance of a complex e-commerce platform with
          multiple frontends (customer and admin) and an internal management
          app.
        </li>
        <li>
          Frontend with React + Next.js and backend with Node.js + Express,
          integrating MongoDB and MariaDB databases.
        </li>
        <li>
          Implemented SEO strategies and enhanced user experience, optimizing
          performance and navigation.
        </li>
        <li>
          Daily technical problem-solving, team coordination, and ensuring code
          quality.
        </li>
      </ul>
    ),
    badge: "Web Developer/Feb 2025 – Present",
  },
  {
    title: "Posibillian Tech S.A.",
    description: (
      <ul className="list-disc">
        <li>
          Development internship, designing and creating Fortnite maps using
          Unreal Editor for Fortnite and Verse.
        </li>
        <li>
          Applied programming logic for interactive environments and developed
          immersive experiences.
        </li>
      </ul>
    ),
    badge: "Development Intern/Oct 2024 – Nov 2024",
  },
  {
    title: "Freelance Projects",
    description: (
      <ul className="list-disc">
        <li>
          <strong>Patriota:</strong> Full design & development of frontend
          (React + Next.js + TailwindCSS), backend (Node.js + Express) and
          MongoDB database for digital catalog, currently in pre-production.
        </li>
        <li>
          <strong>Lunardi:</strong> Design & Development of a landing page with
          React + Next.js + TailwindCSS, currently in pre-production.
        </li>
        <li>
          <strong>Fotearte:</strong> Design & Development of a landing page in
          React, already in production.
        </li>
      </ul>
    ),
    badge: "Freelance/2023 – Present",
  },
];
