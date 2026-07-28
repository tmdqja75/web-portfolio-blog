type IconProps = { className?: string; x?: number; y?: number; width?: number; height?: number }

export function S3Icon({ className, x, y, width = 24, height = 24 }: IconProps) {
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
      <path d="M6 4 L18 4 L18 20 L6 20 Z" strokeLinejoin="round" />
      <path d="M6 8 L4 9 L4 15 L6 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 8 L20 9 L20 15 L18 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4 L9 20 M15 4 L15 20" strokeDasharray="1 3" strokeLinecap="round" />
    </svg>
  )
}
