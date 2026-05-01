# MCU Doomsday Reader

Interactive browser-based reader for the MCU Doomsday watchlist with visual progress tracking, search, and bilingual support.

## Features

- ✅ **Visual Progress Tracking** — Mark entries as seen with checkboxes
- 🔍 **Real-time Search** — Filter titles instantly as you type
- 🌍 **Bilingual Support** — Switch between English and Dutch
- 🎬 **Marvel Integration** — Direct links to official Marvel.com pages
- 🖼️ **Local Image Caching** — Download and cache Marvel poster artwork
- 💾 **Browser Storage** — Seen status persists locally (not synced to Git)
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile

## Quick Start

Start the development server:

```bash
npm start
```

Open `http://localhost:4173` in your browser.

## Data Management

### Regenerate Watchlist Data

After editing markdown guides in `../docs/`, rebuild the JSON data files:

```bash
npm run build:data
```

This generates:
- `data/watchlist.en.json` (from `docs/mcu-doomsday-watchlist_us.md`)
- `data/watchlist.nl.json` (from `docs/mcu-doomsday-watchlist_nl.md`)

The build script automatically extracts:
- Title metadata (name, type, runtime)
- Block organization and descriptions
- Official Marvel.com links (marked as `Official` / `Officieel`)
- Lore sections and narrative context

### Cache Marvel Artwork

Download official Marvel poster images for local use:

```bash
npm run cache:images
```

This command:
1. Fetches Marvel.com page metadata for each title
2. Discovers and downloads CDN poster images
3. Saves images to `assets/posters/`
4. Creates `data/marvel-images.json` with image mappings
5. Rebuilds watchlist data to reference local thumbnails

**Note:** Some titles may have preferred images defined in `cache-marvel-images.mjs` for better visual consistency.

## Storage

- **Seen Status** — Stored in browser `localStorage` (personal to each browser)
- **Language Preference** — Stored in browser `localStorage`
- **Progress Data** — Not committed to Git (stays local)

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 4173 |
| `npm run build:data` | Regenerate JSON from markdown sources |
| `npm run cache:images` | Download Marvel artwork and rebuild data |

## Architecture

- **No Framework** — Pure JavaScript with ES modules
- **No Build Step** — Direct browser execution (except data generation)
- **No Backend** — Static files served via Node.js dev server
- **No Database** — LocalStorage for client-side persistence

## File Structure

```
reader/
├── app.js                    # Main application logic
├── server.mjs                # Development server
├── build-data.mjs            # Markdown → JSON converter
├── cache-marvel-images.mjs   # Marvel artwork downloader
├── index.html                # Application template
├── styles.css                # Application styles
├── package.json              # Scripts and metadata
├── assets/
│   ├── avengers-doomsday.jpg # Header image
│   ├── Marvel_Logo.svg       # Marvel logo
│   └── posters/              # Cached Marvel posters
└── data/
    ├── watchlist.en.json     # English watchlist data
    ├── watchlist.nl.json     # Dutch watchlist data
    └── marvel-images.json    # Image URL mappings
```

## Development Notes

The reader is intentionally minimal:
- No transpilation or bundling required
- No external dependencies for the frontend
- Works offline after initial load
- Fast iteration cycle (edit → refresh)

Official Marvel links in the markdown are automatically parsed and rendered as clickable card actions in the reader interface.
