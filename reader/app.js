const readStorageKey = "mcu-doomsday-reader.read";
const localeStorageKey = "mcu-doomsday-reader.locale";
const themeStorageKey = "mcu-doomsday-reader.theme";
const timelineOrderStorageKey = "mcu-doomsday-reader.timeline-order";
const defaultLocale = "en";
const supportedLocales = new Set(["en", "nl"]);
const doomsdayDate = new Date("2026-12-18T00:00:00");

const state = {
  items: [],
  labels: {},
  read: new Set(JSON.parse(localStorage.getItem(readStorageKey) || "[]")),
  query: "",
  filter: "all",
  locale: getInitialLocale(),
  theme: getInitialTheme(),
  timelineView: "cards", // "cards" or "blocks"
  characterFilter: null, // null or character name
  blockFilter: null, // null or block number (1-4)
  conceptFilter: null, // null or concept name
  phaseFilter: "all", // "all" or phase number (1-6)
  typeFilter: "all", // "all", "film", or "series"
  timelineOrder: getInitialTimelineOrder(), // "release" or "chronological"
  teamFilter: null, // null or team name
  avengersAssembleActive: false, // special filter for core 15 Avengers
  defendersAssembleActive: false, // special filter for core 4 Defenders
  sagaFilters: new Set(["doomsday"]), // Set of active saga filters (default: doomsday only)
};

// Saga definitions - categorize content into different timelines/collections
const sagas = {
  "infinity-saga": {
    name: "The Infinity Saga",
    description: "Phases 1-3 (2008-2019)",
    icon: "💎",
    color: "#FFD700",
    order: 1
  },
  "multiverse-saga": {
    name: "The Multiverse Saga",
    description: "Phases 4-6 (2021-2026)",
    icon: "🌌",
    color: "#5fb4ff",
    order: 2
  },
  "doomsday": {
    name: "Doomsday Timeline",
    description: "Road to Avengers: Doomsday",
    icon: "⏰",
    color: "#e62429",
    order: 3,
    default: true
  },
  "x-men": {
    name: "X-Men Universe",
    description: "Fox X-Men timeline",
    icon: "✖️",
    color: "#4169E1",
    order: 4
  },
  "spider-man": {
    name: "Spider-Man Complete",
    description: "All Spider-Man films",
    icon: "🕷️",
    color: "#DC143C",
    order: 5
  }
};

// Core Avengers - The 15 heroes from the "Avengers Assemble" filter
const coreAvengers = [
  "Iron Man",
  "Tony Stark",
  "Captain America",
  "Steve Rogers",
  "Thor",
  "Hulk",
  "Bruce Banner",
  "Spider-Man",
  "Peter Parker",
  "Black Widow",
  "Natasha Romanoff",
  "Vision",
  "Sam Wilson",
  "Falcon",
  "Hawkeye",
  "Clint Barton",
  "Scarlet Witch",
  "Wanda Maximoff",
  "Black Panther",
  "T'Challa",
  "Ant-Man",
  "Scott Lang",
  "Hope van Dyne",
  "Wasp",
  "Captain Marvel",
  "Carol Danvers",
  "War Machine",
  "James Rhodes",
  "Rhodey"
];

// Core Defenders - The 4 street-level heroes from the "Defenders Assemble" filter
const coreDefenders = [
  "Iron Fist",
  "Danny Rand",
  "Luke Cage",
  "Jessica Jones",
  "Daredevil",
  "Matthew Murdock",
  "Matt Murdock"
];

// Block definitions based on key ranges
const blocks = [
  { name: "The Legacy", range: [1, 8], color: "#e62429" },
  { name: "The New Guard", range: [9, 14], color: "#f3c969" },
  { name: "The Multiverse Fracture", range: [15, 22], color: "#5fb4ff" },
  { name: "The Finale", range: [23, 30], color: "#55d68b" },
];

// Concept to title mapping - based on mcu_concepts_matrix.md
// Each array contains the key numbers of titles that feature that concept
const conceptMap = {
  // Multiversal Mechanics
  "incursions": [11, 17, 18, 21, 22], // Loki, No Way Home, MoM, The Marvels, Deadpool
  "anchor-beings": [11, 17, 18, 22], // Loki, No Way Home, MoM, Deadpool
  "sacred-timeline": [1, 3, 8, 11, 19, 21, 22], // Strange, Ragnarok, Endgame, Loki, Quantumania, Marvels, Deadpool
  "nexus-events": [1, 3, 10, 17, 18, 22], // Strange, Ragnarok, WandaVision, No Way Home, MoM, Deadpool
  "the-void": [11, 22], // Loki, Deadpool (part of TVA concept)
  
  // Sources of Power
  "vibranium": [4, 7, 20, 23], // Black Panther, Infinity War, Wakanda Forever, Brave New World
  "infinity-stones": [7, 8], // Infinity War, Endgame
  "chaos-magic": [10, 17, 18], // WandaVision, No Way Home, MoM
  "pym-particles": [6, 8, 19], // Ant-Man & Wasp, Endgame, Quantumania
  
  // Geopolitics & Organizations
  "tva": [11, 19, 21, 22], // Loki, Quantumania, The Marvels, Deadpool
  "sokovia-accords": [5, 11, 19, 23, 24], // Black Widow, Falcon/Winter Soldier, Quantumania, Brave New World, Thunderbolts
  "latveria": [19, 24], // Quantumania, Thunderbolts (Doom connection)
  "quantum-realm": [6, 8, 19], // Ant-Man & Wasp, Endgame, Quantumania
  
  // Legacy Threads
  "stark-legacy": [2, 7, 9, 11, 20, 24], // Homecoming, Infinity War, Far From Home, Falcon/Winter Soldier, Wakanda Forever, Thunderbolts
  "new-guard": [2, 9, 11, 12, 13, 14, 20, 24, 27], // Homecoming, Far From Home, Falcon/WS, Hawkeye, Shang-Chi, Love & Thunder, Wakanda Forever, Thunderbolts, Daredevil
};

