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

Read status and the selected language are stored in browser `localStorage`, so they stay personal to the browser and are not committed to Git.
