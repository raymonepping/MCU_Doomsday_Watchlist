const readStorageKey = "mcu-doomsday-reader.read";
const localeStorageKey = "mcu-doomsday-reader.locale";
const defaultLocale = "en";
const supportedLocales = new Set(["en", "nl"]);

const state = {
  items: [],
  labels: {},
  read: new Set(JSON.parse(localStorage.getItem(readStorageKey) || "[]")),
  query: "",
  filter: "all",
  locale: getInitialLocale(),
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
};

function getInitialLocale() {
  const saved = localStorage.getItem(localeStorageKey);
  return supportedLocales.has(saved) ? saved : defaultLocale;
}

function label(key) {
  return state.labels[key] || key;
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
    [item.key, item.title, item.kind, item.runtime, item.what, item.why, item.when, item.who]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query);

  const filterMatch =
    state.filter === "all" ||
    (state.filter === "main" && !item.bonus) ||
    (state.filter === "bonus" && item.bonus) ||
    (state.filter === "unread" && !state.read.has(item.key));

  return textMatch && filterMatch;
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

function renderTimeline() {
  const matches = state.items.filter(matchesFilters);
  const fragment = document.createDocumentFragment();

  for (const item of matches) {
    const card = elements.template.content.firstElementChild.cloneNode(true);
    const read = state.read.has(item.key);

    card.dataset.key = item.key;
    card.classList.toggle("is-read", read);
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
  state.read.clear();
  saveReadState();
  render();
});

loadWatchlist().catch((error) => {
  elements.timeline.innerHTML = `<p class="load-error">${error.message}</p>`;
});