// Team/Faction to title mapping
// Each array contains the key numbers of titles that feature that team
// Keys are matched based on title content and character appearances
const teamMap = {
  "avengers": ["1", "4", "5", "6", "8", "11", "13", "17", "19", "22", "26", "33", "34", "38", "45"], // Avengers films + solo films of Avengers members
  "fantastic-four": ["40"], // The Fantastic Four: First Steps
  "guardians": ["10", "15"], // Guardians of the Galaxy Vol. 1 & 2
  "defenders": ["42", "49"], // Daredevil: Born Again S1 & S2
  "x-men": ["37", "B1", "B2", "B3"], // Deadpool & Wolverine + Fox X-Men trilogy
};

// Team metadata with colors and descriptions
const teams = {
  "avengers": {
    name: "Avengers",
    color: "#e62429",
    icon: "🦸",
    url: "https://www.marvel.com/teams-and-groups/avengers"
  },
  "fantastic-four": {
    name: "Fantastic Four",
    color: "#4a90e2",
    icon: "4️⃣",
    url: "https://www.marvel.com/teams-and-groups/fantastic-four"
  },
  "guardians": {
    name: "Guardians of the Galaxy",
    color: "#f3c969",
    icon: "🚀",
    url: "https://www.marvel.com/teams-and-groups/guardians-of-the-galaxy"
  },
  "defenders": {
    name: "Defenders",
    color: "#55d68b",
    icon: "🛡️",
    url: "https://www.marvel.com/teams-and-groups/defenders"
  },
  "x-men": {
    name: "X-Men",
    color: "#9b59b6",
    icon: "✖️",
    url: "https://www.marvel.com/teams-and-groups/x-men"
  }
};

// Concept scores for each title (number of concepts present)
// Based on mcu_concepts_matrix.md - higher score = more essential for Doomsday prep
// Exposed globally for enhancements
window.conceptScores = {
  1: 2,  // Doctor Strange
  2: 2,  // Spider-Man: Homecoming
  3: 2,  // Thor: Ragnarok
  4: 1,  // Black Panther
  5: 2,  // Black Widow
  6: 1,  // Ant-Man and the Wasp
  7: 3,  // Avengers: Infinity War
  8: 5,  // Avengers: Endgame ⭐ HIGHEST
  9: 2,  // Spider-Man: Far From Home
  10: 2, // WandaVision
  11: 4, // Loki S1&2 ⭐
  12: 2, // Hawkeye
  13: 1, // Shang-Chi
  14: 1, // Thor: Love and Thunder
  15: 4, // Loki (duplicate - should be combined with 11)
  16: 0, // Moon Knight
  17: 4, // Spider-Man: No Way Home ⭐
  18: 4, // Doctor Strange MoM ⭐
  19: 3, // Ant-Man Quantumania
  20: 3, // Black Panther: Wakanda Forever
  21: 3, // The Marvels
  22: 4, // Deadpool & Wolverine ⭐
  23: 4, // Captain America: Brave New World ⭐
  24: 3, // Thunderbolts*
  25: 0, // Fantastic Four (not yet released)
  26: 0, // Wonder Man
  27: 2, // Daredevil: Born Again
  28: 0, // VisionQuest
  29: 0, // Spider-Man: Brand New Day
  30: 0, // Avengers: Doomsday
};

