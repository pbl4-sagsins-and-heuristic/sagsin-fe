interface HoverInfoProps {
  x: number
  y: number
  name: string
  isVisible: boolean
}

export function HoverInfo({ x, y, name, isVisible }: HoverInfoProps) {
  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-md border">
        <p className="text-sm font-medium">{name}</p>
      </div>
    </div>
  )
}
