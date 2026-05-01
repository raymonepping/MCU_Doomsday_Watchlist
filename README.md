# MCU Doomsday Watchlist

Personal watch tracker for the MCU road to `Avengers: Doomsday`.

## Usage

Show progress:

```bash
scripts/MCU_tracker status
```

List the main watchlist:

```bash
scripts/MCU_tracker list
```

List the main watchlist plus optional Fox X-Men bonus titles:

```bash
scripts/MCU_tracker list --bonus
```

Mark an entry as watched:

```bash
scripts/MCU_tracker watched 1
scripts/MCU_tracker watched "Doctor Strange"
scripts/MCU_tracker watched B1
```

Mark an entry as not watched:

```bash
scripts/MCU_tracker unwatched 1
```

Progress is stored locally in `data/mcu-watch-progress.json`. That file is ignored by Git so every clone can keep its own personal watched state.
