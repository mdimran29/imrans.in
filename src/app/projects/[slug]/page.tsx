import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowRight, TxtIcon } from "@/components/Icons";
import { Gallery } from "@/components/Gallery";
import { Ext, Rich } from "@/components/bits";
import { Flows } from "@/components/Flows";
import { getProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.desc,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.name, description: p.desc, url: `/projects/${p.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const shots = p.shots ?? [];
  const papers = [...shots, ...shots, ...shots].slice(0, 3);

  return (
    <>
      <Header home={false} />
      <main id="main" className="project">
        <div className="project__bar">
          <Link className="project__back" href="/#projects">
            <ArrowLeft />
            All projects
          </Link>
          <a className="project__txt" href={`/projects/${p.slug}.txt`}>
            <TxtIcon />
            .txt
            <span className="sr-only"> — plain-text version of this page</span>
          </a>
        </div>

        <div
          className={`project__cover${p.brand ? " project__cover--brand" : ""}`}
          style={p.brand ? ({ "--brand": p.brand.bg } as React.CSSProperties) : undefined}
          aria-hidden="true"
        >
          {p.brand ? (
            <Image className="project__logo" src={p.brand.src} alt="" width={256} height={256} sizes="160px" />
          ) : shots.length ? (
            <span className="folder project__folder">
              <span className="folder__back" />
              {papers.map((shot, n) => (
                <span className="folder__paper" key={n}>
                  <Image src={shot.src} alt="" width={640} height={400} sizes="200px" />
                </span>
              ))}
              <span className="folder__front" />
            </span>
          ) : (
            <span className="project__monogram">{p.name.replace(/[^A-Za-z]/g, "").charAt(0)}</span>
          )}
          <span className="project__cover-org label">{p.context}</span>
          <span className="project__cover-year label">{p.year}</span>
        </div>

        <div className="project__head">
          <h1 className="project__title">{p.name}</h1>
          {p.label && <span className="label">{p.label}</span>}
        </div>
        <p className="project__tagline">{p.tagline}</p>

        <dl className="facts">
          <div>
            <dt className="label">Status</dt>
            <dd>{p.status}</dd>
          </div>
          <div>
            <dt className="label">My part</dt>
            <dd>{p.contribution}</dd>
          </div>
          <div>
            <dt className="label">Year</dt>
            <dd>{p.year}</dd>
          </div>
        </dl>

        <div className="project__story">
          {p.story.map((para, n) => (
            <p key={n}>
              <Rich text={para} />
            </p>
          ))}
        </div>

        <ul className="project__links" role="list">
          {p.links.map((l) => (
            <li key={l.href}>
              <Ext className="cta" href={l.href}>
                {l.label}
              </Ext>
            </li>
          ))}
        </ul>

        <ul className="pills" role="list" aria-label="Stack">
          {p.stack.map((t) => (
            <li className="pill" key={t}>
              {t}
            </li>
          ))}
        </ul>

        {shots.length > 0 && <Gallery shots={shots} name={p.name} />}

        {p.outcomes && (
          <dl className="outcomes project__outcomes">
            {p.outcomes.map((o) => (
              <div className="outcome" key={o.label}>
                <dt className="outcome__label">{o.label}</dt>
                <dd className="outcome__value">{o.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {p.flows && (
          <section className="project__flows" aria-label="How it works">
            <Flows flows={p.flows} />
          </section>
        )}

        {p.sections?.map((sec) => (
          <section className="project__section" key={sec.title}>
            <h2 className="project__h2">{sec.title}</h2>
            {sec.body && (
              <p>
                <Rich text={sec.body} />
              </p>
            )}
            {sec.points && (
              <ul className="points" role="list">
                {sec.points.map((pt) => (
                  <li key={pt.term}>
                    <strong>{pt.term}</strong>: <Rich text={pt.text} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {p.rules && (
          <section className="project__section" aria-labelledby="rules-title">
            <h2 className="project__h2" id="rules-title">
              Enforced in code
            </h2>
            <ul className="rules" role="list">
              {p.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        )}


        <nav className="pager" aria-label="More projects">
          <Link className="pager__link" href={`/projects/${prev.slug}`}>
            <span className="label">
              <ArrowLeft />
              Previous
            </span>
            <span className="pager__name">{prev.name}</span>
          </Link>
          <Link className="pager__link pager__link--next" href={`/projects/${next.slug}`}>
            <span className="label">
              Next
              <ArrowRight />
            </span>
            <span className="pager__name">{next.name}</span>
          </Link>
        </nav>
      </main>
      <Footer home={false} />
    </>
  );
}
