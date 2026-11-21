import { NextResponse, type NextRequest } from "next/server";

// Terminal clients get the ANSI business card instead of HTML: `curl -sL <host>`.
const TERMINAL_UA = /^(curl|wget|httpie|xh|aria2|powershell|libfetch)\b/i;

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const res = TERMINAL_UA.test(ua)
    ? NextResponse.rewrite(new URL("/card", request.url))
    : NextResponse.next();
  // Caches must key on the client type, or a browser could be served the card.
  res.headers.set("Vary", "User-Agent");
  return res;
}

export const config = { matcher: "/" };
