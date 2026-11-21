import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Monogram on the site's warm-dark ground.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#12110f",
          borderRadius: 14,
          color: "#ebb65e",
          fontSize: 34,
          fontStyle: "italic",
          fontFamily: "serif",
          letterSpacing: -1,
        }}
      >
        mi
      </div>
    ),
    size,
  );
}