const elements = {
  timeline: document.querySelector("#timeline"),
  template: document.querySelector("#itemTemplate"),
  searchInput: document.querySelector("#searchInput"),
  searchResult: document.querySelector("#searchResult"),
  mainStatus: document.querySelector("#mainStatus"),
  bonusStatus: document.querySelector("#bonusStatus"),
  nextTitle: document.querySelector("#nextTitle"),
  progressRing: document.querySelector("#progressRing"),
  progressPercent: document.querySelector("#progressPercent"),
  resetButton: document.querySelector("#resetButton"),
  filterButtons: [...document.querySelectorAll("[data-filter]")],
  languageButtons: [...document.querySelectorAll("[data-locale]")],
  eyebrow: document.querySelector(".eyebrow"),
  title: document.querySelector("h1"),
  intro: document.querySelector(".masthead-copy p:not(.eyebrow)"),
  statusHeading: document.querySelector(".status-panel h2"),
  searchHeading: document.querySelector(".controls-panel h2"),
  searchLabel: document.querySelector(".search-box span"),
  timelineHeading: document.querySelector(".section-heading h2"),
  statLabels: [...document.querySelectorAll(".stats dt")],
  themeToggle: document.querySelector("#themeToggle"),
  timelineOrderToggle: document.querySelector("#timelineOrderToggle"),
  orderLabel: document.querySelector("#orderLabel"),
  countdownValue: document.querySelector("#countdownValue"),
  timeValue: document.querySelector("#timeValue"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFile: document.querySelector("#importFile"),
  statFilms: document.querySelector("#statFilms"),
  statSeries: document.querySelector("#statSeries"),
  statHours: document.querySelector("#statHours"),
  statPercent: document.querySelector("#statPercent"),
  confettiCanvas: document.querySelector("#confetti"),
  timelineViewToggle: document.querySelector("#timelineViewToggle"),
  characterChips: document.querySelector("#characterChips"),
  blockChips: [...document.querySelectorAll("[data-block]")],
  conceptChips: [...document.querySelectorAll("[data-concept]")],
  teamChips: [...document.querySelectorAll("[data-team]")],
  sagaChips: [...document.querySelectorAll("[data-saga]")],
  avengersAssembleBtn: document.querySelector("#avengersAssembleBtn"),
  defendersAssembleBtn: document.querySelector("#defendersAssembleBtn"),
  topSearchInput: document.querySelector("#topSearchInput"),
  phaseChips: [...document.querySelectorAll("[data-phase]")],
  typeChips: [...document.querySelectorAll("[data-type]")],
  filterCount: document.querySelector("#filterCount"),
  filterTotal: document.querySelector("#filterTotal"),
};

function getInitialLocale() {
  const saved = localStorage.getItem(localeStorageKey);
  return supportedLocales.has(saved) ? saved : defaultLocale;
}

function getInitialTheme() {
  const saved = localStorage.getItem(themeStorageKey);
  return saved === "light" ? "light" : "dark";
}

function getInitialTimelineOrder() {
  const saved = localStorage.getItem(timelineOrderStorageKey);
  return saved === "chronological" ? "chronological" : "release";
}

function saveTimelineOrder() {
  localStorage.setItem(timelineOrderStorageKey, state.timelineOrder);
}

function label(key) {
  return state.labels[key] || key;
}

function parseRuntime(runtime) {
  // Parse runtime strings like "2h 15m", "~5 hours", "1h 44m"
  const hourMatch = runtime.match(/(\d+)h/);
  const minMatch = runtime.match(/(\d+)m/);
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minMatch ? parseInt(minMatch[1]) : 0;
  return hours + minutes / 60;
}

function calculateRemainingTime() {
  const unseenItems = state.items.filter(item => !state.read.has(item.key));
  const totalHours = unseenItems.reduce((sum, item) => sum + parseRuntime(item.runtime), 0);
  return Math.round(totalHours);
}

function calculateCountdown() {
  const now = new Date();
  const diff = doomsdayDate - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = elements.themeToggle.querySelector(".theme-icon");
  icon.textContent = theme === "light" ? "🌙" : "☀️";
  localStorage.setItem(themeStorageKey, theme);
}

function exportProgress() {
  const data = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    locale: state.locale,
    read: [...state.read].sort(sortKeys),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mcu-doomsday-progress-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.read && Array.isArray(data.read)) {
        state.read = new Set(data.read);
        saveReadState();
        render();
        alert("Progress imported successfully!");
      } else {
        alert("Invalid progress file format.");
      }
    } catch (error) {
      alert("Error reading progress file: " + error.message);
    }
  };
  reader.readAsText(file);
}

function calculateStatistics() {
  const watchedItems = state.items.filter(item => state.read.has(item.key));
  const films = watchedItems.filter(item => item.kind === "Film").length;
  const series = watchedItems.filter(item => item.kind === "Serie").length;
  const totalHours = watchedItems.reduce((sum, item) => sum + parseRuntime(item.runtime), 0);
  const main = state.items.filter(item => !item.bonus);
  const mainWatched = main.filter(item => state.read.has(item.key)).length;
  const percent = main.length ? Math.round((mainWatched / main.length) * 100) : 0;
  
  return { films, series, totalHours: Math.round(totalHours), percent };
}

function launchConfetti() {
  const canvas = elements.confettiCanvas;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ["#e62429", "#f3c969", "#5fb4ff", "#55d68b"];
  const particleCount = 150;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;
    
    particles.forEach(p => {
      if (p.y < canvas.height + 20) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.1; // gravity
      }
    });
    
    if (activeParticles > 0) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  animate();
}

function extractCharacters() {
  const characters = new Set();
  const mainCharacters = ["Thor", "Loki", "Strange", "Spider-Man", "Peter Parker", "Stark", "Tony Stark", 
    "Wanda", "Scarlet Witch", "Captain America", "Sam Wilson", "Bucky", "Shuri", "Namor", 
    "Ant-Man", "Scott Lang", "Hawkeye", "Kate Bishop", "Yelena", "Black Widow"];
  
  state.items.forEach(item => {
    if (item.who) {
      mainCharacters.forEach(char => {
        if (item.who.includes(char)) {
          // Normalize character names
          if (char === "Peter Parker") char = "Spider-Man";
          if (char === "Tony Stark") char = "Stark";
          if (char === "Sam Wilson") char = "Captain America";
          if (char === "Scarlet Witch") char = "Wanda";
          if (char === "Scott Lang") char = "Ant-Man";
          if (char === "Kate Bishop") char = "Hawkeye";
          characters.add(char);
        }
      });
    }
  });
  
  return Array.from(characters).sort();
}

