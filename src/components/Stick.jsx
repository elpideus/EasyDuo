// SVG stick art matching Crimson Desert DUO visual style
// Tally-mark planks, red or yellow/gold variants

const TALLY_PATTERNS = {
  1:  [[15, 12, 15, 48]],
  2:  [[11, 12, 11, 48], [21, 12, 21, 48]],
  3:  [[9, 12, 9, 48], [18, 12, 18, 48], [27, 12, 27, 48]],
  4:  [[7, 12, 7, 48], [14, 12, 14, 48], [21, 12, 21, 48], [28, 12, 28, 48]],
  5:  [[6, 12, 6, 48], [12, 12, 12, 48], [18, 12, 18, 48], [24, 12, 24, 48], [7, 30, 29, 30]],
  6:  [[6, 12, 6, 48], [12, 12, 12, 48], [18, 12, 18, 48], [24, 12, 24, 48], [7, 28, 29, 28], [7, 34, 29, 34]],
  7:  [[5,12,5,48],[10,12,10,48],[15,12,15,48],[20,12,20,48],[25,12,25,48],[6,28,30,28],[6,34,30,34]],
  8:  [[4,12,4,40],[9,12,9,40],[14,12,14,40],[19,12,19,40],[4,44,4,52],[9,44,9,52],[14,44,14,52],[19,44,19,52]],
  9:  [[4,10,4,46],[9,10,9,46],[14,10,14,46],[19,10,19,46],[4,10,24,46],[5,30,29,30],[5,36,29,36],[5,42,29,42]],
  10: [[4,10,4,50],[9,10,9,50],[14,10,14,50],[4,10,24,50],[5,28,27,28],[5,34,27,34],[5,40,27,40],[5,46,27,46]],
}

export default function Stick({ value, color, selected, onClick, size = 'md', disabled = false }) {
  const isRed = color === 'R'
  const w = size === 'sm' ? 32 : size === 'lg' ? 52 : 40
  const h = size === 'sm' ? 68 : size === 'lg' ? 108 : 84

  const woodBg = isRed ? ['#3a0a08', '#5a1210'] : ['#2a1e06', '#3d2d08']
  const grainColor = isRed ? '#6a1a14' : '#5a3d10'
  const strokeColor = isRed ? '#ff6040' : '#e8b830'
  const borderColor = isRed ? '#8a2018' : '#7a5a18'
  const glowColor = isRed ? '#ff400080' : '#ffcc0060'
  const selBorder = isRed ? '#ff5030' : '#ffd040'

  const lines = TALLY_PATTERNS[value] || []

  // Scale lines to actual viewBox 36x64
  const vw = 36, vh = 64
  const scaleX = vw / 36
  const scaleY = vh / 64

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative transition-all duration-150 rounded focus:outline-none
        ${selected ? 'scale-110 z-10' : 'hover:scale-105'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{ width: w, height: h }}
      title={`${value} ${isRed ? 'Red' : 'Yellow'}`}
    >
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        width={w}
        height={h}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`wood-${value}-${color}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={woodBg[0]} />
            <stop offset="50%" stopColor={woodBg[1]} />
            <stop offset="100%" stopColor={woodBg[0]} />
          </linearGradient>
          {selected && (
            <filter id={`glow-${value}-${color}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Wood plank body */}
        <rect
          x="1" y="1" width={vw - 2} height={vh - 2}
          rx="3" ry="3"
          fill={`url(#wood-${value}-${color})`}
          stroke={selected ? selBorder : borderColor}
          strokeWidth={selected ? 2 : 1}
        />

        {/* Wood grain lines */}
        {[12, 20, 28, 36, 44, 52].map(y => (
          <line key={y} x1="3" y1={y} x2={vw - 3} y2={y}
            stroke={grainColor} strokeWidth="0.4" opacity="0.5" />
        ))}

        {/* Tally marks */}
        {lines.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1 * scaleX} y1={y1 * scaleY}
            x2={x2 * scaleX} y2={y2 * scaleY}
            stroke={strokeColor}
            strokeWidth={size === 'sm' ? 1.2 : 1.6}
            strokeLinecap="round"
            filter={selected ? `url(#glow-${value}-${color})` : undefined}
          />
        ))}

        {/* Top/bottom end caps */}
        <rect x="1" y="1" width={vw - 2} height="4" rx="2" fill={borderColor} opacity="0.6" />
        <rect x="1" y={vh - 5} width={vw - 2} height="4" rx="2" fill={borderColor} opacity="0.6" />

        {/* Selected glow border */}
        {selected && (
          <rect
            x="0.5" y="0.5" width={vw - 1} height={vh - 1}
            rx="3.5" fill="none"
            stroke={selBorder}
            strokeWidth="2"
            opacity="0.8"
          />
        )}
      </svg>
    </button>
  )
}
