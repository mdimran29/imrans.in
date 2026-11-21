// Every entry is checked against its repository, README, commit history or live URL.
// `status` says how far it went; `contribution` says what was mine on team work.

export type ShelfId = "web3" | "ai" | "fullstack" | "oss";

export type Link = { label: string; href: string };

export type Shot = { src: string; w: number; h: number; caption?: string };

/** A titled part of the write-up: a paragraph, "term: detail" points, or both. */
export type Section = { title: string; body?: string; points?: { term: string; text: string }[] };

/** One box in a flow diagram. */
export type FlowNode = { label: string; sub?: string; accent?: boolean };
/** A step is one node, or several nodes that happen side by side. */
export type Flow = { title: string; steps: (FlowNode | FlowNode[])[] };

export type Project = {
  slug: string;
  name: string;
  shelf: ShelfId;
  /** One line for the list. */
  desc: string;
  /** One sentence under the title on the detail page. */
  tagline: string;
  /** Opening paragraph(s). With `sections`, usually just one. */
  story: string[];
  sections?: Section[];
  status: string;
  /** Small mono badge next to the name in the list. */
  label?: string;
  contribution: string;
  context: string;
  year: string;
  stack: string[];
  links: Link[];
  /** Short external link shown inline in the list. */
  visit?: Link;
  /** Screenshots in /public/shots — shown in the folder thumbnail and the gallery. */
  shots?: Shot[];
  /** Organisation logo for the thumbnail and cover, on its brand background. */
  brand?: { src: string; bg: string };
  /** Diagrams of how the system moves data or money. */
  flows?: Flow[];
  /** A few hard numbers, shown large. */
  outcomes?: { value: string; label: string }[];
  /** Invariants the code enforces. */
  rules?: string[];
  /** Listed before the "more" fold. */
  top?: boolean;
};

export const shelves: { id: ShelfId; title: string; noun: string }[] = [
  { id: "web3", title: "blockchain & web3", noun: "blockchain projects" },
  { id: "ai", title: "ai & intelligent systems", noun: "AI projects" },
  { id: "fullstack", title: "full-stack applications", noun: "applications" },
  { id: "oss", title: "open source & hackathons", noun: "entries" },
];

const gh = (repo: string) => `https://github.com/mdimran29/${repo}`;

