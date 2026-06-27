
export default function StickPicker({ value, color, onChange, label }) {
  return (
    <div className="space-y-2">
      {label && <div className="text-xs uppercase tracking-widest text-[#8a6a35] mb-1">{label}</div>}
      {['R', 'Y'].map(c => (
        <div key={c} className="flex items-center gap-1.5">
          <span className={`text-[10px] uppercase tracking-wider w-9 shrink-0 font-bold ${c === 'R' ? 'text-red-400' : 'text-yellow-400'}`}>
            {c === 'R' ? 'Red' : 'Gold'}
          </span>
          <div className="flex gap-1 flex-wrap">
            {[1,2,3,4,5,6,7,8,9,10].map(v => {
              const selected = value === v && color === c
              return (
                <button
                  key={v}
                  onClick={() => onChange(v, c)}
                  className={`
                    w-8 h-8 rounded text-sm font-bold transition-all duration-100
                    ${selected
                      ? c === 'R'
                        ? 'bg-red-700 border-2 border-red-400 text-white scale-110'
                        : 'bg-yellow-700 border-2 border-yellow-400 text-white scale-110'
                      : c === 'R'
                        ? 'bg-red-950/60 border border-red-900 text-red-300 hover:bg-red-900/60 hover:border-red-600'
                        : 'bg-yellow-950/60 border border-yellow-900 text-yellow-300 hover:bg-yellow-900/60 hover:border-yellow-600'
                    }
                  `}
                >
                  {v}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
