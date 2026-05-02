# MCU Doomsday Watchlist

Personal watch tracker for the MCU road to **Avengers: Doomsday** (December 18, 2026).

**🌐 [Try the Live Reader](https://raymonepping.github.io/MCU_Doomsday_Watchlist/)**

<img width="2710" height="1720" alt="image" src="https://github.com/user-attachments/assets/49cf1ee5-8782-4ffb-b233-ab16419ae47d" />

## Project Structure

This repository contains three main components:

### 📄 Documentation (`./docs`)

Comprehensive watchlist guides in multiple languages:

- **`mcu-doomsday-watchlist.md`** — Dutch version (primary source)
- **`mcu-doomsday-watchlist_us.md`** — US English version
- **`mcu-doomsday-watchlist_nl.md`** — Dutch version (reader format)

Each guide includes:
- 29 essential titles organized in 4 thematic blocks (~93 hours)
- 3 optional Fox X-Men bonus titles (~6 hours)
- Detailed explanations of MCU lore and concepts
- Timeline positioning and narrative connections

### 🐍 CLI Tracker (`./scripts`)

**`MCU_tracker`** — Python-based command-line tool for tracking watch progress.

#### Commands

Show current progress:
```bash
scripts/MCU_tracker status
```

List the main watchlist:
```bash
scripts/MCU_tracker list
```

List with optional Fox X-Men bonus titles:
```bash
scripts/MCU_tracker list --bonus
```

Search the timeline:
```bash
scripts/MCU_tracker search thor
scripts/MCU_tracker search "black widow"
```

Mark entries as watched:
```bash
scripts/MCU_tracker watched 1
scripts/MCU_tracker watched 1,2
scripts/MCU_tracker watched "Doctor Strange"
scripts/MCU_tracker watched B1
```

Mark entries as unwatched:
```bash
scripts/MCU_tracker unwatched 1
scripts/MCU_tracker unwatched 1,2
```

#### Data Storage

Progress is stored locally in `data/mcu-watch-progress.json`. This file is ignored by Git so every clone can maintain its own personal watched state.

### 🌐 Reader App (`./reader`)

Interactive browser-based reader with comprehensive progress tracking, multiple view modes, and advanced filtering.

#### Core Features

- ✅ **Visual Progress Tracking** — Mark entries as seen with one click
- 🔍 **Real-time Search** — Filter titles instantly across all fields
- 🌍 **Bilingual Support** — Switch between English and Dutch
- 🎬 **Marvel Integration** — Direct links to official Marvel.com pages
- 🖼️ **Local Image Caching** — 33 cached Marvel poster images
- 💾 **Browser Storage** — Progress persists locally via LocalStorage
- 📱 **Fully Mobile Optimized** — Touch-friendly interface with 44px+ touch targets, scroll-to-top button, haptic feedback, and responsive layouts for all screen sizes

#### Phase 1: Essential Tools

- 📥 **Export/Import Progress** — Backup and restore your watch state as JSON
- ⏱️ **Watch Time Calculator** — See remaining hours to complete the watchlist
- 🌓 **Dark/Light Mode** — Toggle between themes with persistent preference
- ⏳ **Release Date Countdown** — Days remaining until December 18, 2026

#### Phase 2: Polish & Delight

- 📊 **Watch Statistics Dashboard** — Track films watched, series watched, total hours, and completion percentage
- ✨ **Smooth Animations** — Fade-in effects, hover transforms, and progress bar transitions
- 🎉 **Confetti Celebration** — 150-particle physics-based animation when you complete the main watchlist

#### Phase 3: Advanced Features

- 📋 **Timeline View: Blocks** — Switch between detailed card view and high-level block overview
- 🎭 **Character Tracker** — Filter by 13 main characters (Thor, Loki, Spider-Man, etc.)
- 🔎 **Multi-field Search** — Character filter searches across title, cast, descriptions, and context

#### Phase 4: Narrative Structure

- 🎬 **Block/Phase Filtering** — Filter timeline by narrative arcs:
  - **Block 1: The Legacy** (titles 1-8) — Red theme
  - **Block 2: The New Guard** (titles 9-14) — Gold theme
  - **Block 3: Multiverse Fracture** (titles 15-22) — Blue theme
  - **Block 4: The Finale** (titles 23-30) — Green theme
- 🎨 **Color-coded Blocks** — Each block has its own theme color and progress tracking

#### Phase 5: Mobile Optimization

- 📱 **Touch-Friendly Interface** — All interactive elements meet 44px+ minimum touch target size
- ⬆️ **Scroll-to-Top Button** — Appears after scrolling 500px, smooth scroll animation
- 🔍 **Mobile Search Clear** — Quick-clear button inside search input
- 📳 **Haptic Feedback** — Subtle vibration on button taps (if supported)
- 🎯 **iOS Optimizations** — 16px input font prevents auto-zoom, prevented double-tap zoom
- 📐 **Responsive Layouts** — Optimized for all screen sizes (380px to 1960px+)
- 🎨 **Adaptive Grids** — Filters adjust from 4-column → 2-column → 1-column based on viewport
- 📊 **Mobile Statistics** — Readable stats grid that adapts to small screens

See [MOBILE_OPTIMIZATION.md](./MOBILE_OPTIMIZATION.md) for complete mobile optimization guide.

#### Phase 6: Lore & Concepts Filter

- 🌌 **Multiversal Mechanics** — Incursions, Anchor Beings, Sacred Timeline, Nexus Events, The Void
- ⚡ **Sources of Power** — Vibranium, Infinity Stones, Chaos Magic, Pym Particles
- 🌍 **Geopolitics & Organizations** — TVA, Sokovia Accords, Latveria, Quantum Realm
- 🦸 **Legacy Threads** — Stark's Legacy, The New Guard
- 🎨 **Category-Specific Colors** — Purple (Multiversal), Yellow (Power), Green (Geopolitics), Red (Legacy)
- 🔍 **Smart Filtering** — Click any concept to see only titles featuring that lore element
- 📱 **Mobile Optimized** — 40px touch targets, responsive layout for all screen sizes
- 🎯 **15 Key Concepts** — Curated list of essential MCU mechanics leading to Doomsday

Understand the "How" and "Where" of Doomsday by exploring the deeper MCU lore and mechanics.

#### Phase 7: Visual Enhancements & Polish

- 🎨 **Animated Progress Ring** — Smooth SVG animation with gradient colors and percentage display
- 🎴 **3D Card Hover Effects** — Cards lift and tilt on hover with dynamic shadows
- 🏷️ **Concept Badges** — Visual indicators showing number of MCU concepts per title
- 🎨 **Block Color Coding** — Timeline cards color-coded by narrative block (red/gold/blue/green)
- 🌊 **Parallax Scrolling** — Header background moves at different speed for depth effect
- 🔄 **Flip Card Animation** — Cards flip when marking as watched/unwatched
- ⭐ **Pulse Effect** — "Next to watch" card pulses to draw attention
- 🎬 **Character Timeline Graph** — Visual timeline showing character appearances across titles
- 🗺️ **Concept Heatmap** — Interactive grid showing concept distribution across timeline
- 🏆 **Progress Milestone Badges** — Achievement badges at 25%, 50%, 75%, and 100% completion
- 🌈 **Block Gradient Backgrounds** — Subtle gradient overlays matching block themes
- ⏰ **Dramatic Countdown** — Animated countdown with flip-card style digits
- 📱 **Pull-to-Refresh** — Mobile gesture to refresh the timeline
- 📋 **Bottom Sheet Filter Panel** — Slide-up filter panel for mobile devices
- ➕ **Floating Action Button (FAB)** — Quick access to filters on mobile
- 📜 **Custom Scrollbar** — Styled scrollbar matching the MCU theme
- ✨ **Glassmorphism Effects** — Frosted glass effects on overlays and modals
- 🌈 **Gradient Text Effects** — Eye-catching gradient text for headers and titles
- 🔔 **Toast Notifications** — Elegant notification system for user actions
- 🎭 **Easter Eggs & Trivia** — Post-credits scenes, fun facts, Easter eggs, Stan Lee cameos, and MCU connections for each title
- 🌙 **Smooth Dark Mode Transitions** — Seamless color transitions when switching themes

All enhancements are mobile-optimized and work seamlessly with existing features.

#### Phase 8: Timeline UI Improvements (JSX-Inspired)

- 🎯 **Top Filters Section** — Sticky filter bar with glassmorphism and backdrop blur
- 🔍 **Enhanced Search Bar** — Prominent search input with focus glow and bidirectional sync
- 🎬 **Phase Filter Chips** — Filter by MCU phases (Phase 1-6) with active state indicators
- 📺 **Type Filter Chips** — Toggle between Movies (🎬) and TV Series (📺) with icon prefixes
- 📊 **Filter Results Counter** — Live count showing "X of Y titles" as filters change
- ⟡ **Era Dividers** — Timeline section dividers with year ranges (e.g., "⟡ 2018-2019 ⟡")
- 🎨 **Modern UI Design** — Inspired by React timeline designs while maintaining vanilla JS
- 📱 **Fully Responsive** — All new filters adapt seamlessly to mobile and desktop

Phase 8 brings a modern, streamlined filtering experience inspired by contemporary timeline UIs while maintaining GitHub Pages compatibility and zero framework dependencies.

#### Running the Reader

Start the development server:
```bash
cd reader
npm start
```

Open `http://localhost:4173` in your browser.

#### Data Management

**Regenerate watchlist data** after editing markdown guides:

```bash
cd reader
npm run build:data
```

This creates:
- `reader/data/watchlist.en.json` (from `docs/mcu-doomsday-watchlist_us.md`)
- `reader/data/watchlist.nl.json` (from `docs/mcu-doomsday-watchlist_nl.md`)

**Cache Marvel artwork** for local poster thumbnails:

```bash
cd reader
npm run cache:images
```

This fetches Marvel.com page metadata, downloads poster images to `reader/assets/posters/`, and rebuilds the data files with local image references.

## Technology Stack

- **Python 3** — CLI tracker script with argparse
- **Node.js** — Reader app server and build tools
- **JavaScript (ES modules)** — Frontend logic
- **HTML/CSS** — Reader interface
- **Markdown** — Source documentation format
- **JSON** — Data storage and interchange

## File Organization

```
MCU/
├── docs/                          # Watchlist documentation
│   ├── mcu-doomsday-watchlist.md
│   ├── mcu-doomsday-watchlist_us.md
│   └── mcu-doomsday-watchlist_nl.md
├── scripts/                       # CLI tools
│   └── MCU_tracker               # Python tracker script
├── reader/                        # Web reader app
│   ├── app.js                    # Frontend application logic
│   ├── server.mjs                # Node.js development server
│   ├── build-data.mjs            # Markdown to JSON converter
│   ├── cache-marvel-images.mjs   # Marvel artwork downloader
│   ├── index.html                # Main HTML template
│   ├── styles.css                # Application styles
│   ├── package.json              # Node.js dependencies & scripts
│   ├── assets/
│   │   ├── posters/              # Cached Marvel poster images
│   │   └── ...                   # Header images and logos
│   └── data/
│       ├── watchlist.en.json     # English watchlist data
│       ├── watchlist.nl.json     # Dutch watchlist data
│       └── marvel-images.json    # Image URL mappings
├── data/                          # Progress tracking
│   └── mcu-watch-progress.json   # Personal watch state (gitignored)
├── .gitignore
├── LICENSE
└── README.md
```

## The Watchlist

The complete watchlist covers **29 essential titles** organized into 4 thematic blocks:

1. **De Erfenis** (The Legacy) — 8 titles, ~19 hours
2. **De Nieuwe Garde** (The New Guard) — 6 titles, ~22 hours  
3. **De Multiversele Breuk** (The Multiverse Fracture) — 8 titles, ~26 hours
4. **De Finale** (The Finale) — 7 titles, ~26 hours

Plus 3 optional Fox X-Men bonus titles (~6 hours) for additional context on returning characters.

### Three Core Narrative Threads

1. **The Face** — Robert Downey Jr. returns as Victor von Doom
2. **The Mechanics** — How timelines collide and universes die
3. **The Teams** — Avengers, Thunderbolts, Fantastic Four, Young Avengers

## Deployment

The reader app can be hosted online for free using GitHub Pages. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

1. Enable GitHub Pages in repository settings (Settings → Pages → Source: GitHub Actions)
2. Push the included workflow file to trigger automatic deployment
3. Your site will be live at: `https://raymonepping.github.io/MCU_Doomsday_Watchlist/`

The app is fully static (no server required) and includes:
- All 33 cached poster images
- Bilingual JSON data
- Complete reader functionality
- Personal progress stored in browser LocalStorage

## License

See [LICENSE](LICENSE) for details.

---

*Road to Doomsday — Complete MCU viewing guide for Avengers: Doomsday*
