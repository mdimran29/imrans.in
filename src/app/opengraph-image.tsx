import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "#12110f",
          color: "#ede8dc",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#8f897d", textTransform: "uppercase" }}>
          {site.host}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 108, fontFamily: "serif", letterSpacing: -3, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 30, letterSpacing: 5, color: "#ebb65e", textTransform: "uppercase" }}>
            {site.role}
          </div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 30, color: "#bfb8aa", maxWidth: 900, lineHeight: 1.4 }}>
            Smart contracts, staking & yield systems, AI developer tools and full-stack products.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8f897d" }}>
          <span>{site.location}</span>
          <span>github.com/mdimran29</span>
        </div>
      </div>
    ),
    size,
  );
}
