import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";
import { socials, type SocialIcon } from "@/data/site";
import type { Shot } from "@/data/projects";

/** External link: new tab, announced to screen readers, arrow kept with the last word. */
export function Ext({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight className="icon-arrow" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

const iconFor: Record<SocialIcon, typeof GitHubIcon> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: MailIcon,
};

export function Socials({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <ul className={`socials ${className}`} role="list" style={style}>
      {socials.map((s) => {
        const Icon = iconFor[s.icon];
        const external = s.href.startsWith("http");
        return (
          <li key={s.label}>
            <a
              className="socials__link"
              href={s.href}
              title={s.label}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              <Icon />
              <span className="sr-only">{s.label}</span>
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Tiny inline formatter for data copy: **strong** and `code`. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : p.startsWith("`") ? (
          <code key={i}>{p.slice(1, -1)}</code>
        ) : (
          p
        ),
      )}
    </>
  );
}

/** List thumbnail: the organisation's logo, a folder of screenshots, or a monogram card. */
export function Thumb({
  name,
  shots,
  brand,
}: {
  name: string;
  shots?: Shot[];
  brand?: { src: string; bg: string };
}) {
  if (brand) {
    return (
      <span className="thumb" aria-hidden="true">
        <span className="thumb__card thumb__card--brand" style={{ "--brand": brand.bg } as React.CSSProperties}>
          <Image src={brand.src} alt="" width={64} height={64} sizes="64px" />
        </span>
      </span>
    );
  }
  if (shots?.length) {
    const papers = [...shots, ...shots, ...shots].slice(0, 3);
    return (
      <span className="thumb" aria-hidden="true">
        <span className="folder">
          <span className="folder__back" />
          {papers.map((shot, i) => (
            <span className="folder__paper" key={i}>
              <Image src={shot.src} alt="" width={160} height={100} sizes="48px" />
            </span>
          ))}
          <span className="folder__front" />
        </span>
      </span>
    );
  }
  return (
    <span className="thumb" aria-hidden="true">
      <span className="thumb__card">{name.replace(/[^A-Za-z]/g, "").charAt(0)}</span>
    </span>
  );
}

/** Native <details> fold — keyboard and screen-reader friendly without any JS. */
export function More({ count, noun, children }: { count: number; noun: string; children: ReactNode }) {
  return (
    <details className="more">
      <summary>
        <span className="more__closed">
          <span aria-hidden="true">more →</span>
          <span className="sr-only">
            Show {count} more {noun}
          </span>
        </span>
        <span className="more__open">
          <span aria-hidden="true">less ↑</span>
          <span className="sr-only">Show fewer {noun}</span>
        </span>
      </summary>
      {children}
    </details>
  );
}
