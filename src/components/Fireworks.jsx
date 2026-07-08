const PARTICLE_STYLES = [
  { x: '-30%', y: '-8%', c: '#34d399', d: '0ms' },
  { x: '-12%', y: '-24%', c: '#22d3ee', d: '70ms' },
  { x: '5%', y: '-30%', c: '#f59e0b', d: '120ms' },
  { x: '24%', y: '-24%', c: '#ef4444', d: '180ms' },
  { x: '34%', y: '-8%', c: '#a78bfa', d: '220ms' },
  { x: '-34%', y: '10%', c: '#fb7185', d: '90ms' },
  { x: '-20%', y: '24%', c: '#14b8a6', d: '150ms' },
  { x: '0%', y: '30%', c: '#60a5fa', d: '210ms' },
  { x: '20%', y: '24%', c: '#eab308', d: '260ms' },
  { x: '34%', y: '10%', c: '#f97316', d: '300ms' },
]

export function Fireworks({ active, theme }) {
  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <div className="fireworks-center">
        {PARTICLE_STYLES.map((particle, index) => (
          <span
            key={`${particle.c}-${index}`}
            className="firework-particle"
            style={{
              '--fw-x': particle.x,
              '--fw-y': particle.y,
              '--fw-c': particle.c,
              '--fw-d': particle.d,
              opacity: theme === 'light' ? 0.95 : 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