export const projects: Project[] = [
  // ── blockchain & web3 ────────────────────────────────────────────────
  {
    slug: "petition-treasury",
    name: "PTNR treasury",
    shelf: "web3",
    top: true,
    label: "Pre-audit",
    desc: "Principal-protected ETH staking treasury for Petition.io — only Rocket Pool yield funds the platform, with a Uniswap V4 liquidity strategy guarded by a TWAP oracle hook.",
    tagline: "Deposit ETH, keep your principal, donate only the yield.",
    story: [
      "Petition.io is a civic petition platform heading toward 501(c)(3) non-profit status. Users deposit ETH and get **PTNR minted 1:1**; the ETH goes straight into **Rocket Pool (rETH)**. Their principal is never put at risk and stays redeemable. Only the real staking yield is distributed, split three ways: quadratic funding, development, and protocol-owned liquidity.",
    ],
    sections: [
      {
        title: "How the token works",
        body: "PTNR has no emission schedule. New supply comes only from ETH deposits, or from tightly limited mints that are paired with liquidity and burned on exit — the design avoids the death spiral that broke OlympusDAO and Tomb. Staking PTNR gives DAO membership, with per-block stake checkpoints and a 7-day unstake cooldown.",
      },
      {
        title: "What I built",
        points: [
          {
            term: "Per-user yield attribution",
            text: "replaced a pooled yield formula with per-user accrual, so the vault knows how much rETH yield each user's ETH produced and the donated yield can be receipted to that person.",
          },
          {
            term: "UniswapV4POLStrategy",
            text: "a yield-funded PTNR/ETH concentrated-liquidity position: pool and position setup, deploy, permissionless `collectFees`, a guarded `pokeRebalance`, and a staged emergency unwind (freeze, recall, resume) with its own price gate.",
          },
          {
            term: "PTNROracleHook and PriceGuard",
            text: "a custom V4 hook with a geometric-mean tick oracle; any price-reading operation is refused when spot moves more than 200 bps from the TWAP.",
          },
          {
            term: "ReserveBuffer and PositionValuation",
            text: "the buffer collects yield and fees and pays out at set thresholds; the valuation library prices the liquidity position.",
          },
          {
            term: "Uniswap V4 migration",
            text: "moved the stack from V2/V3 to V4 — singleton PoolManager, hooks, transient storage, Cancun EVM.",
          },
          {
            term: "Integration",
            text: "contract integration and some of the frontend.",
          },
        ],
      },
      {
        title: "Bugs I caught",
        points: [
          {
            term: "Late-deposit over-credit",
            text: "deposits made after the rETH rate rose were credited too much yield.",
          },
          {
            term: "Multi-redeem scaling",
            text: "global share totals scaled wrongly whenever more than one user redeemed.",
          },
          {
            term: "Rocket Pool storage key",
            text: "a wrong storage key — caught by fork tests against the real contracts.",
          },
          {
            term: "Return-value assumption",
            text: "a wrong assumption about a Rocket Pool return value, also caught on a fork. Either would have broken mainnet.",
          },
          {
            term: "Rounding and dust",
            text: "fuzzing found rounding and dust bugs in rebalancing.",
          },
        ],
      },
      {
        title: "Testing",
        points: [
          {
            term: "Scale",
            text: "about 5,400 lines of Solidity across 15+ contracts and libraries, with 800+ tests in 80+ files — unit, integration, fuzz, mainnet-fork and invariant.",
          },
          {
            term: "Invariants",
            text: "10 protocol invariants run as stateful fork campaigns, each mutation-tested so it demonstrably fails when its rule is broken.",
          },
          {
            term: "Adversarial forks",
            text: "Aave flash-loan manipulation, sandwich attacks, just-in-time liquidity, and reentrancy through a malicious PositionManager.",
          },
        ],
      },
      {
        title: "How I worked",
        body: "I kept a written decision log and gave the project lead weekly plain-English walkthroughs, which worked like architecture reviews.",
      },
      {
        title: "Where it stands",
        body: "Not deployed to mainnet, and audits haven't started. Per-user yield tracking is built, but the tax receipt itself isn't — its format and price source are still open with the project lead and tax counsel. The DAO voting logic is a teammate's work; mine is membership and stake history.",
      },
    ],
    status: "Pre-audit — not on mainnet",
    contribution: "Vault, yield accounting, V4 liquidity strategy and hook, staking membership, tests; contract integration and some frontend",
    context: "Petition.io",
    year: "2025–26",
    stack: ["Solidity 0.8.28", "Foundry", "Uniswap V4", "Rocket Pool", "OpenZeppelin AccessControl", "TimelockController"],
    links: [{ label: "petition.io", href: "https://petition.io" }],
    visit: { label: "petition.io", href: "https://petition.io" },
    brand: { src: "/brands/petition.png", bg: "#ffffff" },
    outcomes: [
      { value: "800+", label: "Foundry tests across 80+ files" },
      { value: "~5.4k", label: "lines of Solidity, 15+ contracts and libraries" },
      { value: "10", label: "protocol invariants, each mutation-tested" },
      { value: "2", label: "mainnet-breaking bugs caught on a fork" },
    ],
    flows: [
      {
        title: "Where a deposit goes",
        steps: [
          { label: "ETH deposit", sub: "user" },
          { label: "PTNR vault", sub: "mints PTNR 1:1", accent: true },
          { label: "Rocket Pool", sub: "staked as rETH" },
          { label: "Staking yield", sub: "accrued per user" },
          { label: "ReserveBuffer", sub: "pays out at thresholds" },
          [
            { label: "Quadratic funding" },
            { label: "Development" },
            { label: "Protocol-owned liquidity", accent: true },
          ],
        ],
      },
      {
        title: "Protocol-owned liquidity on Uniswap V4",
        steps: [
          { label: "Yield only", sub: "never principal" },
          { label: "UniswapV4POLStrategy", sub: "≤ 80% of treasury", accent: true },
          { label: "PriceGuard", sub: "spot within 200 bps of TWAP" },
          { label: "PTNR/ETH position", sub: "PTNROracleHook" },
          { label: "collectFees", sub: "permissionless" },
          { label: "ReserveBuffer" },
        ],
      },
      {
        title: "Staged emergency unwind",
        steps: [
          { label: "Freeze", sub: "price-gated", accent: true },
          { label: "Recall", sub: "pull liquidity" },
          { label: "Resume", sub: "or powers lapse in 7 days" },
        ],
      },
    ],
    rules: [
      "User principal never goes into the liquidity position",
      "Liquidity exposure is capped at 80% of treasury value",
      "Protocol-held PTNR is always burned, never recirculated",
      "Parameter changes go through a 3-day timelock",
      "Emergency powers expire automatically after 7 days",
      "Any price-reading operation is refused if spot is more than 200 bps from the TWAP",
    ],
  },
  {
    slug: "chainvault",
    name: "ChainVault",
    shelf: "web3",
    top: true,
    label: "Team",
    desc: "Ethereum vault with nominee inheritance — nominees claim their share after a year of inactivity, their details encrypted with Lit Protocol.",
    tagline: "A vault that still reaches the right people if its owner goes quiet.",
    story: [
      "ChainVault is a team project: an Ethereum vault with deposits, withdrawals, P2P lending and payroll. **My part was the NomineeVault inheritance module.**",
      "An owner names nominees with percentage shares that must add up to 100%. Any vault activity — or an explicit ping — resets an inactivity timer. After 365 days without activity, each nominee can claim their share once. Nominee details are encrypted with **Lit Protocol**, so who inherits what is not readable on-chain.",
      "I wrote the module's Foundry tests — all 28 pass — and deployed it to Sepolia.",
    ],
    status: "Sepolia testnet",
    contribution: "NomineeVault module, its tests and the Sepolia deployment",
    context: "Team",
    year: "2025",
    stack: ["Solidity", "Foundry", "Lit Protocol", "OpenZeppelin", "React", "Ethers.js"],
    links: [
      { label: "Team repository", href: "https://github.com/yashjain197/chainvalut" },
      { label: "My fork", href: gh("chainvalut") },
    ],
    visit: { label: "GitHub", href: "https://github.com/yashjain197/chainvalut" },
    shots: [
      { src: "/shots/tests-chainvault.png", w: 1720, h: 932, caption: "forge test — all 28 NomineeVault tests pass" },
    ],
  },
  {
    slug: "proptoken",
    name: "PropToken",
    shelf: "web3",
    top: true,
    label: "Testnet",
    desc: "Real-estate tokenization — ERC-721 property deeds split into ERC-20 fractions you can buy and sell.",
    tagline: "Fractional property ownership as two token standards and a marketplace.",
    story: [
      "A property is minted as an **ERC-721 deed**; the deed is then split into **ERC-20 fractions** that can be traded on a marketplace contract. Minting, fractionalisation and trading live in separate contracts, coordinated by a TokenizationManager, with role-based access control and events for every state change.",
      "The repository also contains contracts for a Chainlink-style price oracle and rental-income distribution. The contracts are written and tested with **Hardhat** (a test file per contract), and the React front end talks to them through Ethers.js and MetaMask.",
      "Deployed on Sepolia: TokenizationManager at 0xcE59…E2 and PropertyDeed at 0x414A…E6.",
    ],
    status: "Live front end on Sepolia testnet",
    contribution: "Solo — contracts, tests and front end",
    context: "Side project",
    year: "2025",
    stack: ["Solidity", "Hardhat", "OpenZeppelin", "ERC-721", "ERC-20", "React", "Ethers.js"],
    links: [
      { label: "Live app", href: "https://real-estate-rust-three.vercel.app" },
      { label: "GitHub", href: gh("Real-Estate") },
      { label: "TokenizationManager on Etherscan", href: "https://sepolia.etherscan.io/address/0xcE5938311925624E9FE619cc493AF5eA16bc46E2" },
      { label: "PropertyDeed on Etherscan", href: "https://sepolia.etherscan.io/address/0x414AbAbf01976f66757a3bF3a603adB95b97fDe6" },
    ],
    visit: { label: "live", href: "https://real-estate-rust-three.vercel.app" },
    shots: [
      { src: "/shots/proptoken-tokenize.png", w: 1440, h: 900, caption: "Tokenize — mint an on-chain deed for a new property" },
      { src: "/shots/proptoken.png", w: 1440, h: 900, caption: "Marketplace — listings stay behind a wallet connection" },
      { src: "/shots/proptoken-about.png", w: 1440, h: 900, caption: "About — mission, features, roadmap and stack" },
    ],
  },
  {
    slug: "chainwork",
    name: "Chainwork",
    shelf: "web3",
    label: "Devnet",
    desc: "Freelance job marketplace on Solana — jobs and bids, with payment held in an Anchor escrow program until the work is released.",
    tagline: "Freelance contracts and payments settled on Solana.",
    story: [
      "Clients post jobs, freelancers bid, and payment is held in an **escrow program written in Rust with Anchor** until the work is released, with fuzz tests for initialisation, invalid PDAs and release. Users sign in with their wallet; an Express backend checks devnet transactions with `@solana/web3.js` before it updates a job's state in MongoDB.",
      "A second repository, Chain-Work, restructures the project as a Turborepo monorepo.",
      "It runs on devnet only. It is a working prototype, not a launched product.",
    ],
    status: "Prototype on Solana devnet",
    contribution: "Solo — program, backend and front end",
    context: "Side project",
    year: "2026",
    stack: ["Rust", "Anchor", "Solana", "React", "TypeScript", "Node.js", "MongoDB"],
    links: [
      { label: "GitHub", href: gh("Chainwork") },
      { label: "Monorepo rewrite", href: gh("Chain-Work") },
    ],
    visit: { label: "GitHub", href: gh("Chainwork") },
    brand: { src: "/brands/chainwork.png", bg: "#05040c" },
  },
  {
    slug: "tax-receipt",
    name: "Tax receipt generator",
    shelf: "web3",
    label: "Prototype",
    desc: "Wallet-signed tax receipts for staking rewards — EIP-191 signatures checked on the server, exported as PDF with an Etherscan QR code.",
    tagline: "A receipt you can verify against the wallet that signed it.",
    story: [
      "A prototype built around Petition.io's staking rewards. The user connects MetaMask and signs the receipt with **EIP-191**; the Express backend recovers the signer and checks it before generating the document from an OpenLaw template.",
      "The receipt lists principal, rewards and their USD value, and carries a QR code linking to the transaction on Etherscan. It exports as a PDF.",
      "This is the off-chain version. Issuing receipts as ERC-721 NFTs was explored separately and is research, not shipped.",
    ],
    status: "Prototype",
    contribution: "Solo",
    context: "Petition.io",
    year: "2025",
    stack: ["Node.js", "Express", "React", "Vite", "Ethers.js", "EIP-191", "OpenLaw"],
    links: [{ label: "GitHub", href: gh("Tax-Receipt") }],
    visit: { label: "GitHub", href: gh("Tax-Receipt") },
  },
  {
    slug: "cross-chain-rebase-token",
    name: "Rebase token & CCIP bridge",
    shelf: "web3",
    label: "Learning",
    desc: "ETH vault that mints an interest-accruing rebase token, bridged across chains by a custom Chainlink CCIP pool that carries each user's rate.",
    tagline: "A rebasing token that keeps its interest rate when it changes chains.",
    story: [
      "Depositing ETH into the **Vault** mints `RBT`, an ERC-20 whose balance grows linearly with a per-user interest rate. The global rate can only go down, so early depositors keep the rate they locked in.",
      "A custom **Chainlink CCIP** token pool burns tokens on the source chain and encodes the user's rate in the message, so the destination pool mints with the same rate. The repo has unit and fork tests across Sepolia and Arbitrum Sepolia, a script that bridges Sepolia → zkSync Sepolia, and a Next.js front end.",
      "An educational project, built to learn CCIP and rebasing accounting — not an audited protocol.",
    ],
    status: "Educational — testnets only",
    contribution: "Solo",
    context: "Learning",
    year: "2025",
    stack: ["Solidity", "Foundry", "Chainlink CCIP", "Next.js"],
    links: [{ label: "GitHub", href: gh("cross-chain-rebase-token") }],
    visit: { label: "GitHub", href: gh("cross-chain-rebase-token") },
    shots: [
      { src: "/shots/tests-rebase.png", w: 1720, h: 976, caption: "forge test — 132 passing; 4 cross-chain tests need a live RPC and are excluded" },
    ],
  },
  {
    slug: "dsc-engine",
    name: "DSCEngine",
    shelf: "web3",
    label: "Testnet",
    desc: "USD-pegged stablecoin backed by WETH and WBTC — Chainlink price feeds, health-factor liquidations and invariant tests.",
    tagline: "An overcollateralised stablecoin, and the tests that try to break it.",
    story: [
      "Users deposit WETH or WBTC and mint DSC, a token pegged to one dollar. **DSCEngine** keeps every position overcollateralised using Chainlink price feeds; when a position's health factor drops below one, anyone can liquidate it for a bonus.",
      "Tested with unit, fuzz and invariant tests in Foundry — the invariant being that the protocol always holds more collateral value than DSC in circulation.",
      "Built while working through Cyfrin Updraft's Foundry course, then deployed to Sepolia with a mock WETH as collateral. All 41 tests pass.",
    ],
    status: "Coursework — deployed to Sepolia",
    contribution: "Solo",
    context: "Cyfrin Updraft",
    year: "2025",
    stack: ["Solidity", "Foundry", "Chainlink", "OpenZeppelin"],
    links: [
      { label: "GitHub", href: gh("foundry-defi-stablecoin") },
      { label: "DSCEngine on Etherscan", href: "https://sepolia.etherscan.io/address/0x091EA0838eBD5b7ddA2F2A641B068d6D59639b98" },
    ],
    visit: { label: "GitHub", href: gh("foundry-defi-stablecoin") },
    shots: [
      { src: "/shots/tests-dsc.png", w: 1720, h: 976, caption: "forge test — 41 passing, fork tests excluded (they need an RPC)" },
    ],
  },
  {
    slug: "chainlink-lottery",
    name: "Chainlink lottery",
    shelf: "web3",
    label: "Course",
    desc: "Raffle that picks its winner with Chainlink VRF and draws automatically through Chainlink Automation.",
    tagline: "A raffle whose randomness nobody, including the owner, controls.",
    story: [
      "Players enter by paying a fee. When the interval passes and there are players, **Chainlink Automation** triggers the draw, and **Chainlink VRF** supplies a verifiable random number that picks the winner.",
      "The contract is a small state machine (open → calculating) so nobody can enter mid-draw. Tested with unit, integration and forked tests in Foundry, using mocks locally.",
      "Built while working through Cyfrin Updraft's Foundry course.",
    ],
    status: "Coursework",
    contribution: "Solo",
    context: "Cyfrin Updraft",
    year: "2025",
    stack: ["Solidity", "Foundry", "Chainlink VRF", "Chainlink Automation"],
    links: [{ label: "GitHub", href: gh("foundry-smart-contract-lottery") }],
    visit: { label: "GitHub", href: gh("foundry-smart-contract-lottery") },
    shots: [
      { src: "/shots/tests-lottery.png", w: 1720, h: 976, caption: "forge test — 16 passing" },
    ],
  },
  {
    slug: "mood-nft",
    name: "Mood NFT",
    shelf: "web3",
    label: "Course",
    desc: "Fully on-chain SVG NFT whose image flips between happy and sad, next to an IPFS-hosted collection.",
    tagline: "An NFT that stores its own image and changes its mind.",
    story: [
      "Two ERC-721 contracts. **MoodNft** stores both of its SVG images on-chain as Base64 data URIs and lets the owner flip the token between happy and sad. **BasicNft** points at metadata pinned on IPFS, for comparison.",
      "Deploy scripts and unit and integration tests are written in Foundry.",
      "Built while working through Cyfrin Updraft's Foundry course.",
    ],
    status: "Coursework",
    contribution: "Solo",
    context: "Cyfrin Updraft",
    year: "2025",
    stack: ["Solidity", "Foundry", "ERC-721", "SVG", "IPFS"],
    links: [{ label: "GitHub", href: gh("foundry-nft") }],
    visit: { label: "GitHub", href: gh("foundry-nft") },
    shots: [
      { src: "/shots/moodnft.png", w: 2400, h: 1052, caption: "The two on-chain SVGs the token switches between" },
      { src: "/shots/tests-nft.png", w: 1720, h: 976, caption: "forge test — 6 passing" },
    ],
  },
  {
    slug: "fundme",
    name: "FundMe",
    shelf: "web3",
    label: "Course",
    desc: "ETH crowdfunding contract with a minimum contribution in USD, enforced through a Chainlink price feed.",
    tagline: "Crowdfunding in ETH, priced in dollars.",
    story: [
      "Anyone can fund the contract as long as their ETH is worth at least the USD minimum, converted with a Chainlink ETH/USD price feed. Only the owner can withdraw.",
      "Unit and integration tests in Foundry run against a mock price feed.",
      "My first Foundry project, from Cyfrin Updraft's course.",
    ],
    status: "Coursework",
    contribution: "Solo",
    context: "Cyfrin Updraft",
    year: "2025",
    stack: ["Solidity", "Foundry", "Chainlink Price Feeds"],
    links: [{ label: "GitHub", href: gh("foundry-FundMe") }],
    visit: { label: "GitHub", href: gh("foundry-FundMe") },
    shots: [
      { src: "/shots/tests-fundme.png", w: 1720, h: 842, caption: "forge test — 10 passing; the zkSync toolchain check is excluded" },
    ],
  },

  // ── ai & intelligent systems ─────────────────────────────────────────
  {
    slug: "stack3",
    name: "Stack3 Security",
    shelf: "ai",
    top: true,
    label: "Live",
    desc: "VS Code extension that clones a repository into quarantine and scans it as data before anything in it can run.",
    tagline: "Check a repository before you open it.",
    story: [
      "Fake-interview and “clone this task” attacks hide a command in `.vscode/tasks.json` that runs the moment a trusted folder opens. **Stack3 clones the repo into a quarantine folder, reads it as data, and shows a verdict before anything can execute.**",
    ],
    sections: [
      {
        title: "What it checks",
        points: [
          {
            term: "Auto-run",
            text: "tasks in `.vscode/tasks.json`, shell and interpreter overrides, and dev containers.",
          },
          {
            term: "Install hooks",
            text: "`preinstall` / `postinstall` scripts, package-manager and git config, hidden text.",
          },
          {
            term: "Code patterns",
            text: "`eval`, base64-then-execute, `child_process`, raw-IP requests, and reads of `.env` and key files.",
          },
          {
            term: "Secrets",
            text: "private keys, seed phrases and API keys committed to the repo.",
          },
          {
            term: "Packages",
            text: "lockfile entries checked for malware and typosquats on Socket.dev, with the user's own key.",
          },
        ],
      },
      {
        title: "Design decisions",
        points: [
          {
            term: "Never “safe”",
            text: "a clean scan reads “No known issues found. This is not a guarantee.” — rules find known patterns, not intent.",
          },
          {
            term: "Verdict levels",
            text: "critical, high, caution, unknown, no_known_issues; the overall level is the highest finding, and the server can only raise it.",
          },
          {
            term: "Explanations can't change verdicts",
            text: "the optional plain-English summary comes from Claude Haiku and sits under the verdict.",
          },
          {
            term: "Open with auto-run disabled",
            text: "moves `.vscode/` and `.devcontainer/` aside before the folder opens.",
          },
          {
            term: "Minimal egress",
            text: "only package URLs and a few masked snippets ever leave the machine; `test/egress.test.ts` checks this on every build.",
          },
        ],
      },
      {
        title: "My part",
        body: "Stack3 is a team project: a website and dashboard, a Chrome extension that checks websites and wallet requests before you sign, and the VS Code extension. **I built the VS Code extension** — most of my commits are in `vs-extension/`; the website and Chrome extension are my teammates' work. Attacker wallets and domains found in public repos are reported to the team's TigerGraph threat graph.",
      },
    ],
    status: "VS Code extension on the Marketplace; Chrome extension on GitHub while its Web Store listing is in review",
    contribution: "The VS Code extension",
    context: "Team",
    year: "2026",
    stack: ["TypeScript", "VS Code API", "Socket.dev", "Claude Haiku", "TigerGraph"],
    links: [
      { label: "Website", href: "https://stack3security.stack3security.workers.dev" },
      { label: "VS Code Marketplace", href: "https://marketplace.visualstudio.com/items?itemName=Stack3Security.stack3-vscode" },
      { label: "Chrome extension (GitHub release)", href: "https://github.com/yashjain197/stack3security/releases/tag/chrome-v0.1.0" },
      { label: "Source", href: "https://github.com/yashjain197/stack3security" },
    ],
    visit: { label: "marketplace", href: "https://marketplace.visualstudio.com/items?itemName=Stack3Security.stack3-vscode" },
    shots: [
      { src: "/shots/stack3-1.png", w: 960, h: 870, caption: "Critical verdict — an auto-run task, an install script and a hidden payload" },
      { src: "/shots/stack3-2.png", w: 960, h: 330, caption: "A clean scan never says “safe”" },
      { src: "/shots/stack3-site.png", w: 1440, h: 900, caption: "Stack3 website — the team's landing page" },
      { src: "/shots/stack3-how.png", w: 1440, h: 900, caption: "How it works — checks at the code side and the wallet side" },
      { src: "/shots/stack3-download.png", w: 1440, h: 900, caption: "Download page — VS Code from the Marketplace, Chrome from GitHub" },
      { src: "/shots/stack3-chrome.png", w: 760, h: 760, caption: "Chrome extension popup (v0.1.0), before linking an account" },
    ],
    flows: [
      {
        title: "Clone and scan safely",
        steps: [
          { label: "GitHub URL", sub: "pasted by the user" },
          { label: "Quarantine clone", sub: "never opened as a workspace", accent: true },
          { label: "Scan as data", sub: "local rules · optional Socket.dev" },
          { label: "Verdict", sub: "critical → no_known_issues" },
          [
            { label: "Delete" },
            { label: "Open, auto-run disabled", accent: true },
            { label: "Open" },
          ],
        ],
      },
    ],
  },
  {
    slug: "vryse-blog-writer",
    name: "AI blog-writing system",
    shelf: "ai",
    top: true,
    label: "Assignment",
    desc: "Learns a company's blog voice from its own articles, writes new ones, scores them on seven dimensions and checks every revision.",
    tagline: "On-brand articles, scored by code and by a judge from a different model family.",
    story: [
      "Built as an engineering assignment for VRYSE. The system reads a company's existing articles — 61 from Routematic — measures 37 features per article in code, and combines them with LLM notes on tone and structure into a **style profile**.",
    ],
    sections: [
      {
        title: "Pipeline",
        points: [
          {
            term: "Analysis",
            text: "37 features measured per article in code, plus LLM notes on tone and structure, consolidated into a style profile.",
          },
          {
            term: "Generation",
            text: "hybrid embedding + BM25 retrieval, an outline that code checks against the brief, then a lint for invented links, copied passages and unsupported figures.",
          },
          {
            term: "Evaluation",
            text: "seven dimensions, each mixing code-measured features with an anchored-rubric judge that quotes its evidence.",
          },
          {
            term: "Feedback loop",
            text: "reviewer notes become typed instructions with acceptance checks; only the targeted sections are revised, every instruction is verified, and a blind side-by-side gives a verdict.",
          },
        ],
      },
      {
        title: "Results",
        points: [
          {
            term: "Calibration",
            text: "on held-out briefs, real Routematic articles scored 85.5, a generic AI article 70.0, and this system 87.0.",
          },
          {
            term: "Before / after",
            text: "two feedback cycles took one article from 83.5 to 89.1 — +5.6 against a 3-point noise threshold.",
          },
          {
            term: "Cost",
            text: "about $0.03–0.05 per article; the whole project, experiments included, cost $1.33.",
          },
        ],
      },
      {
        title: "Technical decisions",
        points: [
          {
            term: "A different judge",
            text: "the judge comes from a different model family than the writer, to reduce self-preference.",
          },
          {
            term: "Local embeddings",
            text: "`bge-small` on CPU — 457 chunks don't need a vector database.",
          },
          {
            term: "Typed end to end",
            text: "every LLM output and API input is validated with Zod.",
          },
          {
            term: "One app",
            text: "Next.js 16 server components read the database directly and route handlers stream pipeline progress.",
          },
        ],
      },
    ],
    status: "Complete — assignment",
    contribution: "Solo",
    context: "VRYSE assignment",
    year: "2026",
    stack: ["TypeScript", "Next.js", "AI SDK", "Zod", "SQLite", "Drizzle", "BM25 + embeddings"],
    links: [{ label: "GitHub", href: gh("VRYSE-AI-blog-writing") }],
    visit: { label: "GitHub", href: gh("VRYSE-AI-blog-writing") },
    shots: [
      { src: "/shots/vryse-run-page.png", w: 1360, h: 1500, caption: "Run page — verdict, verified instructions and the seven scores" },
      { src: "/shots/vryse-new-article.png", w: 1360, h: 860, caption: "Writing a new article from a brief" },
      { src: "/shots/vryse-compare-page.png", w: 1360, h: 1500, caption: "Comparing two versions of an article" },
    ],
  },
  {
    slug: "nutrivora",
    name: "Nutrivora AI",
    shelf: "ai",
    top: true,
    desc: "React Native app that generates Indian-food-first diet plans with Gemini and tracks meals and macros.",
    tagline: "Diet plans built around the food people actually eat.",
    story: [
      "A cross-platform mobile app in **React Native with Expo**. Gemini generates diet plans for muscle gain, fat loss, lean bulk or maintenance from a user's age, weight, height, activity level and budget — with Indian meals first.",
      "Users log breakfast, lunch, dinner and snacks; macros are calculated automatically, foods come from the Spoonacular API, and packaged foods can be scanned by barcode through OpenFoodFacts. Sign-in is through Firebase.",
    ],
    status: "Personal project",
    contribution: "Solo",
    context: "Side project",
    year: "2026",
    stack: ["React Native", "Expo", "Gemini API", "Firebase", "TypeScript"],
    links: [{ label: "GitHub", href: gh("Calorique-App") }],
    visit: { label: "GitHub", href: gh("Calorique-App") },
  },

  // ── full-stack applications ──────────────────────────────────────────
  {
    slug: "jobtrack",
    name: "JobTrack",
    shelf: "fullstack",
    top: true,
    label: "Deployed",
    desc: "Job-application tracker with live Adzuna search and AI resume-to-job matching that falls back to local scoring when the model is down.",
    tagline: "A job search, tracked like a pipeline.",
    story: [
      "Tracks every application after it's sent, pulls in new listings, and checks how well a resume fits each job.",
    ],
    sections: [
      {
        title: "Features",
        points: [
          {
            term: "Pipeline",
            text: "applications move from applied to offer, rejected or withdrawn, with interviews, notes, salary and follow-up dates.",
          },
          {
            term: "Live search",
            text: "Adzuna listings fetched through the backend, so provider keys never reach the browser.",
          },
          {
            term: "Resume match",
            text: "Gemini compares a PDF, text or LaTeX resume with a job description — skills, experience, gaps and suggested changes.",
          },
          {
            term: "Fallback",
            text: "if the model is unavailable, a deterministic local matcher still returns a result.",
          },
        ],
      },
      {
        title: "Stack",
        body: "Express and TypeScript with PostgreSQL and Prisma on Render; React 19 with TanStack Query on Vercel. Auth uses JWTs in `httpOnly` cookies, with rate limiting. The API sleeps on Render's free tier, so the first request can take a minute.",
      },
    ],
    status: "Deployed — the API sleeps on Render's free tier, so it can take a minute to wake",
    contribution: "Solo",
    context: "Side project",
    year: "2026",
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Prisma", "Gemini API"],
    links: [
      { label: "Live app", href: "https://jobtrack-frontend-gamma.vercel.app" },
      { label: "GitHub", href: gh("JobTrack") },
    ],
    visit: { label: "app", href: "https://jobtrack-frontend-gamma.vercel.app" },
  },
  {
    slug: "bst-visualizer",
    name: "BST visualizer",
    shelf: "fullstack",
    top: true,
    label: "Live",
    desc: "Binary-search-tree operations animated step by step, with live pseudocode and a log narrating each decision.",
    tagline: "Watch every comparison a binary search tree makes.",
    story: [
      "Insert, delete, search, predecessor/successor, select(k) and all four traversals — each animated step by step. The active pseudocode line is highlighted as the animation plays, and a console log narrates every comparison.",
      "Play, pause and speed controls, zoom and pan, light and dark themes, and a layout that works on phones. Next.js 16 and strict TypeScript, with no CSS framework.",
    ],
    status: "Live",
    contribution: "Solo",
    context: "Side project",
    year: "2026",
    stack: ["Next.js", "React", "TypeScript"],
    links: [
      { label: "Live demo", href: "https://bstvisualizernextjs.vercel.app" },
      { label: "GitHub", href: gh("BST-visualizer") },
    ],
    visit: { label: "live", href: "https://bstvisualizernextjs.vercel.app" },
    shots: [
      { src: "/shots/bst.png", w: 1440, h: 900, caption: "A ten-node tree with live stats" },
      { src: "/shots/bst-inorder.png", w: 1440, h: 900, caption: "Inorder traversal, mid-animation" },
    ],
  },

  // ── open source & hackathons ─────────────────────────────────────────
  {
    slug: "openzeppelin-erc7943",
    name: "OpenZeppelin Community Contracts",
    shelf: "oss",
    top: true,
    label: "OSS",
    desc: "Split ERC20uRWA's transfer checks into canSend / canReceive — cherry-picked with authorship into the merged ERC-7943 fix.",
    tagline: "A small change to how a real-world-asset token decides who can move it.",
    story: [
      "`ERC20uRWA` is OpenZeppelin's community implementation of **ERC-7943**, a standard for regulated, real-world-asset tokens. My PR (#249) added virtual `canSend` and `canReceive` checks, so send-side and receive-side restrictions can be overridden independently instead of through a single hook.",
      "The maintainer's review found that other parts of the PR deviated from the final EIP, so rather than merging it they **cherry-picked my commit, authorship preserved, into #254**, which aligns the contract with the final specification and was merged in July 2026.",
    ],
    status: "Merged via #254",
    contribution: "The canSend / canReceive split",
    context: "Open source",
    year: "2026",
    stack: ["Solidity", "ERC-7943", "OpenZeppelin"],
    links: [
      { label: "My PR #249", href: "https://github.com/OpenZeppelin/openzeppelin-community-contracts/pull/249" },
      { label: "Merged PR #254", href: "https://github.com/OpenZeppelin/openzeppelin-community-contracts/pull/254" },
    ],
    visit: { label: "GitHub", href: "https://github.com/OpenZeppelin/openzeppelin-community-contracts/pull/254" },
    shots: [
      { src: "/shots/oz-254.png", w: 1440, h: 900, caption: "#254, merged — my commit was cherry-picked in with authorship" },
    ],
  },
  {
    slug: "travel-advisor",
    name: "Travel Advisor",
    shelf: "oss",
    top: true,
    label: "4th · Geekathon 1.0",
    desc: "Travel planning app — hotels, restaurants, flights, weather and a trip planner — built at Geekathon 1.0, where it placed fourth.",
    tagline: "Where to go, built in a hackathon weekend.",
    story: [
      "A React app for planning a trip: after Google sign-in you can explore hotels, restaurants, flights, weather, travel agencies and travel blogs, and plan a trip. Firebase handles auth and Sanity serves the content. Built as a team at **Geekathon 1.0**, where it placed **4th**.",
      "It is still deployed on Vercel.",
    ],
    status: "Live · hackathon",
    contribution: "Team project",
    context: "Geekathon 1.0",
    year: "2023",
    stack: ["React", "Firebase", "Sanity", "Tailwind CSS"],
    links: [
      { label: "Live app", href: "https://travel-companion-gamma.vercel.app" },
      { label: "GitHub", href: gh("TravelCompanion") },
    ],
    visit: { label: "live", href: "https://travel-companion-gamma.vercel.app" },
    shots: [
      { src: "/shots/travel.png", w: 1440, h: 900, caption: "Sign-in screen listing what the app covers" },
    ],
  },
];

export const projectsByShelf = (id: ShelfId) => projects.filter((p) => p.shelf === id);

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
