// Only what shows up in the work above: repos, the internship, or the resume.
export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Solidity", "Rust (Anchor)", "Python", "C++", "Java"] },
  {
    group: "Web3",
    items: [
      "Foundry (fuzz · invariant · fork)",
      "Hardhat",
      "OpenZeppelin",
      "Chainlink VRF · CCIP · Automation",
      "Uniswap V4 hooks",
      "Rocket Pool",
      "Lit Protocol",
      "Ethers.js",
      "Solana",
    ],
  },
  { group: "Frontend", items: ["React", "Next.js", "React Native", "Redux Toolkit", "Tailwind CSS"] },
  { group: "Backend", items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Prisma", "Firebase"] },
  { group: "AI", items: ["Gemini API", "Claude API", "Vercel AI SDK", "Embeddings + BM25 retrieval"] },
  { group: "Tools", items: ["Git", "Linux", "VS Code", "Cursor", "Claude Code", "Vercel", "Render"] },
];

export type Achievement = { title: string; detail: string; when: string; href?: string };

export const achievements: Achievement[] = [
  {
    title: "Commit merged into OpenZeppelin Community Contracts",
    detail: "ERC20uRWA canSend / canReceive, via #254",
    when: "Jul 2026",
    href: "https://github.com/OpenZeppelin/openzeppelin-community-contracts/pull/254",
  },
  {
    title: "Stack3 Security published on the VS Code Marketplace",
    detail: "Team project — I built the extension",
    when: "Oct 2026",
    href: "https://marketplace.visualstudio.com/items?itemName=Stack3Security.stack3-vscode",
  },
  {
    title: "4th place at Geekathon 1.0",
    detail: "Travel Advisor",
    when: "2023",
    href: "https://travel-companion-gamma.vercel.app",
  },
];
