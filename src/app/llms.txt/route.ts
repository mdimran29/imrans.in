import { site } from "@/data/site";
import { jobs } from "@/data/experience";
import { projects, shelves } from "@/data/projects";
import { achievements, skills } from "@/data/skills";

export const dynamic = "force-static";

const plain = (s: string) => s.replace(/\*\*|`/g, "");

export function GET() {
  const out: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.role} in ${site.location}. ${site.education.degree}, ${site.education.school} (${site.education.years}).`,
    "",
    `- Email: ${site.email}`,
    `- GitHub: ${site.github}`,
    `- LinkedIn: ${site.linkedin}`,
    "",
    "## Experience",
    "",
    ...jobs.flatMap((j) => [
      `### ${j.role} — ${j.org} (${j.start} – ${j.end})`,
      j.where,
      "",
      j.summary,
      ...(j.groups ?? []).flatMap((g) => ["", `${g.label}:`, ...g.items.map((i) => `- ${i}`)]),
      "",
    ]),
    "## Projects",
    "",
    "Status is stated per project; coursework and testnet deployments are labelled as such. Each link is a plain-text write-up.",
    "",
    ...shelves.flatMap((s) => [
      `### ${s.title}`,
      "",
      ...projects
        .filter((p) => p.shelf === s.id)
        .map((p) => `- [${p.name}](${site.url}/projects/${p.slug}.txt) — ${plain(p.desc)} Status: ${p.status}. My part: ${p.contribution}.`),
      "",
    ]),
    "## Skills",
    "",
    ...skills.map((g) => `- ${g.group}: ${g.items.join(", ")}`),
    "",
    "## Achievements",
    "",
    ...achievements.map((a) => `- ${a.title} (${a.when}) — ${a.detail}`),
    "",
  ];
  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
