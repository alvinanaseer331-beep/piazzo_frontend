import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "#121212",
          borderRadius: 8,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
          <path
            d="M14 34V22.5C14 16.15 19.15 11 25.5 11C31.85 11 37 16.15 37 22.5V34"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 34H39"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M24 30c0-3.2 2.1-5.1 2.1-7.4 0-.4-.1-.8-.2-1.2 1.6 1.1 2.7 2.9 2.7 5 0 2.3-1.8 4.1-2.6 5.1-.2.2-.5.1-.6-.1-.3-.7-.7-1.4-1.4-1.4Z"
            fill="#E22B20"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
