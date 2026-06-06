interface Props {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({ value, max, size = 40, strokeWidth = 3 }: Props) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const pct = max > 0 ? value / max : 0
  const offset = circ * (1 - pct)

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="stroke-primary transition-all duration-500"
      />
    </svg>
  )
}