function getBlockForItem(item) {
  if (item.bonus) return null;
  const keyNum = parseInt(item.key);
  return blocks.find(block => keyNum >= block.range[0] && keyNum <= block.range[1]);
}

function renderCharacterFilters() {
  const characters = extractCharacters();
  elements.characterChips.innerHTML = "";
  
  characters.forEach(char => {
    const chip = document.createElement("button");
    chip.className = "character-chip";
    chip.textContent = char;
    chip.dataset.character = char;
    if (state.characterFilter === char) {
      chip.classList.add("is-active");
    }
    elements.characterChips.appendChild(chip);
  });
}

function saveReadState() {
  localStorage.setItem(readStorageKey, JSON.stringify([...state.read].sort(sortKeys)));
}

function saveLocale() {
  localStorage.setItem(localeStorageKey, state.locale);
}

function sortKeys(left, right) {
  const leftBonus = left.startsWith("B");
  const rightBonus = right.startsWith("B");
  if (leftBonus !== rightBonus) {
    return leftBonus ? 1 : -1;
  }
  return Number(left.replace("B", "")) - Number(right.replace("B", ""));
}

function matchesFilters(item) {
  const query = state.query.trim().toLocaleLowerCase();
  const textMatch =
    !query ||
    [
      item.key,
      item.title,
      item.kind,
      item.runtime,
      item.what,
      item.why,
      item.when,
      item.who,
      item.officialUrl,
    ]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query);

  const filterMatch =
    state.filter === "all" ||
    (state.filter === "main" && !item.bonus) ||
    (state.filter === "bonus" && item.bonus) ||
    (state.filter === "unread" && !state.read.has(item.key));

  // Avengers Assemble filter - checks if any core Avenger appears in the title
  const avengersAssembleMatch = !state.avengersAssembleActive || (() => {
    const searchText = [item.title, item.who, item.what, item.why].join(" ").toLowerCase();
    return coreAvengers.some(avenger => searchText.includes(avenger.toLowerCase()));
  })();

  // Defenders Assemble filter - checks if any core Defender appears in the title
  const defendersAssembleMatch = !state.defendersAssembleActive || (() => {
    const searchText = [item.title, item.who, item.what, item.why].join(" ").toLowerCase();
    return coreDefenders.some(defender => searchText.includes(defender.toLowerCase()));
  })();

  // Character filter searches in title, who, what, and why fields
  const characterMatch = !state.characterFilter ||
    [item.title, item.who, item.what, item.why]
      .join(" ")
      .includes(state.characterFilter);

  // Block filter checks if item is in selected block range
  const blockMatch = !state.blockFilter || (() => {
    if (item.bonus) return false; // Bonus items don't belong to blocks
    const keyNum = parseInt(item.key);
    const block = blocks[state.blockFilter - 1]; // blockFilter is 1-4, array is 0-3
    return keyNum >= block.range[0] && keyNum <= block.range[1];
  })();

  // Concept filter checks if item's key is in the concept's title list
  const conceptMatch = !state.conceptFilter || (() => {
    const conceptTitles = conceptMap[state.conceptFilter] || [];
    const keyNum = parseInt(item.key);
    return conceptTitles.includes(keyNum);
  })();

  // Team filter checks if item's key is in the team's title list
  const teamMatch = !state.teamFilter || (() => {
    const teamTitles = teamMap[state.teamFilter] || [];
    // Handle both numeric keys and bonus keys (B1, B2, B3)
    return teamTitles.includes(item.key) || teamTitles.includes(parseInt(item.key));
  })();

  // Phase filter - uses official MCU phase data from JSON
  const phaseMatch = state.phaseFilter === "all" || (() => {
    // Bonus items (Fox X-Men) have phase: null, so they match "all" only
    if (item.bonus) return state.phaseFilter === "all";
    
    // Match based on the phase field in the item data
    const itemPhase = item.phase;
    const filterPhase = parseInt(state.phaseFilter);
    
    return itemPhase === filterPhase;
  })();

  // Type filter - matches Film vs Series
  const typeMatch = state.typeFilter === "all" || (() => {
    const itemType = item.kind.toLowerCase();
    if (state.typeFilter === "film") {
      return itemType === "film" || itemType === "movie";
    } else if (state.typeFilter === "series") {
      return itemType === "series" || itemType.includes("season");
    }
    return true;
  })();

  // Saga filter - checks if item belongs to any of the selected sagas
  const sagaMatch = (() => {
    // If no sagas selected, show all items
    if (state.sagaFilters.size === 0) return true;
    
    // If item has no saga tags, show it (for items not yet tagged)
    if (!item.saga || !Array.isArray(item.saga) || item.saga.length === 0) return true;
    
    // Check if item belongs to any of the selected sagas
    return item.saga.some(saga => state.sagaFilters.has(saga));
  })();

  return (
    textMatch &&
    filterMatch &&
    characterMatch &&
    avengersAssembleMatch &&
    defendersAssembleMatch &&
    blockMatch &&
    conceptMatch &&
    teamMatch &&
    phaseMatch &&
    typeMatch &&
    sagaMatch
  );
}

