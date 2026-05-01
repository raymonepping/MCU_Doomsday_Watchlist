# MCU Doomsday Reader

Browser reader for the MCU Doomsday watchlist.

## Run

```bash
npm start
```

Open `http://localhost:4173`.

## Refresh Data

The app reads from `reader/data/watchlist.json`. Regenerate it after editing the markdown guide:

```bash
npm run build:data
```

Read status is stored in browser `localStorage`, so it stays personal to the browser and is not committed to Git.
