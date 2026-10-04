# ⚡ CodeDuo - Gamified Coding Adventure
> *Duolingo meets Cyberpunk Retro-Arcade for Developers & Students*

CodeDuo is a gamified web application inspired by Duolingo, themed with an IT/Cyberpunk retro-arcade aesthetic. It features an interactive progression tree, live sound synthesis via Web Audio API, dynamic robot mascot **"Pixel-Bit"**, multi-type coding challenges, boss battles, practice arena, shop, and leaderboard.

---

## 🕹️ Quick Start (Play Immediately!)

1. **Double-click `index.html`** or open it directly in any modern browser (Google Chrome, Microsoft Edge, Brave, Firefox, Safari).
2. **No build tools, Node.js, or server required!** The application is completely self-contained with offline-ready Web Audio synthesis and CDN assets.

---

## ✨ Features Breakdown

### 1. Theme & Retro-Arcade Cyberpunk Styling
- **Palette**: Dark cyberpunk canvas (`#090d16` / `#0f172a`) with vibrant neon accents:
  - Neon Green (`#10b981`) for compiled code & successes
  - Cyber Purple (`#8b5cf6`) for energy, stages & XP
  - Neon Cyan (`#06b6d4`) for data terminals & HUD
  - Neon Pink (`#ec4899`) for boss battles & alerts
  - Arcade Gold (`#f59e0b`) for Byte Coins & streak flames
- **Fonts**:
  - `Press Start 2P`: 8-bit retro arcade headings and level tags
  - `Fira Code`: Syntax-highlighted code blocks, line numbers, and terminal prompts
  - `Chakra Petch` & `Rajdhani`: Sci-fi UI interface and buttons
- **CRT Scanlines Mode**: Toggleable retro CRT monitor overlay button (`📺 CRT`) in the top navigation.
- **8-Bit Web Audio Synthesizer**: Native in-browser Web Audio API sound effects for clicks, node selects, victory fanfares, error buzzes, boss laser blasts, coin pick-ups, and level-ups.

### 2. Header HUD (Head-Up Display)
- **Brand Logo**: `CodeDuo_` with blinking retro terminal cursor.
- **Language Track Switcher**: Toggle dynamically between **JavaScript ⚡** and **Python 🐍**.
- **Hacker Level & XP Progress**: Live animated XP progress bar (`Level 1 -> Level 2+`).
- **Streak Days**: Animated flame indicator (`🔥 5 Days`).
- **Byte Coins**: Currency counter (`🪙 240`) earned from clearing nodes and completing quests.
- **Battery / Health Status**: `⚡ 5/5` battery cells that deplete upon errors and can be restored in the Shop.
- **Audio & CRT Controls**: Quick toggle buttons with active state indicators.

### 3. Main Navigation & Sections
- **Learn Map (Home View)**:
  - Sinuous, Duolingo-style node progression path with dynamic circuit board connectors.
  - 6 Progressive stages:
    - **Stage 1**: `Hello World` (Terminal & Syntax Intro)
    - **Stage 2**: `Variables & Types` (Data Containers & Memory)
    - **Stage 3**: `IF/ELSE Logic` (Conditionals & Gateways)
    - **Stage 4**: `Loop Boss Battle` (CRITICAL THREAT: Defeat the Glitch King with 100 HP!)
    - **Stage 5**: `Functions & Callbacks` (Subroutine Protocol)
    - **Stage 6**: `Cyber Arrays` (Memory Matrix Indexing)
  - Locked vs Unlocked vs Completed node visual states with star ratings (⭐ ⭐ ⭐).
  - Stage preview modal displaying lore, XP reward, and coin rewards.
- **Practice Arena**:
  - **Bug Hunter Blitz**: Rapid-fire 60s bug identification run.
  - **Daily Code Kata**: Curated algorithmic puzzle for streak shields.
  - **Terminal Speed Run**: Syntax argument typing drill.
- **Leaderboard**:
  - Weekly Cyber League ranking table (Diamond Tier).
  - Dynamic user rank placement with top 3 podium medals (Gold, Silver, Bronze).
- **Cyber Shop**:
  - Spend earned Byte Coins on:
    - `Energy Overclock Cell` (Refill battery cells back to 5/5)
    - `Streak Firewall (Freeze)` (Protects streak from lapses)
    - `Quantum Overdrive (2x XP)` (Double XP rewards for 3 lessons)
    - `Matrix Gold Pixel-Bit Skin` (Exclusive custom robot chassis)
- **Hacker Profile**:
  - Dev statistics: Challenges solved, highest streak, perfect scores, total coins.
  - **30-Day Activity Heatmap**: GitHub-style green contribution grid.
  - **Achievement Badges Showcase**: "First Compile", "Bug Slayer", "Streak on Fire", "Boss Slayer".
  - One-click LocalStorage reset for fresh playthroughs.

### 4. Interactive Lesson Screen (The Core Game)
- **Cockpit Bar**: Dynamic progress bar, energy battery monitor, and close confirmation.
- **Glitch King Boss Battle HUD**: 100 HP boss health bar, laser impact animations, and damage counters.
- **"Pixel-Bit" Dynamic SVG Mascot**:
  - Expressive robot avatar with animated visor, floating thruster, and glowing antenna.
  - Mood engine: Idle floating, cheerful dance with neon particles on correct answers, glitch vibration on syntax errors, and battle armor mode during boss fights.
  - Speech bubble offering contextual hints for each challenge.
- **Question Type 1 (Code Block Drag & Drop / Reordering)**:
  - Click or tap to move code snippets from the available pool into the numbered execution buffer (`01`, `02`, `03`...). Tap to return blocks.
- **Question Type 2 (Multiple Choice Bug Fix)**:
  - IDE terminal code window with line numbers and highlighted bug lines.
  - Radio options with thorough explanations of what caused the bug.
- **Question Type 3 (Terminal Fill-in-the-Blank)**:
  - Retro developer terminal prompt (`root@codeduo-cli:~$ ...`).
  - Inline input box with syntax hints and instant Enter key submission.
- **Bottom Action Drawer**:
  - High-impact green/red feedback toast with Pixel-Bit feedback and explanations.
  - Confetti victory explosion upon completing stages!

---

## 📁 Project Structure

```text
App somkid/
├── index.html          # Main application page & component layouts
├── README.md           # Documentation & feature manual
├── css/
│   └── style.css       # Retro-arcade cyberpunk styling, CRT scanlines, neon animations
└── js/
    ├── audio.js        # Web Audio API 8-bit chiptune sound synthesizer
    ├── state.js        # Central state store with LocalStorage persistence
    ├── pixelbit.js     # "Pixel-Bit" dynamic SVG robot mascot controller
    ├── questions.js    # Multi-language question database (JS & Python)
    └── app.js          # Core app controller, navigation, and lesson engine
```

---

## 🕹️ Controls & Shortcuts
- **Click / Tap**: Interact with nodes, chips, options, and navigation tabs.
- **Enter ↵**: Submit answer / Continue to next question.
- **Audio Button 🔊**: Mute or unmute synthesized sound effects.
- **CRT Button 📺**: Toggle retro scanline shader overlay.