function renderStaticText() {
  document.documentElement.lang = state.locale === "nl" ? "nl" : "en";
  document.title = label("pageTitle");
  elements.eyebrow.textContent = label("eyebrow");
  elements.title.textContent = label("pageTitle");
  elements.intro.textContent = label("intro");
  elements.statusHeading.textContent = label("status");
  elements.searchHeading.textContent = label("search");
  elements.searchLabel.textContent = label("searchLabel");
  elements.searchInput.placeholder = label("searchPlaceholder");
  elements.timelineHeading.textContent = label("timeline");
  elements.resetButton.textContent = label("reset");
  elements.statLabels[0].textContent = label("main");
  elements.statLabels[1].textContent = label("bonus");
  elements.statLabels[2].textContent = label("next");

  const filterLabels = {
    all: label("filterAll"),
    main: label("filterMain"),
    bonus: label("filterBonus"),
    unread: label("filterUnread"),
  };
  for (const button of elements.filterButtons) {
    button.textContent = filterLabels[button.dataset.filter];
  }

  for (const button of elements.languageButtons) {
    button.classList.toggle("is-active", button.dataset.locale === state.locale);
  }
}

function renderStatus() {
  const main = state.items.filter((item) => !item.bonus);
  const bonus = state.items.filter((item) => item.bonus);
  const mainRead = main.filter((item) => state.read.has(item.key)).length;
  const bonusRead = bonus.filter((item) => state.read.has(item.key)).length;
  const percent = main.length ? Math.round((mainRead / main.length) * 100) : 0;
  const next = main.find((item) => !state.read.has(item.key));

  elements.mainStatus.textContent = `${mainRead} / ${main.length}`;
  elements.bonusStatus.textContent = `${bonusRead} / ${bonus.length}`;
  elements.nextTitle.textContent = next ? `${next.key}. ${next.title}` : label("mainComplete");
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressRing.style.setProperty("--progress", `${percent}%`);
  
  // Update countdown
  const daysLeft = calculateCountdown();
  elements.countdownValue.textContent = daysLeft;
  
  // Update remaining time
  const hoursLeft = calculateRemainingTime();
  elements.timeValue.textContent = hoursLeft > 0 ? `${hoursLeft} hours` : "Complete!";
  
  // Update statistics
  const stats = calculateStatistics();
  elements.statFilms.textContent = stats.films;
  elements.statSeries.textContent = stats.series;
  elements.statHours.textContent = `${stats.totalHours}h`;
  elements.statPercent.textContent = `${stats.percent}%`;
  
  // Launch confetti when main watchlist is complete
  if (percent === 100 && mainRead === main.length && main.length > 0) {
    // Only launch once per session
    if (!window.confettiLaunched) {
      window.confettiLaunched = true;
      setTimeout(() => launchConfetti(), 300);
    }
  } else {
    window.confettiLaunched = false;
  }
}

function renderSearchResult(matches) {
  const query = state.query.trim();
  if (!query) {
    elements.searchResult.textContent = label("showingFullTimeline");
    return;
  }

  if (matches.length === 0) {
    elements.searchResult.textContent = `${label("noResults")} "${query}".`;
    return;
  }

  const positions = matches.map((item) => `${item.key}. ${item.title}`).join(" | ");
  elements.searchResult.textContent = `${
    matches.length === 1 ? label("position") : label("positions")
  }: ${positions}`;
}

// Helper function to determine era/year for timeline dividers
function getEraForItem(item) {
  if (item.bonus) return null; // No dividers for bonus content
  
  const keyNum = parseInt(item.key);
  
  // Map items to approximate release years/eras based on MCU timeline
  // This creates natural groupings in the timeline
  if (keyNum >= 1 && keyNum <= 3) return "2016-2017"; // Doctor Strange, Homecoming, Ragnarok
  if (keyNum >= 4 && keyNum <= 6) return "2018"; // Black Panther, Black Widow, Ant-Man & Wasp
  if (keyNum >= 7 && keyNum <= 8) return "2018-2019"; // Infinity War, Endgame
  if (keyNum >= 9 && keyNum <= 11) return "2019-2021"; // Far From Home, WandaVision, Loki
  if (keyNum >= 12 && keyNum <= 14) return "2021"; // Hawkeye, Shang-Chi, Love & Thunder
  if (keyNum >= 15 && keyNum <= 18) return "2021-2022"; // Loki S2, Moon Knight, No Way Home, MoM
  if (keyNum >= 19 && keyNum <= 22) return "2023"; // Quantumania, Wakanda Forever, Marvels, Deadpool
  if (keyNum >= 23 && keyNum <= 24) return "2025"; // Brave New World, Thunderbolts
  if (keyNum >= 25 && keyNum <= 27) return "2025-2026"; // Fantastic Four, Wonder Man, Daredevil
  if (keyNum >= 28 && keyNum <= 30) return "2026-2027"; // VisionQuest, Spider-Man, Doomsday
  
  return null;
}

