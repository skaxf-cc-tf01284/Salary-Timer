const PARTICLE_STYLES = [
  { x: '-128px', y: '-34px', c: '#34d399', d: 0 },
  { x: '-78px', y: '-102px', c: '#22d3ee', d: 42 },
  { x: '-30px', y: '-132px', c: '#06b6d4', d: 76 },
  { x: '26px', y: '-138px', c: '#f59e0b', d: 108 },
  { x: '84px', y: '-108px', c: '#ef4444', d: 142 },
  { x: '128px', y: '-36px', c: '#a78bfa', d: 178 },
  { x: '-138px', y: '18px', c: '#fb7185', d: 58 },
  { x: '-106px', y: '82px', c: '#14b8a6', d: 120 },
  { x: '-52px', y: '124px', c: '#0ea5e9', d: 168 },
  { x: '0px', y: '142px', c: '#60a5fa', d: 200 },
  { x: '58px', y: '122px', c: '#84cc16', d: 236 },
  { x: '108px', y: '84px', c: '#eab308', d: 274 },
  { x: '136px', y: '24px', c: '#f97316', d: 310 },
  { x: '-18px', y: '-112px', c: '#2dd4bf', d: 134 },
  { x: '42px', y: '-96px', c: '#f43f5e', d: 164 },
  { x: '-92px', y: '-12px', c: '#38bdf8', d: 96 },
  { x: '96px', y: '8px', c: '#facc15', d: 188 },
  { x: '-26px', y: '102px', c: '#a3e635', d: 248 },
]

const BURST_POINTS = [
  { left: '10%', top: '22%' },
  { left: '24%', top: '16%' },
  { left: '39%', top: '24%' },
  { left: '53%', top: '18%' },
  { left: '68%', top: '26%' },
  { left: '82%', top: '20%' },
  { left: '14%', top: '48%' },
  { left: '30%', top: '54%' },
  { left: '50%', top: '44%' },
  { left: '72%', top: '52%' },
  { left: '86%', top: '46%' },
  { left: '20%', top: '76%' },
  { left: '42%', top: '82%' },
  { left: '62%', top: '78%' },
  { left: '82%', top: '74%' },
]

export function Fireworks({ active, theme }) {
  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      {BURST_POINTS.map((point, burstIndex) => (
        <div
          key={`${point.left}-${point.top}`}
          className="fireworks-center"
          style={{
            left: point.left,
            top: point.top,
            animationDelay: `${burstIndex * 45}ms`,
          }}
        >
          {PARTICLE_STYLES.map((particle, particleIndex) => (
            <span
              key={`${point.left}-${point.top}-${particle.c}-${particleIndex}`}
              className="firework-particle"
              style={{
                '--fw-x': particle.x,
                '--fw-y': particle.y,
                '--fw-c': particle.c,
                '--fw-d': `${burstIndex * 45 + particle.d}ms`,
                opacity: theme === 'light' ? 0.95 : 1,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
