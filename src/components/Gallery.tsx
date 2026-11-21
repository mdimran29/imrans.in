"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "./Icons";
import type { Shot } from "@/data/projects";

/**
 * Screenshot carousel: native horizontal scroll with snap points (so touch
 * swipe and trackpads just work), prev/next buttons, dots, and arrow keys.
 * Clicking a slide opens it full size in a <dialog> lightbox that has its own
 * arrows, arrow-key navigation, and Esc / backdrop click to close.
 */
export function Gallery({ shots, name }: { shots: Shot[]; name: string }) {
  const track = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState<number | null>(null);
  const many = shots.length > 1;
  const label = (i: number) => shots[i].caption ?? `${name} — screenshot ${i + 1}`;

  // Track which slide sits nearest the track's left edge.
  useEffect(() => {
    const el = track.current;
    if (!el || !many) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const slides = [...el.children] as HTMLElement[];
        const left = el.scrollLeft;
        const atEnd = left + el.clientWidth >= el.scrollWidth - 4;
        let best = 0;
        slides.forEach((s, i) => {
          if (Math.abs(s.offsetLeft - el.offsetLeft - left) < Math.abs(slides[best].offsetLeft - el.offsetLeft - left)) best = i;
        });
        setActive(atEnd ? slides.length - 1 : best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [many]);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = el.children.length;
    const target = el.children[(i + n) % n] as HTMLElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    setActive((i + n) % n);
  }, []);

  const open = (i: number) => {
    setZoomed(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = useCallback(
    (d: number) => setZoomed((z) => (z === null ? z : (z + d + shots.length) % shots.length)),
    [shots.length],
  );

  // Keep the page from scrolling behind the lightbox.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      if (zoomed !== null) goTo(zoomed);
      setZoomed(null);
    };
    d.addEventListener("close", onClose);
    if (zoomed !== null) document.documentElement.style.overflow = "hidden";
    return () => d.removeEventListener("close", onClose);
  }, [zoomed, goTo]);

  return (
    <section className="gallery" aria-roledescription="carousel" aria-label={`${name} screenshots`}>
      <ul
        ref={track}
        className={`gallery__track${many ? "" : " gallery__track--single"}`}
        role="list"
        tabIndex={many ? 0 : undefined}
        aria-label={many ? "Use the left and right arrow keys to move between screenshots" : undefined}
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          goTo(active + (e.key === "ArrowRight" ? 1 : -1));
        }}
      >
        {shots.map((shot, i) => (
          <li
            className="gallery__slide"
            key={shot.src}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${shots.length}`}
            style={{ "--ratio": shot.w / shot.h } as React.CSSProperties}
          >
            <button type="button" className="shot" onClick={() => open(i)} aria-label={`View larger: ${label(i)}`}>
              <Image
                src={shot.src}
                alt={label(i)}
                width={shot.w}
                height={shot.h}
                sizes="(max-width: 48rem) 90vw, 44rem"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="gallery__foot">
        <p className="gallery__caption" aria-live="polite">
          {label(active)}
        </p>
        {many && (
          <div className="gallery__controls">
            <span className="gallery__count label" aria-hidden="true">
              {active + 1} / {shots.length}
            </span>
            <button type="button" className="icon-button" onClick={() => goTo(active - 1)} aria-label="Previous screenshot">
              <ArrowLeft />
            </button>
            <button type="button" className="icon-button" onClick={() => goTo(active + 1)} aria-label="Next screenshot">
              <ArrowRight />
            </button>
          </div>
        )}
      </div>
      {many && (
        <div className="gallery__dots" role="group" aria-label="Choose a screenshot">
          {shots.map((shot, i) => (
            <button
              type="button"
              key={shot.src}
              className="gallery__dot"
              aria-label={`Screenshot ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={zoomed !== null ? label(zoomed) : "Screenshot"}
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={(e) => {
          if (!many) return;
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {zoomed !== null && (
          <figure className="lightbox__figure">
            <Image
              className="lightbox__img"
              src={shots[zoomed].src}
              alt={label(zoomed)}
              width={shots[zoomed].w}
              height={shots[zoomed].h}
              sizes="96vw"
            />
            <figcaption className="lightbox__caption">
              {label(zoomed)}
              {many && (
                <span className="label">
                  {zoomed + 1} / {shots.length}
                </span>
              )}
            </figcaption>
          </figure>
        )}
        <button type="button" className="icon-button lightbox__close" onClick={close} aria-label="Close">
          ✕
        </button>
        {many && (
          <>
            <button type="button" className="icon-button lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label="Previous screenshot">
              <ArrowLeft />
            </button>
            <button type="button" className="icon-button lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label="Next screenshot">
              <ArrowRight />
            </button>
          </>
        )}
      </dialog>
    </section>
  );
}
