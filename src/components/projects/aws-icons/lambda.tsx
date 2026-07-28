type IconProps = { className?: string; x?: number; y?: number; width?: number; height?: number }

export function LambdaIcon({ className, x, y, width = 24, height = 24 }: IconProps) {
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
      <path d="M7 4 L11 12 L7 20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 12 L15 20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 4 L17 4" strokeLinecap="round" />
    </svg>
  )
}
