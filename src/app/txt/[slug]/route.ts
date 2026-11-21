import { getProject, projects } from "@/data/projects";
import { projectText } from "@/lib/projectText";

// Served publicly at /projects/<slug>.txt through a rewrite in next.config.ts.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) return new Response("Not found\n", { status: 404 });
  return new Response(projectText(p), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