function renderBlockView() {
  const matches = state.items.filter(matchesFilters);
  const fragment = document.createDocumentFragment();

  for (const block of blocks) {
    const blockItems = matches.filter(item => {
      const num = parseInt(item.key.replace('B', ''));
      return num >= block.start && num <= block.end;
    });

    if (blockItems.length === 0) continue;

    const blockDiv = document.createElement('div');
    blockDiv.className = 'timeline-block';
    blockDiv.style.setProperty('--block-color', block.color);

    const blockRead = blockItems.filter(item => state.read.has(item.key)).length;
    const blockPercent = Math.round((blockRead / blockItems.length) * 100);

    blockDiv.innerHTML = `
      <div class="block-header">
        <h3>${block.name}</h3>
        <span class="block-range">${block.start}-${block.end}</span>
      </div>
      <div class="block-progress">
        <div class="block-progress-bar" style="width: ${blockPercent}%"></div>
        <span class="block-progress-text">${blockRead}/${blockItems.length} (${blockPercent}%)</span>
      </div>
      <div class="block-items">
        ${blockItems.map(item => {
          const read = state.read.has(item.key);
          return `
            <div class="block-item ${read ? 'is-read' : ''}" data-key="${item.key}">
              <span class="block-item-key">${item.key}</span>
              <span class="block-item-title">${item.title}</span>
              <button class="block-item-button" aria-pressed="${read}">
                ${read ? '✓' : '○'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Add click handlers for block items
    blockDiv.querySelectorAll('.block-item-button').forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = blockItems[idx];
        if (state.read.has(item.key)) {
          state.read.delete(item.key);
        } else {
          state.read.add(item.key);
        }
        saveReadState();
        render();
      });
    });

    fragment.append(blockDiv);
  }

  elements.timeline.replaceChildren(fragment);
  renderSearchResult(matches);
  
  // Re-apply enhancements after block view is rendered
  if (window.MCUEnhancements) {
    setTimeout(() => {
      window.MCUEnhancements.applyBlockColors();
    }, 50);
  }
}

function renderTimeline() {
  // Update filter count display
  let matches = state.items.filter(matchesFilters);
  
  // Sort based on timeline order
  if (state.timelineOrder === 'chronological') {
    matches = matches.sort((a, b) => {
      const orderA = a.chronologicalOrder || 999;
      const orderB = b.chronologicalOrder || 999;
      return orderA - orderB;
    });
  } else {
    // Release order - sort by key (which is already in release order)
    matches = matches.sort((a, b) => {
      const keyA = a.key.startsWith('B') ? parseInt(a.key.substring(1)) + 1000 : parseInt(a.key);
      const keyB = b.key.startsWith('B') ? parseInt(b.key.substring(1)) + 1000 : parseInt(b.key);
      return keyA - keyB;
    });
  }
  
  if (elements.filterCount && elements.filterTotal) {
    elements.filterCount.textContent = matches.length;
    elements.filterTotal.textContent = state.items.length;
  }

  // Use block view if enabled
  if (state.timelineView === 'blocks') {
    renderBlockView();
    return;
  }

  // Default card view with era dividers
  const fragment = document.createDocumentFragment();
  let lastEra = null;

  for (let i = 0; i < matches.length; i++) {
    const item = matches[i];
    
    // Add era divider if we're entering a new era
    const currentEra = getEraForItem(item);
    if (currentEra && currentEra !== lastEra) {
      const divider = document.createElement('div');
      divider.className = 'era-divider';
      divider.innerHTML = `
        <div class="era-divider-line"></div>
        <div class="era-divider-text">⟡ ${currentEra} ⟡</div>
        <div class="era-divider-line"></div>
      `;
      fragment.append(divider);
      lastEra = currentEra;
    }
    
    const card = elements.template.content.firstElementChild.cloneNode(true);
    const read = state.read.has(item.key);

    card.dataset.key = item.key;
    card.classList.toggle("is-read", read);
    card.style.setProperty("--animation-order", i);
    
    // Display position based on timeline order
    const displayPosition = state.timelineOrder === 'chronological'
      ? (item.chronologicalOrder || item.key)
      : item.key;
    card.querySelector(".position").textContent = displayPosition;
    card.querySelector(".card-kicker").textContent = `${item.kind} | ${item.runtime}${
      item.bonus ? ` | ${label("bonusSuffix")}` : ""
    }`;
    card.querySelector("h3").textContent = item.title;
    card.querySelector(".summary").textContent = item.what || label("noSummary");
    card.querySelector(".why").closest("div").querySelector("dt").textContent = label("why");
    card.querySelector(".why").textContent = item.why || label("noContext");
    card.querySelector(".when").closest("div").querySelector("dt").textContent = label("when");
    card.querySelector(".when").textContent = item.when || label("noTimelineNote");
    const officialLink = card.querySelector(".official-link");
    if (item.officialUrl) {
      officialLink.href = item.officialUrl;
      officialLink.textContent = label("officialLink");
    } else {
      officialLink.remove();
    }

    const posterLink = card.querySelector(".poster-link");
    const posterImage = card.querySelector(".poster-image");
    const posterSource = item.localImage || item.imageUrl;
    if (posterSource) {
      posterLink.href = item.officialUrl || posterSource;
      posterImage.src = posterSource;
      posterImage.alt = `${item.title} artwork`;
    } else {
      posterLink.remove();
    }

    const button = card.querySelector(".read-button");
    button.textContent = read ? label("read") : label("markRead");
    button.setAttribute("aria-pressed", String(read));
    button.addEventListener("click", () => {
      if (state.read.has(item.key)) {
        state.read.delete(item.key);
      } else {
        state.read.add(item.key);
      }
      saveReadState();
      render();
    });

    fragment.append(card);
  }

  elements.timeline.replaceChildren(fragment);
  renderSearchResult(matches);
  
  // Re-apply enhancements after timeline is rendered
  if (window.MCUEnhancements) {
    setTimeout(() => {
      window.MCUEnhancements.applyBlockColors();
      window.MCUEnhancements.addConceptBadges();
      window.MCUEnhancements.addTriviaToCards();
    }, 50);
  }
}

