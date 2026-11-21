import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header home={false} />
      <main id="main" className="container not-found">
        <span className="label">404</span>
        <h1 className="display">
          <span>Nothing</span>
          <span>
            <em>deployed</em> here.
          </span>
        </h1>
        <p>
          This address doesn&apos;t resolve to anything. Head back to the{" "}
          <Link className="link" href="/">
            homepage
          </Link>
          .
        </p>
      </main>
      <Footer home={false} />
    </>
  );
}
