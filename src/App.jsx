import { useState, useMemo } from 'react'
import StickPicker from './components/StickPicker'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Separator } from './components/ui/separator'
import { handStrength, decide, pct, ACTION_COLORS } from './lib/duo'

const ACTIONS = ['Check', 'Call', 'Half Pot', 'Raise', 'All In', 'Fold']

const ACTION_CARD_STYLE = {
  'ALL IN': 'border-red-600/60 bg-red-950/30',
  'RAISE': 'border-orange-600/60 bg-orange-950/30',
  'HALF POT': 'border-yellow-600/60 bg-yellow-950/30',
  'CALL': 'border-green-700/60 bg-green-950/30',
  'CHECK': 'border-blue-700/60 bg-blue-950/30',
  'FOLD': 'border-zinc-700/60 bg-zinc-900/30',
  '—': 'border-[#3a2510] bg-transparent',
  'WIN': 'border-yellow-500/60 bg-yellow-950/30',
}

const LOG_ACTION_STYLE = {
  Fold: 'text-zinc-500', Check: 'text-blue-400', Call: 'text-green-400',
  'Half Pot': 'text-yellow-400', Raise: 'text-orange-400', 'All In': 'text-red-400',
}

export default function App() {
  const [my1, setMy1] = useState({ v: null, c: 'R' })
  const [my2, setMy2] = useState({ v: null, c: 'Y' })
  const [oppCount, setOppCount] = useState(1)
  const [opps, setOpps] = useState([
    { id: 'opp1', visible: { v: null, c: 'R' } },
    { id: 'opp2', visible: { v: null, c: 'R' } },
    { id: 'opp3', visible: { v: null, c: 'R' } },
  ])
  const [log, setLog] = useState([])
  const [actWho, setActWho] = useState('opp1')
  const [actWhat, setActWhat] = useState('Check')

  const activeOpps = opps.slice(0, oppCount)
  const foldedSet = useMemo(() => new Set(log.filter(e => e.action === 'Fold').map(e => e.who)), [log])
  const myHand = useMemo(() => handStrength(my1.v, my1.c, my2.v, my2.c), [my1, my2])
  const opponents = useMemo(() => activeOpps.map(o => ({
    id: o.id,
    visible: o.visible?.v || '',
    visColor: o.visible?.c || 'R',
  })), [activeOpps])
  const result = useMemo(() => decide(myHand, opponents, log), [myHand, opponents, log])

  const confPct = Math.round(result.conf * 100)
  const barColor = confPct >= 60
    ? 'from-green-700 to-green-500'
    : confPct >= 40 ? 'from-yellow-700 to-yellow-500'
    : 'from-red-800 to-red-600'

  function updateOppVisible(idx, v, c) {
    setOpps(prev => prev.map((o, i) => i === idx ? { ...o, visible: { v, c } } : o))
  }

  function addAction() {
    const label = actWho === 'me' ? 'Me' : actWho.replace('opp', 'Opp ')
    setLog(prev => [...prev, { who: actWho, action: actWhat, label }])
  }

  function newRound() {
    setMy1({ v: null, c: 'R' })
    setMy2({ v: null, c: 'Y' })
    setOpps(prev => prev.map(o => ({ ...o, visible: { v: null, c: 'R' } })))
    setLog([])
  }

  return (
    <div className="min-h-screen bg-[#0f0c07] text-[#e8d5a3] p-4 md:p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-[4px] text-[#c8a84b] drop-shadow-[0_0_20px_rgba(200,168,75,0.4)]">
          ⚔ DUO HELPER
        </h1>
        <p className="text-[#4a3018] text-sm italic mt-1">Crimson Desert · Red &amp; Gold stick advisor</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">

        {/* LEFT */}
        <div className="space-y-4">

          {/* My Hand */}
          <Card>
            <CardHeader><CardTitle>My Hand</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <StickPicker label="Stick 1" value={my1.v} color={my1.c} onChange={(v, c) => setMy1({ v, c })} />
              <StickPicker label="Stick 2" value={my2.v} color={my2.c} onChange={(v, c) => setMy2({ v, c })} />
              {myHand && (
                <div className="pt-1">
                  <Badge variant={myHand.tier}>{myHand.desc}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opponents */}
          <Card>
            <CardHeader><CardTitle>Opponents</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-[#8a6a35] uppercase tracking-wider mr-1">Count</span>
                {[1, 2, 3].map(n => (
                  <Button
                    key={n}
                    size="icon"
                    variant={oppCount === n ? 'active' : 'ghost'}
                    onClick={() => setOppCount(n)}
                  >
                    {n}
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                {activeOpps.map((opp, i) => {
                  const folded = foldedSet.has(opp.id)
                  return (
                    <div key={opp.id}
                      className={`p-3 bg-[#100d05] rounded-lg border border-[#2e200e] transition-opacity ${folded ? 'opacity-40 pointer-events-none' : ''}`}
                    >
                      <div className="text-xs text-[#c8a84b] uppercase tracking-wider mb-2 flex items-center gap-2">
                        Opponent {i + 1}: Visible Stick
                        {folded && <span className="text-zinc-500 normal-case tracking-normal font-normal">(folded)</span>}
                      </div>
                      <StickPicker
                        value={opp.visible?.v}
                        color={opp.visible?.c || 'R'}
                        onChange={(v, c) => updateOppVisible(i, v, c)}
                      />
                    </div>
                  )
                })}
              </div>

              <Separator className="my-4" />
              <Button variant="ghost" className="w-full" onClick={newRound}>
                ↺ New Round
              </Button>
            </CardContent>
          </Card>

          {/* Hand Reference */}
          <Card>
            <CardContent className="pt-5">
              <details>
                <summary className="cursor-pointer text-xs uppercase tracking-widest text-[#8a6a35] select-none">
                  ▸ Hand Rankings Reference
                </summary>
                <table className="w-full text-xs mt-3 border-collapse">
                  <tbody>
                    {[
                      ['Prime Pair ✦', 'Red 3 + Red 8'],
                      ['Executor', 'Red 4 + Red 7'],
                      ['Superior Pair', 'Red 1+8 > Red 1+3'],
                      ['Ten Pair ✦', '10 + 10 (any color)'],
                      ['Judge', '3+7 any (beats all pairs)'],
                      ['Pair 9→1', 'Higher pair wins'],
                      ['High Warden', 'Red 4+9 (between pair 9 & 8)'],
                      ['Warden', '4+9 any (rematch vs low)'],
                      ['Specials', '1+2 > 1+4 > 1+9 > 1+10 > 4+10 > 4+6'],
                      ['Perfect Nine', 'Sum = 9'],
                      ['Points 8→1', 'Sum % 10'],
                      ['Zero / Bust', 'Worst hand'],
                    ].map(([name, desc]) => (
                      <tr key={name} className="border-b border-[#1a1208]">
                        <td className="py-1.5 pr-3 text-[#c8a84b] whitespace-nowrap">{name}</td>
                        <td className="py-1.5 text-[#8a6a35]">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT */}
        <div className="space-y-4">

          {/* Recommendation */}
          <Card>
            <CardHeader><CardTitle>Recommendation</CardTitle></CardHeader>
            <CardContent>
              {/* Action display */}
              <div className={`rounded-lg border p-5 text-center mb-4 ${ACTION_CARD_STYLE[result.action] || ACTION_CARD_STYLE['—']}`}>
                <div className={`text-4xl font-bold tracking-widest mb-1 ${ACTION_COLORS[result.action] || 'text-zinc-500'}`}>
                  {result.action}
                </div>
                {myHand
                  ? <div className="text-xs text-[#8a6a35]">Your hand: {myHand.desc}</div>
                  : <div className="text-xs text-[#4a3018]">Select your sticks to begin</div>
                }
              </div>

              {/* Confidence bar */}
              <div className="mb-3">
                <div className="h-2.5 w-full bg-[#0c0a05] rounded-full overflow-hidden border border-[#2e200e]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                    style={{ width: `${confPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#6a5035] mt-1">
                  {result.prob ? (
                    <>
                      <span>Win {pct(result.prob.win)}</span>
                      <span>Tie {pct(result.prob.tie)}</span>
                      <span>Lose {pct(result.prob.lose)}</span>
                    </>
                  ) : (
                    <><span>Win —</span><span>Tie —</span><span>Lose —</span></>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="text-sm text-[#c8b07a] bg-[#100d05] border border-[#2e200e] rounded-lg p-3 leading-relaxed min-h-[60px]">
                {result.explanation}
              </div>
            </CardContent>
          </Card>

          {/* Action Log */}
          <Card>
            <CardHeader>
              <CardTitle>
                Action Log
                <span className="ml-2 normal-case tracking-normal text-[#4a3018] font-normal">
                  (refines advice via aggression inference)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add action */}
              <div className="flex gap-2 mb-3 flex-wrap">
                <select
                  value={actWho}
                  onChange={e => setActWho(e.target.value)}
                  className="bg-[#0c0a05] border border-[#3a2510] text-[#e8d5a3] rounded-md px-2 py-1.5 text-sm flex-1 min-w-[80px] focus:outline-none focus:ring-1 focus:ring-[#c8a84b]"
                >
                  {activeOpps.map((_, i) => (
                    <option key={i} value={`opp${i + 1}`}>Opp {i + 1}</option>
                  ))}
                  <option value="me">Me</option>
                </select>
                <select
                  value={actWhat}
                  onChange={e => setActWhat(e.target.value)}
                  className="bg-[#0c0a05] border border-[#3a2510] text-[#e8d5a3] rounded-md px-2 py-1.5 text-sm flex-1 min-w-[90px] focus:outline-none focus:ring-1 focus:ring-[#c8a84b]"
                >
                  {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <Button variant="log" size="sm" onClick={addAction}>+ Log</Button>
                {log.length > 0 && (
                  <Button variant="destructive" size="sm" onClick={() => setLog([])}>Clear</Button>
                )}
              </div>

              <Separator className="mb-3" />

              {/* Log entries */}
              <div className="max-h-48 overflow-y-auto bg-[#0c0a05] border border-[#2e200e] rounded-lg p-2 space-y-0.5">
                {log.length === 0 ? (
                  <div className="text-[#3a2810] italic text-sm p-1">No actions yet.</div>
                ) : (
                  log.map((entry, i) => (
                    <div key={i} className="flex gap-2 text-sm border-b border-[#1a1208] last:border-0 py-1.5">
                      <span className="text-[#c8a84b] font-semibold min-w-[56px]">{entry.label}</span>
                      <span className={LOG_ACTION_STYLE[entry.action] || ''}>{entry.action}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <footer className="text-center mt-10 pb-6 text-[#3a2810] text-sm">
        Developed with ❤️ by <a href="https://github.com/elpideus" target="_blank" rel="noopener noreferrer" className="text-[#6a5035] hover:text-[#c8a84b] transition-colors">elpideus</a>
      </footer>
    </div>
  )
}
