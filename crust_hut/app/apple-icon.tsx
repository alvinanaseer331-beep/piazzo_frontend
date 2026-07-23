import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#121212",
          borderRadius: 40,
        }}
      >
        <svg width="110" height="110" viewBox="0 0 48 48" fill="none">
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="12"
            stroke="rgba(226,43,32,0.4)"
            strokeWidth="1.5"
            fill="rgba(226,43,32,0.12)"
          />
          <path
            d="M14 34V22.5C14 16.15 19.15 11 25.5 11C31.85 11 37 16.15 37 22.5V34"
            stroke="#FFFFFF"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 34H39"
            stroke="#FFFFFF"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <path
            d="M24 30c0-3.2 2.1-5.1 2.1-7.4 0-.4-.1-.8-.2-1.2 1.6 1.1 2.7 2.9 2.7 5 0 2.3-1.8 4.1-2.6 5.1-.2.2-.5.1-.6-.1-.3-.7-.7-1.4-1.4-1.4Z"
            fill="#E22B20"
          />
          <path
            d="M22.2 28.8c.4-1.8 1.5-2.9 1.5-4.6 0-1.2-.5-2.2-1.1-3 .9 2.2.4 3.5.4 4.8 0 1.1-.3 1.9-.8 2.8Z"
            fill="#E22B20"
            opacity="0.7"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
