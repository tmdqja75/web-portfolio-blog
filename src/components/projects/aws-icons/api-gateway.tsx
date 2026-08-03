type IconProps = { className?: string; x?: number; y?: number; width?: number; height?: number }

export function ApiGatewayIcon({ className, x, y, width = 24, height = 24 }: IconProps) {
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
      <path d="M8 3 L16 3 L21 12 L16 21 L8 21 L3 12 Z" strokeLinejoin="round" />
      <path d="M9 12 L15 12" strokeLinecap="round" />
      <path d="M12 9 L15 12 L12 15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
