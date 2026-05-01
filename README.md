# MCU Doomsday Watchlist

Personal watch tracker for the MCU road to **Avengers: Doomsday** (December 18, 2026).

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

Interactive browser-based reader with search, progress tracking, and language switching.

#### Features

- ✅ Visual progress tracking
- 🔍 Real-time search functionality
- 🌍 English/Dutch language switching
- 💾 Local storage for seen status (browser-specific)
- 📱 Responsive design

#### Running the Reader

Start the development server:
```bash
cd reader
npm start
```

Open `http://localhost:4173` in your browser.

#### Updating Data

After editing the markdown guides in `./docs`, regenerate the JSON data files:

```bash
cd reader
npm run build:data
```

This creates:
- `reader/data/watchlist.en.json` (from `docs/mcu-doomsday-watchlist_us.md`)
- `reader/data/watchlist.nl.json` (from `docs/mcu-doomsday-watchlist_nl.md`)

Official Marvel links in the markdown are rendered as card actions in the reader.

Marvel page artwork can be cached locally for reader thumbnails:

```bash
cd reader
npm run cache:images
```

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
│   ├── index.html                # Main HTML template
│   ├── styles.css                # Application styles
│   ├── package.json              # Node.js dependencies
│   ├── assets/                   # Images and logos
│   └── data/                     # Generated JSON files
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

## License

See [LICENSE](LICENSE) for details.

---

*Road to Doomsday — Complete MCU viewing guide for Avengers: Doomsday*
