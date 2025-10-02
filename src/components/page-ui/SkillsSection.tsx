import Link from "next/link";
import { FaJs, FaNodeJs, FaPython, FaReact } from "react-icons/fa";
import {
  SiFlask,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

export function SkillsSection() {
  return (
    <div className="mx-auto max-w-5xl px-8 pb-8">
      <h1
        id="skills"
        className="max-w-5xl pt-20 text-2xl font-bold dark:text-white md:pt-32 md:text-7xl"
      >
        Skills
      </h1>
      <div
        className={
          "grid grid-cols-1 gap-6  py-10 md:grid-cols-2 lg:grid-cols-3"
        }
      >
        {skills.map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            className="relative mx-auto flex h-52 w-full max-w-full flex-col items-start border border-black/[0.2] p-4 dark:border-white/[0.2]"
          >
            <Icon className="absolute -left-3 -top-3 size-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -left-3 size-6 text-black dark:text-white" />
            <Icon className="absolute -right-3 -top-3 size-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -right-3 size-6 text-black dark:text-white" />

            <EvervaultCard text={item.title} icon={item.icon} />
          </Link>
        ))}
      </div>
    </div>
  );
}

const skills = [
  {
    title: "React.js",
    link: "https://react.dev/",
    icon: <FaReact />,
  },
  {
    title: "Next.js",
    link: "https://nextjs.org",
    icon: <SiNextdotjs />,
  },
  {
    title: "Tailwind",
    link: "https://tailwindcss.com",
    icon: <SiTailwindcss />,
  },
  {
    title: "JavaScript",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    icon: <FaJs />,
  },
  {
    title: "Node.js",
    link: "https://nodejs.org/",
    icon: <FaNodeJs />,
  },
  {
    title: "MongoDB",
    link: "https://www.mongodb.com/",
    icon: <SiMongodb />,
  },
  {
    title: "Python",
    link: "https://www.python.org/",
    icon: <FaPython />,
  },
  {
    title: "TypeScript",
    link: "https://www.typescriptlang.org/",
    icon: <SiTypescript />,
  },
  {
    title: "MySQL",
    link: "https://www.mysql.com/",
    icon: <SiMysql />,
  },
];
