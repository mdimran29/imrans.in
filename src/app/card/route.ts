import { buildCard } from "@/lib/card";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildCard(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
