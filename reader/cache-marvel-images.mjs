import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { dirname, extname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, "data", "watchlist.en.json");
const outputPath = join(here, "data", "marvel-images.json");
const posterDir = join(here, "assets", "posters");

const imageMetaPatterns = [
  /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
  /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
  /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
  /<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image["']/i,
];

const preferredImages = {
  "13": "https://cdn.marvel.com/content/2x/shangchi_lob_crd_07.jpg",
  "B1": "https://m.media-amazon.com/images/M/MV5BZmIyMDk5NGYtYjQ5NS00ZWQxLTg2YzQtZDk1ZmM4ZDBlN2E3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
  "B2": "https://m.media-amazon.com/images/M/MV5BNDk0NjYxMzIzOF5BMl5BanBnXkFtZTYwMTc1MjU3._V1_.jpg",
  "B3": "https://m.media-amazon.com/images/M/MV5BZGIzNWYzN2YtMjcwYS00YjQ3LWI2NjMtOTNiYTUyYjE2MGNkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
};

function extensionFor(url) {
  const extension = extname(new URL(url).pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
    return extension;
  }
  return ".jpg";
}

function findImageUrls(html) {
  const urls = [];
  for (const pattern of imageMetaPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      urls.push(match[1].replace(/&amp;/g, "&"));
    }
  }
  for (const match of html.matchAll(/https:\/\/cdn\.marvel\.com\/[^"'\\)\s]+/g)) {
    urls.push(match[0].replace(/&amp;/g, "&"));
  }
  return [...new Set(urls)].filter((url) => /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url));
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "MCU-Doomsday-Watchlist/1.0",
    },
  });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.text();
}

async function downloadImage(url, destination) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "MCU-Doomsday-Watchlist/1.0",
    },
  });
  if (!response.ok || !response.body) {
    throw new Error(`${url} returned ${response.status}`);
  }
  await pipeline(response.body, createWriteStream(destination));
}

const watchlist = JSON.parse(await readFile(dataPath, "utf8"));
const allItems = watchlist.items.filter((item) =>
  (!item.bonus && item.officialUrl) || item.bonus
);
const images = {};

await mkdir(posterDir, { recursive: true });

for (const item of allItems) {
  try {
    // For bonus items, use only the preferred image (no officialUrl to fetch)
    const imageUrls = item.bonus
      ? [preferredImages[item.key]].filter(Boolean)
      : [preferredImages[item.key], ...(item.officialUrl ? findImageUrls(await fetchText(item.officialUrl)) : [])].filter(Boolean);
    if (!imageUrls.length) {
      console.warn(`No image found for ${item.key}. ${item.title}`);
      continue;
    }

    let imageUrl = "";
    let filename = "";
    let localPath = "";
    let lastError = null;

    for (const candidateUrl of imageUrls) {
      try {
        filename = `${item.key.padStart(2, "0")}${extensionFor(candidateUrl)}`;
        localPath = `./assets/posters/${filename}`;
        await downloadImage(candidateUrl, join(posterDir, filename));
        imageUrl = candidateUrl;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!imageUrl) {
      throw lastError || new Error("No downloadable image found");
    }

    images[item.key] = {
      imageUrl,
      localImage: localPath,
    };
    console.log(`Cached ${item.key}. ${item.title}`);
  } catch (error) {
    console.warn(`Skipped ${item.key}. ${item.title}: ${error.message}`);
  }
}

await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: "Marvel.com page metadata and IMDB for X-Men bonus titles",
      images,
    },
    null,
    2,
  )}\n`,
);
console.log(`Wrote ${Object.keys(images).length} image entries to ${outputPath}`);
