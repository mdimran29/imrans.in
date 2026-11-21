import type { Project } from "@/data/projects";
import { site } from "@/data/site";

const plain = (s: string) => s.replace(/\*\*|`/g, "");

/** Plain-text version of a project page, served at /projects/<slug>.txt. */
export function projectText(p: Project): string {
  const out: string[] = [
    p.name,
    "=".repeat(p.name.length),
    "",
    p.tagline,
    "",
    `Status:  ${p.status}`,
    `My part: ${p.contribution}`,
    `Year:    ${p.year}`,
    `Stack:   ${p.stack.join(", ")}`,
    "",
    ...p.story.flatMap((s) => [plain(s), ""]),
  ];

  if (p.outcomes?.length) {
    out.push("In numbers", "----------", ...p.outcomes.map((o) => `- ${o.value} ${o.label}`), "");
  }
  for (const f of p.flows ?? []) {
    const steps = f.steps.map((s) => (Array.isArray(s) ? s.map((n) => n.label).join(" | ") : s.label));
    out.push(f.title, "-".repeat(f.title.length), steps.join(" -> "), "");
  }
  for (const s of p.sections ?? []) {
    out.push(s.title, "-".repeat(s.title.length));
    if (s.body) out.push(plain(s.body));
    for (const pt of s.points ?? []) out.push(`- ${pt.term}: ${plain(pt.text)}`);
    out.push("");
  }
  if (p.rules?.length) {
    out.push("Enforced in code", "----------------", ...p.rules.map((r) => `- ${r}`), "");
  }
  out.push("Links", "-----", ...p.links.map((l) => `- ${l.label}: ${l.href}`), "");
  out.push(`${site.name} · ${site.url}/projects/${p.slug}`, "");
  return out.join("\n");
}
