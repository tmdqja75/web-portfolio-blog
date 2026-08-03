type IconProps = { className?: string; x?: number; y?: number; width?: number; height?: number }

export function SqsIcon({ className, x, y, width = 24, height = 24 }: IconProps) {
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
      <rect x="2" y="8" width="8" height="8" rx="1.5" />
      <rect x="9" y="6" width="8" height="8" rx="1.5" />
      <rect x="14" y="9" width="8" height="8" rx="1.5" />
    </svg>
  )
}
