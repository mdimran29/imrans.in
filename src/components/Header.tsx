"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";
import { site } from "@/data/site";

export const sections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — the choice just won't persist */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

export function Header({ home = true }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  const href = (id: string) => (home ? `#${id}` : `/#${id}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently under the header.
  useEffect(() => {
    if (!home) return;
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
        const first = atBottom ? sections[sections.length - 1].id : sections.find((s) => visible.get(s.id))?.id;
        setActive(first ?? null);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [home]);

  const close = useCallback((focusButton = false) => {
    setOpen(false);
    if (focusButton) menuButton.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const onResize = () => window.innerWidth >= 832 && close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <header className="site-header" data-scrolled={scrolled || open}>
      <div className="container site-header__inner">
        <Link className="wordmark" href={home ? "#top" : "/"} onClick={() => close()}>
          <span>{site.first}</span> <em>{site.last}</em>
          <span className="sr-only">{home ? ", back to top" : ", home"}</span>
        </Link>
        <nav className="site-nav" aria-label="Sections">
          {sections.map((s) => (
            <a key={s.id} href={href(s.id)} className="label" aria-current={active === s.id ? "true" : undefined}>
              {s.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            className="menu-button label"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="menu-button__bars" aria-hidden="true" />
            Menu
          </button>
        </div>
      </div>
      <nav id="mobile-nav" className="mobile-nav container" aria-label="Sections" hidden={!open}>
        <ul role="list">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={href(s.id)} onClick={() => close()}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
