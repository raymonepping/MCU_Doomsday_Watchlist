const storageKey = "mcu-doomsday-reader.read";

const state = {
  items: [],
  read: new Set(JSON.parse(localStorage.getItem(storageKey) || "[]")),
  query: "",
  filter: "all",
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
};

function saveReadState() {
  localStorage.setItem(storageKey, JSON.stringify([...state.read].sort(sortKeys)));
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

function renderStatus() {
  const main = state.items.filter((item) => !item.bonus);
  const bonus = state.items.filter((item) => item.bonus);
  const mainRead = main.filter((item) => state.read.has(item.key)).length;
  const bonusRead = bonus.filter((item) => state.read.has(item.key)).length;
  const percent = main.length ? Math.round((mainRead / main.length) * 100) : 0;
  const next = main.find((item) => !state.read.has(item.key));

  elements.mainStatus.textContent = `${mainRead} / ${main.length}`;
  elements.bonusStatus.textContent = `${bonusRead} / ${bonus.length}`;
  elements.nextTitle.textContent = next ? `${next.key}. ${next.title}` : "Main timeline complete";
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressRing.style.setProperty("--progress", `${percent}%`);
}

function renderSearchResult(matches) {
  const query = state.query.trim();
  if (!query) {
    elements.searchResult.textContent = "Showing full timeline.";
    return;
  }

  if (matches.length === 0) {
    elements.searchResult.textContent = `No results for "${query}".`;
    return;
  }

  const positions = matches.map((item) => `${item.key}. ${item.title}`).join(" | ");
  elements.searchResult.textContent = `Position${matches.length === 1 ? "" : "s"}: ${positions}`;
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
      item.bonus ? " | Bonus X-Men" : ""
    }`;
    card.querySelector("h3").textContent = item.title;
    card.querySelector(".summary").textContent = item.what || "No summary available.";
    card.querySelector(".why").textContent = item.why || "No context available.";
    card.querySelector(".when").textContent = item.when || "No timeline note available.";

    const button = card.querySelector(".read-button");
    button.textContent = read ? "Read" : "Mark read";
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
  renderStatus();
  renderTimeline();
}

async function loadWatchlist() {
  const response = await fetch("./data/watchlist.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load watchlist: ${response.status}`);
  }
  const payload = await response.json();
  state.items = payload.items;
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

elements.resetButton.addEventListener("click", () => {
  state.read.clear();
  saveReadState();
  render();
});

loadWatchlist().catch((error) => {
  elements.timeline.innerHTML = `<p class="load-error">${error.message}</p>`;
});
