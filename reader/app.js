const readStorageKey = "mcu-doomsday-reader.read";
const localeStorageKey = "mcu-doomsday-reader.locale";
const themeStorageKey = "mcu-doomsday-reader.theme";
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
};

// Block definitions based on key ranges
const blocks = [
  { name: "The Legacy", range: [1, 8], color: "#e62429" },
  { name: "The New Guard", range: [9, 14], color: "#f3c969" },
  { name: "The Multiverse Fracture", range: [15, 22], color: "#5fb4ff" },
  { name: "The Finale", range: [23, 30], color: "#55d68b" },
];

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
};

function getInitialLocale() {
  const saved = localStorage.getItem(localeStorageKey);
  return supportedLocales.has(saved) ? saved : defaultLocale;
}

function getInitialTheme() {
  const saved = localStorage.getItem(themeStorageKey);
  return saved === "light" ? "light" : "dark";
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

  return textMatch && filterMatch && characterMatch && blockMatch;
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
}

function renderTimeline() {
  // Use block view if enabled
  if (state.timelineView === 'blocks') {
    renderBlockView();
    return;
  }

  // Default card view
  const matches = state.items.filter(matchesFilters);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < matches.length; i++) {
    const item = matches[i];
    const card = elements.template.content.firstElementChild.cloneNode(true);
    const read = state.read.has(item.key);

    card.dataset.key = item.key;
    card.classList.toggle("is-read", read);
    card.style.setProperty("--animation-order", i);
    card.querySelector(".position").textContent = item.key;
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
