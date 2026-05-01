import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "data");

const sources = [
  {
    locale: "en",
    source: "mcu-doomsday-watchlist_us.md",
    output: "watchlist.en.json",
    labels: {
      languageName: "English",
      pageTitle: "MCU Doomsday Tracker",
      eyebrow: "Road to Doomsday",
      intro:
        "Track the watchlist, search the timeline, and keep your current position stored locally in this browser.",
      status: "Status",
      main: "Main",
      bonus: "Bonus",
      next: "Next",
      search: "Search",
      searchLabel: "Movie or series",
      searchPlaceholder: "thor, black widow, loki...",
      showingFullTimeline: "Showing full timeline.",
      noResults: "No results for",
      position: "Position",
      positions: "Positions",
      timeline: "Timeline",
      reset: "Reset seen status",
      filterAll: "All",
      filterMain: "Main",
      filterBonus: "Bonus",
      filterUnread: "Unseen",
      why: "Why",
      when: "When",
      read: "Seen",
      markRead: "Mark seen",
      mainComplete: "Main timeline complete",
      bonusSuffix: "Bonus X-Men",
      noSummary: "No summary available.",
      noContext: "No context available.",
      noTimelineNote: "No timeline note available.",
    },
  },
  {
    locale: "nl",
    source: "mcu-doomsday-watchlist_nl.md",
    output: "watchlist.nl.json",
    labels: {
      languageName: "Nederlands",
      pageTitle: "MCU Doomsday Tracker",
      eyebrow: "Road to Doomsday",
      intro:
        "Volg de kijklijst, zoek in de tijdlijn en bewaar je huidige positie lokaal in deze browser.",
      status: "Status",
      main: "Hoofd",
      bonus: "Bonus",
      next: "Volgende",
      search: "Zoeken",
      searchLabel: "Film of serie",
      searchPlaceholder: "thor, black widow, loki...",
      showingFullTimeline: "Volledige tijdlijn wordt getoond.",
      noResults: "Geen resultaten voor",
      position: "Positie",
      positions: "Posities",
      timeline: "Tijdlijn",
      reset: "Kijkstatus resetten",
      filterAll: "Alles",
      filterMain: "Hoofd",
      filterBonus: "Bonus",
      filterUnread: "Ongezien",
      why: "Waarom",
      when: "Wanneer",
      read: "Gezien",
      markRead: "Markeer gezien",
      mainComplete: "Hoofdtijdlijn compleet",
      bonusSuffix: "Bonus X-Men",
      noSummary: "Geen samenvatting beschikbaar.",
      noContext: "Geen context beschikbaar.",
      noTimelineNote: "Geen tijdlijnnotitie beschikbaar.",
    },
  },
];

const headingPattern = /^###\s+([B]?\d+)\.\s+(.+?)\s*$/;
const metaPattern = /^\*(Film|Serie|Series)\s+·\s+(.+?)\*$/;
const detailPattern = /^-\s+\*\*(What|Why|When|Who|Wat|Waarom|Wanneer|Wie)\*\*\s+—\s+(.+)$/;
const detailKeys = {
  What: "what",
  Why: "why",
  When: "when",
  Who: "who",
  Wat: "what",
  Waarom: "why",
  Wanneer: "when",
  Wie: "who",
};

function parseWatchlist(markdown) {
  const lines = markdown.split(/\r?\n/);
  const items = [];
  let current = null;

  for (const line of lines) {
    const heading = line.match(headingPattern);
    if (heading) {
      current = {
        key: heading[1],
        title: heading[2],
        kind: "Unknown",
        runtime: "",
        bonus: heading[1].startsWith("B"),
        what: "",
        why: "",
        when: "",
        who: "",
      };
      items.push(current);
      continue;
    }

    if (!current) {
      continue;
    }

    const meta = line.match(metaPattern);
    if (meta) {
      current.kind = meta[1];
      current.runtime = meta[2];
      continue;
    }

    const detail = line.match(detailPattern);
    if (detail) {
      current[detailKeys[detail[1]]] = detail[2];
    }
  }

  return items;
}

function validateItems(source, items) {
  const main = items.filter((item) => !item.bonus);
  const bonus = items.filter((item) => item.bonus);
  const expectedMainKeys = Array.from({ length: 29 }, (_, index) => String(index + 1));
  const mainKeys = main.map((item) => item.key);
  const bonusKeys = bonus.map((item) => item.key);

  if (JSON.stringify(mainKeys) !== JSON.stringify(expectedMainKeys)) {
    throw new Error(`${source} main timeline is not numbered 1-29.`);
  }

  if (JSON.stringify(bonusKeys) !== JSON.stringify(["B1", "B2", "B3"])) {
    throw new Error(`${source} bonus timeline is not numbered B1-B3.`);
  }

  const incomplete = items.filter(
    (item) => !item.title || !item.kind || !item.runtime || !item.what || !item.why,
  );
  if (incomplete.length) {
    throw new Error(
      `${source} has incomplete entries: ${incomplete
        .map((item) => `${item.key}. ${item.title}`)
        .join(", ")}`,
    );
  }
}

await mkdir(dataDir, { recursive: true });

for (const config of sources) {
  const sourcePath = join(here, "..", "docs", config.source);
  const outputPath = join(dataDir, config.output);
  const markdown = await readFile(sourcePath, "utf8");
  const items = parseWatchlist(markdown);

  validateItems(config.source, items);

  const payload = {
    locale: config.locale,
    labels: config.labels,
    generatedFrom: `../docs/${config.source}`,
    generatedAt: new Date().toISOString(),
    count: items.filter((item) => !item.bonus).length,
    bonusCount: items.filter((item) => item.bonus).length,
    items,
  };

  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${items.length} entries to ${outputPath}`);

  if (config.locale === "en") {
    await writeFile(join(dataDir, "watchlist.json"), `${JSON.stringify(payload, null, 2)}\n`);
  }
}
