import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "..", "docs", "mcu-doomsday-watchlist.md");
const outputPath = join(here, "data", "watchlist.json");

const headingPattern = /^###\s+([B]?\d+)\.\s+(.+?)\s*$/;
const metaPattern = /^\*(Film|Serie)\s+·\s+(.+?)\*$/;
const detailPattern = /^-\s+\*\*(Wat|Waarom|Wanneer|Wie)\*\*\s+—\s+(.+)$/;

const markdown = await readFile(sourcePath, "utf8");
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
    const key = {
      Wat: "what",
      Waarom: "why",
      Wanneer: "when",
      Wie: "who",
    }[detail[1]];
    current[key] = detail[2];
  }
}

const payload = {
  generatedFrom: "../docs/mcu-doomsday-watchlist.md",
  generatedAt: new Date().toISOString(),
  count: items.filter((item) => !item.bonus).length,
  bonusCount: items.filter((item) => item.bonus).length,
  items,
};

await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${items.length} entries to ${outputPath}`);
