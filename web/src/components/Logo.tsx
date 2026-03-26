export function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className={className}
    >
      <defs>
        <mask id="m">
          <rect width="80" height="56" x="20" y="58" fill="#fff" rx="12" />
          <text
            x="60"
            y="98"
            fontFamily="'SF Mono','Menlo','Monaco','Courier New',monospace"
            fontSize="33"
            fontWeight="700"
            textAnchor="middle"
          >
            ENV
          </text>
        </mask>
      </defs>
      <path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeWidth="7.5"
        d="M34 62V40a26 26 0 0 1 52 0v22"
      />
      <rect width="80" height="56" x="20" y="58" mask="url(#m)" rx="12" />
    </svg>
  );
}
