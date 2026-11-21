// Single source of truth for identity and links. Everything here is verified
// against the resume, the previous portfolio and the GitHub profile.

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://imrans.in";

export const site = {
  url: rawUrl.replace(/\/$/, ""),
  host: rawUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
  name: "Md Imran",
  first: "Md",
  last: "Imran",
  role: "Full-Stack AI & Blockchain Engineer",
  location: "Kolkata, India",
  email: "dev.mdimran@gmail.com",
  github: "https://github.com/mdimran29",
  linkedin: "https://www.linkedin.com/in/mdimran29/",
  description:
    "Md Imran — Full-Stack AI & Blockchain Engineer in Kolkata. Smart contracts with Foundry, staking and yield systems, AI-assisted developer tools and full-stack products.",
  education: {
    degree: "B.Tech in Information Technology",
    school: "Netaji Subhash Engineering College",
    affiliation: "MAKAUT",
    years: "2022 — 2026",
    cgpa: "7.5",
  },
} as const;

export const socials = [
  { label: "GitHub", href: site.github, icon: "github" },
  { label: "LinkedIn", href: site.linkedin, icon: "linkedin" },
  { label: "Email", href: `mailto:${site.email}`, icon: "mail" },
] as const;

export type SocialIcon = (typeof socials)[number]["icon"];
