import { jobs } from "@/data/experience";
import { site } from "@/data/site";

// ANSI business card for `curl -sL <host>`. Kept free of Node APIs so it runs anywhere.
const ESC = "\x1b[";
const dim = (s: string) => `${ESC}2m${s}${ESC}0m`;
const bold = (s: string) => `${ESC}1m${s}${ESC}0m`;
const ital = (s: string) => `${ESC}3m${s}${ESC}0m`;
const amber = (s: string) => `${ESC}38;5;179m${s}${ESC}0m`;
const under = (s: string) => `${ESC}4m${s}${ESC}0m`;

// Visible width: strip escape codes; count each code point once.
const visible = (s: string) => [...s.replace(/\x1b\[[0-9;]*m/g, "")].length;

export function buildCard(plain = false): string {
  const strip = (s: string) => (plain ? s.replace(/\x1b\[[0-9;]*m/g, "") : s);
  const now = jobs[0];
  const key = (k: string) => dim(k.padEnd(9));

  const rows: string[] = [
    "",
    bold(site.name),
    ital(`full-stack AI & blockchain engineer · ${site.location}`),
    "",
    `${key("Now")}${now.role} @ ${amber(now.org)}`,
    "",
    `${key("Builds")}smart contracts, staking & yield systems,`,
    `${key("")}AI developer tools and full-stack products`,
    "",
    `${key("Stack")}Solidity · Foundry · TypeScript · React`,
    `${key("")}Node.js · Next.js · Chainlink · Gemini`,
    "",
    `${key("Email")}${under(site.email)}`,
    `${key("GitHub")}${site.github.replace("https://", "")}`,
    `${key("LinkedIn")}${site.linkedin.replace("https://www.", "").replace(/\/$/, "")}`,
    `${key("Web")}${site.host}`,
    "",
  ];

  const inner = Math.max(...rows.map(visible)) + 4;
  const line = (s: string) => `  ${dim("│")}  ${s}${" ".repeat(inner - 2 - visible(s))}${dim("│")}`;
  const out = [
    "",
    `  ${dim(`╭${"─".repeat(inner)}╮`)}`,
    ...rows.map(line),
    `  ${dim(`╰${"─".repeat(inner)}╯`)}`,
    "",
    `  ${dim("→ say hi:")} ${amber(`mailto:${site.email}`)}`,
    "",
  ];
  return strip(out.join("\n")) + "\n";
}
