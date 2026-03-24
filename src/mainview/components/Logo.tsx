import * as React from "react";

const LogoSvg: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="20 10.25 80 103.75"
    {...props}
  >
    <defs>
      <mask id="m">
        <rect width="80" height="56" x="20" y="58" fill="#fff" rx="12" />
        <text
          x="60"
          y="80"
          fontFamily="'SF Mono','Menlo','Monaco','Courier New',monospace"
          fontSize="17"
          fontWeight="700"
          textAnchor="middle"
        >
          $ENV
        </text>
        <path stroke="#000" strokeWidth="1.2" d="M32 88h56" />
        <text
          x="60"
          y="103"
          fontFamily="'SF Mono','Menlo','Monaco','Courier New',monospace"
          fontSize="11"
          letterSpacing="3"
          textAnchor="middle"
        >
          ●●●
        </text>
      </mask>
    </defs>
    <path
      fill="none"
      stroke="#FFF"
      strokeLinecap="round"
      strokeWidth="7.5"
      d="M34 62V40a26 26 0 0 1 52 0v22"
    />
    <rect
      width="80"
      height="56"
      x="20"
      y="58"
      fill="#FFF"
      mask="url(#m)"
      rx="12"
    />
  </svg>
);

type LogoProps = {
  size?: "sm" | "lg";
};

export function Logo({ size = "lg" }: LogoProps) {
  const cls =
    size === "sm"
      ? "w-7 h-7 rounded-lg"
      : "w-14 h-14 rounded-2xl";

  return (
    <div
      className={`${cls} bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center`}
    >
      <LogoSvg
        className={size === "sm" ? "w-4 h-4" : "w-8 h-8"}
      />
    </div>
  );
}
