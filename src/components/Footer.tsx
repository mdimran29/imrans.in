import { Socials } from "./bits";
import { site } from "@/data/site";

export function Footer({ home = true }: { home?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__note">
          © {new Date().getFullYear()} {site.name} · <a className="link" href="/llms.txt">llms.txt</a> ·{" "}
          <a className="link" href={home ? "#top" : "/"}>
            {home ? "back to top ↑" : "home"}
          </a>
        </p>
        <Socials />
      </div>
    </footer>
  );
}
