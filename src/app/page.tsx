import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CopyButton } from "@/components/CopyButton";
import { ArrowUpRight } from "@/components/Icons";
import { Ext, More, Socials, Thumb } from "@/components/bits";
import { site } from "@/data/site";
import { jobs, type Job } from "@/data/experience";
import { projectsByShelf, shelves, type Project } from "@/data/projects";
import { achievements, skills } from "@/data/skills";

function JobItem({ job }: { job: Job }) {
  return (
    <li className="job">
      <div className="job__head">
        <h3 className="job__title">
          {job.role}
          <span className="job__at"> at </span>
          {job.href ? (
            <Ext className="link link--accent" href={job.href}>
              {job.org}
            </Ext>
          ) : (
            <span className="job__org">{job.org}</span>
          )}
        </h3>
        <p className="job__when">
          {job.start} — {job.end}
        </p>
      </div>
      <p className="job__where">{job.where}</p>
      <p className="job__summary">{job.summary}</p>
      {job.groups && (
        <dl className="duties">
          {job.groups.map((g) => (
            <div className="duties__row" key={g.label}>
              <dt className="label">{g.label}</dt>
              <dd>
                <ul role="list">
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      )}
      {job.stack && (
        <ul className="tags" role="list" aria-label="Stack">
          {job.stack.map((t) => (
            <li className="tag" key={t}>
              {t}
            </li>
          ))}
        </ul>
      )}
      {job.caseStudy && (
        <Link className="job__more link" href={`/projects/${job.caseStudy}`}>
          Read the full write-up →
        </Link>
      )}
    </li>
  );
}

function ProjectItem({ p }: { p: Project }) {
  return (
    <li className="item focus-item">
      <div className="item__row">
        <Thumb name={p.name} shots={p.shots} brand={p.brand} />
        <span className="item__body">
          <span className="item__name">
            <Link className="item__anchor" href={`/projects/${p.slug}`}>
              {p.name}
            </Link>
            {p.label && <span className="label">{p.label}</span>}
            {p.visit && (
              <a className="visit" href={p.visit.href} target="_blank" rel="noreferrer">
                {p.visit.label}
                <ArrowUpRight className="icon-arrow" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </span>
          <span className="item__desc">{p.desc}</span>
        </span>
        <span className="item__side">
          <span className="item__meta">
            {p.context} · {p.year}
          </span>
          <ArrowUpRight className="item__arrow" aria-hidden="true" />
        </span>
      </div>
    </li>
  );
}

export default function Home() {
  const card = `curl -sL ${site.host}`;
  const [firstJob, ...olderJobs] = jobs;

  return (
    <>
      <Header />
      <main id="main">
        <section className="hero container" id="top" aria-labelledby="hero-title">
          <h1 className="hero__title rise" id="hero-title" style={{ "--i": 0 } as React.CSSProperties}>
            {site.name}
            <span className="hero__role">{site.role}</span>
          </h1>
          <p className="hero__lead rise" style={{ "--i": 1 } as React.CSSProperties}>
            I build intelligent applications, decentralized systems and practical products — across{" "}
            <strong>frontend, backend, smart contracts and AI integrations</strong>. Right now that means a
            principal-protected staking treasury at Petition.io, from {site.location}.
          </p>
          <Socials className="hero__socials rise" style={{ "--i": 2 } as React.CSSProperties} />
          <div className="terminal rise" style={{ "--i": 3 } as React.CSSProperties}>
            <span className="terminal__prompt" aria-hidden="true">
              $
            </span>
            <span className="sr-only">Business card for your terminal: </span>
            <code className="terminal__cmd">{card}</code>
            <span className="terminal__hint label" aria-hidden="true">
              in a terminal
            </span>
            <CopyButton text={card} label="Copy terminal business-card command" />
          </div>
        </section>

        <section className="section" id="experience" aria-labelledby="experience-title">
          <div className="container section__body">
            <div className="section-head">
              <h2 className="section-head__title" id="experience-title">
                Experience
              </h2>
            </div>
            <ol className="jobs" role="list">
              <JobItem job={firstJob} />
            </ol>
            {olderJobs.length > 0 && (
              <More count={olderJobs.length} noun={olderJobs.length === 1 ? "role" : "roles"}>
                <ol className="jobs" role="list">
                  {olderJobs.map((j) => (
                    <JobItem key={j.org} job={j} />
                  ))}
                </ol>
              </More>
            )}
            <div className="edu">
              <p className="edu__title">
                {site.education.degree}
                <span className="job__at"> at </span>
                {site.education.school}
              </p>
              <p className="job__when">
                {site.education.years} · CGPA {site.education.cgpa} · {site.education.affiliation}
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="projects" aria-labelledby="projects-title">
          <div className="container section__body">
            <div className="section-head">
              <h2 className="section-head__title" id="projects-title">
                Projects
              </h2>
              <span className="section-head__meta label">labels show how far each got</span>
            </div>
            <div className="shelf">
              {shelves.map((s) => {
                const list = projectsByShelf(s.id);
                const top = list.filter((p) => p.top);
                const rest = list.filter((p) => !p.top);
                return (
                  <div key={s.id} className="reveal">
                    <h3 className="shelf__title">{s.title}</h3>
                    <ul className="items focus-list" role="list">
                      {top.map((p) => (
                        <ProjectItem key={p.slug} p={p} />
                      ))}
                    </ul>
                    {rest.length > 0 && (
                      <More count={rest.length} noun={s.noun}>
                        <ul className="items focus-list" role="list">
                          {rest.map((p) => (
                            <ProjectItem key={p.slug} p={p} />
                          ))}
                        </ul>
                      </More>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="section__foot">
              Everything else is on{" "}
              <Ext className="link" href={site.github}>
                GitHub
              </Ext>
            </p>
          </div>
        </section>

        <section className="section" id="skills" aria-labelledby="skills-title">
          <div className="container section__body">
            <div className="section-head">
              <h2 className="section-head__title" id="skills-title">
                Skills
              </h2>
            </div>
            <dl className="skills reveal">
              {skills.map((g) => (
                <div className="skills__row" key={g.group}>
                  <dt className="label">{g.group}</dt>
                  <dd>
                    {g.items.map((i, n) => (
                      <span key={i}>
                        {i}
                        {n < g.items.length - 1 && <span className="skills__sep" aria-hidden="true"> · </span>}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>

            <h3 className="shelf__title skills__sub">achievements</h3>
            <ol className="posts focus-list reveal" role="list">
              {achievements.map((a) => (
                <li className="post focus-item" key={a.title}>
                  <div className="post__row">
                    {a.href ? (
                      <a className="post__title" href={a.href} target="_blank" rel="noreferrer">
                        {a.title}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="post__title">{a.title}</span>
                    )}
                    <span className="post__date">
                      {a.when} · {a.detail}
                    </span>
                    <ArrowUpRight className="post__arrow" aria-hidden="true" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="contact" aria-labelledby="contact-title">
          <div className="container section__body">
            <div className="section-head">
              <h2 className="section-head__title" id="contact-title">
                Contact
              </h2>
            </div>
            <p className="contact__pitch">
              Open to engineering roles, collaborations and interesting technical problems — smart contracts, AI
              tooling or full-stack products. Email is the fastest way to reach me.
            </p>
            <div className="contact__email-row">
              <a className="contact__email link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <CopyButton text={site.email} label="Copy email address" />
            </div>
            <ul className="writing__all" role="list">
              <li>
                <Ext className="link" href={site.github}>
                  github.com/mdimran29
                </Ext>
              </li>
              <li>
                <Ext className="link" href={site.linkedin}>
                  linkedin.com/in/mdimran29
                </Ext>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
