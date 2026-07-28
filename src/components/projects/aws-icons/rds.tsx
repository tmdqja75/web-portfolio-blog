type IconProps = { className?: string; x?: number; y?: number; width?: number; height?: number }

export function RdsIcon({ className, x, y, width = 24, height = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      x={x}
      y={y}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6 L5 18 C5 19.66 8.13 21 12 21 C15.87 21 19 19.66 19 18 L19 6" strokeLinecap="round" />
      <path d="M5 12 C5 13.66 8.13 15 12 15 C15.87 15 19 13.66 19 12" strokeLinecap="round" />
    </svg>
  )
}
