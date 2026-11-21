"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "./Icons";
import type { Flow, FlowNode } from "@/data/projects";

function Node({ node, n }: { node: FlowNode; n: number }) {
  return (
    <span
      className={`flow__node${node.accent ? " flow__node--accent" : ""}`}
      style={{ "--n": n } as React.CSSProperties}
    >
      <span className="flow__label">{node.label}</span>
      {node.sub && <span className="flow__sub">{node.sub}</span>}
    </span>
  );
}

/**
 * Step-by-step diagrams. Each flow lights up node by node once when it
 * scrolls into view, and loops while hovered. Pure CSS animation; the
 * observer only flips data-play. Reduced-motion users get the static diagram.
 */
export function Flows({ flows }: { flows: Flow[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.play = "true";
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.6 },
    );
    root.querySelectorAll(".flow").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="flows" ref={ref}>
      {flows.map((flow) => {
        return (
          <figure className="flow" key={flow.title} style={{ "--steps": flow.steps.length } as React.CSSProperties}>
            <figcaption className="flow__title label">{flow.title}</figcaption>
            <ol className="flow__track" role="list">
              {flow.steps.map((step, index) => {
                return (
                  <li className="flow__step" key={index}>
                      {index > 0 && (
                        <ArrowRight className="flow__arrow" style={{ "--n": index } as React.CSSProperties} />
                      )}
                      {Array.isArray(step) ? (
                        <ul className="flow__group" role="list" aria-label="In parallel">
                          {step.map((node) => (
                            <li key={node.label}>
                              <Node node={node} n={index} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Node node={step} n={index} />
                      )}
                  </li>
                );
              })}
            </ol>
          </figure>
        );
      })}
    </div>
  );
}
