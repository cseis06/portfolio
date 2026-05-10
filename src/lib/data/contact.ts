export interface ContactLink {
  id: string;
  label: string;
  display: string;
  href: string;
  external?: boolean;
}

export const contactLinks: ContactLink[] = [
  {
    id: "phone",
    label: "Phone / WhatsApp",
    display: "+595 976 167226",
    href: "https://wa.me/595976167226",
    external: true,
  },
  {
    id: "mail",
    label: "Mail",
    display: "danimaibp1@gmail.com",
    href: "mailto:danimaibp1@gmail.com",
  },
  {
    id: "instagram",
    label: "Instagram",
    display: "@_danibrunetto1",
    href: "https://instagram.com/_danibrunetto1",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    display: "in/daniela-brunetto",
    href: "https://www.linkedin.com/in/daniela-brunetto-734ab6250",
    external: true,
  },
];