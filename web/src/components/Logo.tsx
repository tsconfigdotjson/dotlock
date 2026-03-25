export function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="20 10.25 80 103.75"
      className={className}
    >
      <defs>
        <mask id="logo-mask">
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
            &#x25CF;&#x25CF;&#x25CF;
          </text>
        </mask>
      </defs>
      <path
        fill="none"
        stroke="#141414"
        strokeLinecap="round"
        strokeWidth="7.5"
        d="M34 62V40a26 26 0 0 1 52 0v22"
      />
      <rect
        width="80"
        height="56"
        x="20"
        y="58"
        fill="#141414"
        mask="url(#logo-mask)"
        rx="12"
      />
    </svg>
  );
}