function render() {
  renderStaticText();
  renderStatus();
  renderTimeline();
}

async function loadWatchlist(locale = state.locale) {
  const response = await fetch(`./data/watchlist.${locale}.json`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load watchlist: ${response.status}`);
  }
  const payload = await response.json();
  state.locale = payload.locale;
  state.labels = payload.labels;
  state.items = payload.items;
  saveLocale();
  render();
}

elements.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderTimeline();
});

// Top search input (synced with sidebar search)
if (elements.topSearchInput) {
  elements.topSearchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    // Sync with sidebar search
    elements.searchInput.value = event.target.value;
    renderTimeline();
  });
}

// Phase filter chips
for (const button of elements.phaseChips) {
  button.addEventListener("click", () => {
    state.phaseFilter = button.dataset.phase;
    for (const chip of elements.phaseChips) {
      chip.classList.toggle("is-active", chip === button);
    }
    renderTimeline();
  });
}

// Type filter chips
for (const button of elements.typeChips) {
  button.addEventListener("click", () => {
    state.typeFilter = button.dataset.type;
    for (const chip of elements.typeChips) {
      chip.classList.toggle("is-active", chip === button);
    }
    renderTimeline();
  });
}

// Concept filter chips
for (const button of elements.conceptChips) {
  button.addEventListener("click", () => {
    const concept = button.dataset.concept;
    
    // Toggle concept filter
    if (state.conceptFilter === concept) {
      // Clicking active concept deactivates it
      state.conceptFilter = null;
      button.classList.remove("is-active");
    } else {
      // Activate new concept, deactivate others
      state.conceptFilter = concept;
      for (const chip of elements.conceptChips) {
        chip.classList.toggle("is-active", chip === button);
      }
    }
    
    renderTimeline();
  });
}

for (const button of elements.filterButtons) {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    for (const item of elements.filterButtons) {
      item.classList.toggle("is-active", item === button);
    }
    renderTimeline();
  });
}

for (const button of elements.languageButtons) {
  button.addEventListener("click", async () => {
    const locale = button.dataset.locale;
    if (!supportedLocales.has(locale) || locale === state.locale) {
      return;
    }
    await loadWatchlist(locale);
  });
}

elements.resetButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
    state.read.clear();
    saveReadState();
    render();
  }
});

// Theme toggle
elements.themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme(state.theme);
});

// Timeline order toggle
elements.timelineOrderToggle.addEventListener("click", () => {
  state.timelineOrder = state.timelineOrder === "release" ? "chronological" : "release";
  saveTimelineOrder();
  
  // Update button label
  if (elements.orderLabel) {
    elements.orderLabel.textContent = state.timelineOrder === "release" ? "Release" : "Chronological";
  }
  
  // Re-render timeline with new order
  render();
});

// Initialize order label on page load
if (elements.orderLabel) {
  elements.orderLabel.textContent = state.timelineOrder === "release" ? "Release" : "Chronological";
}

// Export progress
elements.exportButton.addEventListener("click", () => {
  exportProgress();
});

// Import progress
elements.importButton.addEventListener("click", () => {
  elements.importFile.click();
});

elements.importFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    importProgress(file);
    event.target.value = ""; // Reset file input
  }
});

// Timeline view toggle
elements.timelineViewToggle.addEventListener("click", () => {
  state.timelineView = state.timelineView === "cards" ? "blocks" : "cards";
  elements.timelineViewToggle.textContent = state.timelineView === "cards" ? "📊 Block View" : "🎬 Card View";
  renderTimeline();
});

// Character filter chips (delegated event handling)
elements.characterChips.addEventListener("click", (event) => {
  const chip = event.target.closest(".character-chip");
  if (!chip) return;
  
  const character = chip.dataset.character;
  if (state.characterFilter === character) {
    // Deselect if clicking the same character
    state.characterFilter = null;
    elements.characterChips.querySelectorAll(".character-chip").forEach(c => c.classList.remove("is-active"));
  } else {
    // Select new character
    state.characterFilter = character;
    elements.characterChips.querySelectorAll(".character-chip").forEach(c => {
      c.classList.toggle("is-active", c.dataset.character === character);
    });
  }
  renderTimeline();
});

// Block filter chips
for (const chip of elements.blockChips) {
  chip.addEventListener("click", () => {
    const blockNum = parseInt(chip.dataset.block);
    if (state.blockFilter === blockNum) {
      // Deselect if clicking the same block
      state.blockFilter = null;
      elements.blockChips.forEach(c => c.classList.remove("is-active"));
    } else {
      // Select new block
      state.blockFilter = blockNum;
      elements.blockChips.forEach(c => {
        c.classList.toggle("is-active", parseInt(c.dataset.block) === blockNum);
      });
    }
    renderTimeline();
  });
}

// Concept filter chips
for (const chip of elements.conceptChips) {
  chip.addEventListener("click", () => {
    const concept = chip.dataset.concept;
    if (state.conceptFilter === concept) {
      // Deselect if clicking the same concept
      state.conceptFilter = null;
      elements.conceptChips.forEach(c => c.classList.remove("is-active"));
    } else {
      // Select new concept
      state.conceptFilter = concept;
      elements.conceptChips.forEach(c => {
        c.classList.toggle("is-active", c.dataset.concept === concept);
      });
    }
    renderTimeline();
  });
}

// Team filter chips
for (const chip of elements.teamChips) {
  chip.addEventListener("click", () => {
    const team = chip.dataset.team;
    if (state.teamFilter === team) {
      // Deselect if clicking the same team
      state.teamFilter = null;
      elements.teamChips.forEach(c => c.classList.remove("is-active"));
    } else {
      // Select new team
      state.teamFilter = team;
      elements.teamChips.forEach(c => {
        c.classList.toggle("is-active", c.dataset.team === team);
      });
    }
    renderTimeline();
  });
}

// Avengers Assemble button event listener
elements.avengersAssembleBtn.addEventListener("click", () => {
  state.avengersAssembleActive = !state.avengersAssembleActive;
  
  if (state.avengersAssembleActive) {
    elements.avengersAssembleBtn.classList.add("is-active");
  } else {
    elements.avengersAssembleBtn.classList.remove("is-active");
  }
  
  renderTimeline();
});

// Defenders Assemble button event listener
elements.defendersAssembleBtn.addEventListener("click", () => {
  state.defendersAssembleActive = !state.defendersAssembleActive;
  
  if (state.defendersAssembleActive) {
    elements.defendersAssembleBtn.classList.add("is-active");
  } else {
    elements.defendersAssembleBtn.classList.remove("is-active");
  }
  
  renderTimeline();
});

// Saga filter chips - multiple selection allowed
for (const chip of elements.sagaChips) {
  chip.addEventListener("click", () => {
    const saga = chip.dataset.saga;
    
    // Toggle saga in the Set
    if (state.sagaFilters.has(saga)) {
      state.sagaFilters.delete(saga);
      chip.classList.remove("is-active");
    } else {
      state.sagaFilters.add(saga);
      chip.classList.add("is-active");
    }
    
    // Allow deselecting all sagas - will show everything
    // No minimum requirement anymore
    
    renderTimeline();
  });
}

// Initialize theme
applyTheme(state.theme);

loadWatchlist().then(() => {
  // Render character filters after data is loaded
  renderCharacterFilters();
}).catch((error) => {
  elements.timeline.innerHTML = `<p class="load-error">${error.message}</p>`;
});


// Mobile enhancements
function initMobileEnhancements() {
  // Create scroll-to-top button
  const scrollButton = document.createElement("button");
  scrollButton.id = "scrollToTop";
  scrollButton.className = "scroll-to-top";
  scrollButton.setAttribute("aria-label", "Scroll to top");
  scrollButton.innerHTML = "↑";
  document.body.appendChild(scrollButton);

  // Show/hide scroll button based on scroll position
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (window.scrollY > 500) {
        scrollButton.classList.add("visible");
      } else {
        scrollButton.classList.remove("visible");
      }
    }, 100);
  });

  // Scroll to top on click
  scrollButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Prevent zoom on double-tap for buttons (iOS)
  const buttons = document.querySelectorAll("button, .chip, .character-chip, .block-chip");
  buttons.forEach(button => {
    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      button.click();
    }, { passive: false });
  });

  // Add haptic feedback for mobile interactions (if supported)
  if ("vibrate" in navigator) {
    const interactiveElements = document.querySelectorAll("button, .chip, .character-chip, .block-chip, .read-button");
    interactiveElements.forEach(element => {
      element.addEventListener("click", () => {
        navigator.vibrate(10); // Short vibration
      });
    });
  }

  // Improve mobile search experience
  const searchInput = elements.searchInput;
  if (searchInput) {
    // Clear search on escape key
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        searchInput.blur();
        state.query = "";
        renderTimeline();
      }
    });

    // Add clear button for mobile
    const clearButton = document.createElement("button");
    clearButton.className = "search-clear";
    clearButton.setAttribute("aria-label", "Clear search");
    clearButton.innerHTML = "×";
    clearButton.style.display = "none";
    searchInput.parentElement.appendChild(clearButton);

    searchInput.addEventListener("input", () => {
      clearButton.style.display = searchInput.value ? "block" : "none";
    });

    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      state.query = "";
      clearButton.style.display = "none";
      renderTimeline();
    });
  }
}

// Initialize mobile enhancements after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileEnhancements);
} else {
  initMobileEnhancements();
}
