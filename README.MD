# Easy Duo - Crimson Desert

A real-time win probability calculator and betting advisor for the **DUO** mini-game in Crimson Desert.

**Live app:** [elpideus.github.io/EasyDuo](https://elpideus.github.io/EasyDuo/)

---

## What is DUO?

DUO is a Seotda-style card game played inside Crimson Desert. Each player receives two sticks numbered 1 through 10, each either Red or Gold colored. You can see both of your own sticks and one stick from each opponent. The goal is to hold the best hand and bet accordingly.

## Features

- **Clickable stick picker** -- select your two sticks and each opponent's visible stick by number and color
- **Exact win probability** -- enumerates all 20 possible hidden opponent stick combinations (10 values x 2 colors) to compute precise win/tie/lose percentages
- **Smart betting recommendation** -- recommends Check, Call, Half Pot, Raise, All In, or Fold with a color-coded confidence bar
- **Aggression inference** -- log opponent actions (Check, Call, Half Pot, Raise, All In, Fold) to adjust advice based on how aggressively they are playing
- **Multi-round support** -- re-analyze after each action log update; reset with New Round
- **Hand reference** -- collapsible ranking table always available in-app
- **9-language support** -- 🇺🇸 English, 🇰🇷 Korean, 🇧🇷 Portuguese, 🇪🇸 Spanish, 🇮🇹 Italian, 🇫🇷 French, 🇩🇪 German, 🇯🇵 Japanese, 🇨🇳 Chinese
- **URL language routing** -- link directly to a language: `/EasyDuo/it` → Italian, `/EasyDuo/ko` → Korean, etc. Default (no path) = English

## Hand Rankings (Best to Worst)

| Rank | Hand | Condition |
|------|------|-----------|
| 1 | Prime Pair | Red 3 + Red 8 |
| 2 | Executor | Red 4 + Red 7 |
| 3 | Superior Pair | Red 1+8 then Red 1+3 |
| 4 | Ten Pair | Any two 10s |
| 5 | Judge | 3+7 any color (beats all pairs 1-9) |
| 6 | Pairs 9 to 1 | Higher pair wins; High Warden slots between 9-pair and 8-pair |
| 7 | High Warden | Red 4+9 |
| 8 | Warden | 4+9 (non-both-red, forces rematch vs low hands) |
| 9 | Named specials | 1+2 > 1+4 > 1+9 > 1+10 > 4+10 > 4+6 |
| 10 | Perfect Nine | Sum of sticks ends in 9 |
| 11 | Points 8 to 1 | Last digit of sum (higher is better) |
| 12 | Zero / Bust | Sum ends in 0 (worst hand) |

## Tech Stack

- React 18 + Vite 6
- Tailwind CSS 3
- shadcn/ui components (Card, Button, Badge, Separator) built on Radix UI
- `class-variance-authority` + `tailwind-merge` for variant styling

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Building

```bash
npm run build
```

Output goes to `dist/`.

---

Developed with ❤️ by [elpideus](https://github.com/elpideus)
