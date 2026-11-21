# imrans.in

Personal site of **Md Imran** — Full-Stack AI & Blockchain Engineer, Kolkata.

**Live:** [imrans.in](https://imrans.in) · `curl -sL imrans.in` prints a business card in your terminal.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · plain CSS. No UI libraries; deployed on Vercel.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Where things live

| Path | What |
|---|---|
| `src/data/site.ts` | Name, links, email, site URL (`NEXT_PUBLIC_SITE_URL` overrides it) |
| `src/data/experience.ts` | Roles |
| `src/data/projects.ts` | Projects — status, write-up sections, screenshots, flow diagrams |
| `src/data/skills.ts` | Skills and achievements |
| `public/shots/` | Project screenshots (add `w`, `h` and a `caption` in `projects.ts`) |
| `src/proxy.ts` + `src/app/card/` | Serves the ANSI card to `curl` / `wget` |
| `src/app/txt/` | Plain-text project pages at `/projects/<slug>.txt` |

Every project lists its real status — live, testnet, coursework or pre-audit — and, for team work, which part was mine.
