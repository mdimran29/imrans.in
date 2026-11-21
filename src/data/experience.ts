export type Job = {
  role: string;
  org: string;
  href?: string;
  start: string;
  end: string;
  where: string;
  summary: string;
  /** Grouped by how far the work went, so nothing reads as more shipped than it is. */
  groups?: { label: string; items: string[] }[];
  stack?: string[];
  /** Slug of a project page with the full write-up. */
  caseStudy?: string;
};

export const jobs: Job[] = [
  {
    role: "Full-Stack Blockchain Engineer",
    org: "Petition.io",
    href: "https://petition.io",
    start: "Jul 2025",
    end: "Present",
    where: "Remote · Washington-based · petition crowdfunding on Ethereum",
    summary:
      "I'm building the on-chain treasury for a civic petition platform heading toward 501(c)(3) status. Users deposit ETH and their principal stays redeemable; only the real Rocket Pool staking yield funds the platform, its liquidity and its community.",
    groups: [
      {
        label: "Built & tested",
        items: [
          "PTNR vault — ETH deposits mint PTNR 1:1 and go straight into Rocket Pool (rETH)",
          "Yield split three ways: quadratic funding, development, protocol-owned liquidity",
          "Per-user yield accounting, so donated yield can be receipted to each depositor",
          "Uniswap V4 protocol-owned-liquidity strategy with a custom oracle hook and TWAP price guard",
          "PTNR staking for DAO membership — per-block checkpoints, 7-day unstake cooldown",
          "Contract integration and some frontend work",
        ],
      },
      {
        label: "Testing",
        items: [
          "800+ Foundry tests — unit, integration, fuzz, mainnet-fork and invariant",
          "10 invariants, mutation-tested so each one fails when its rule is broken",
          "Fork tests caught two mainnet-breaking Rocket Pool bugs before deployment",
        ],
      },
      {
        label: "Status",
        items: [
          "Not on mainnet yet; audits haven't started",
          "Per-user yield tracking is built — the tax receipt itself isn't yet",
          "DAO voting logic is a teammate's; mine is membership and stake history",
        ],
      },
    ],
    stack: ["Solidity 0.8.28", "Foundry", "Uniswap V4", "Rocket Pool", "OpenZeppelin"],
    caseStudy: "petition-treasury",
  },
  {
    role: "Blockchain Lead",
    org: "GDG On Campus NSEC",
    start: "Sep 2024",
    end: "Jul 2025",
    where: "Netaji Subhash Engineering College, Kolkata",
    summary:
      "Ran Solidity, Foundry and Web3 workshops for students and mentored them through their first smart contracts.",
  },
];
