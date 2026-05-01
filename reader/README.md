# MCU Doomsday Reader

Browser reader for the MCU Doomsday watchlist.

## Run

```bash
npm start
```

Open `http://localhost:4173`.

## Refresh Data

The app reads from:

- `reader/data/watchlist.en.json`
- `reader/data/watchlist.nl.json`

English is the default language. Regenerate both data files after editing either markdown guide:

```bash
npm run build:data
```

Watchlist entries can include official Marvel links with `Official` / `Officieel`; the build script exposes those URLs as reader card actions.

Cache Marvel page artwork locally:

```bash
npm run cache:images
```

This fetches Marvel.com page metadata, downloads the discovered CDN images into `reader/assets/posters/`, writes `reader/data/marvel-images.json`, and rebuilds the language data so cards use local thumbnails.

Seen status and the selected language are stored in browser `localStorage`, so they stay personal to the browser and are not committed to Git.
