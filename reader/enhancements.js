/* ============================================
   MCU DOOMSDAY READER - JAVASCRIPT ENHANCEMENTS
   ============================================ */

// ===== TRIVIA DATA =====
const triviaData = {
  1: { postCredits: 2, scenes: ["Thor appears asking for Strange's help to find Odin", "Mordo confronts Jonathan Pangborn and steals his magic"], trivia: ["Benedict Cumberbatch performed many of his own stunts", "The Ancient One's death scene was shot in one take", "The film features over 1,000 VFX shots"], connections: ["Thor: Ragnarok", "Avengers: Infinity War"] },
  2: { postCredits: 2, scenes: ["Adrian Toomes protects Spider-Man's identity in prison", "Captain America's patience PSA (joke scene)"], trivia: ["Tom Holland did his own stunts including the Washington Monument climb", "The film has over 2,800 VFX shots", "Donald Glover's character is Miles Morales' uncle in the comics"], connections: ["Avengers: Endgame", "Spider-Man: Far From Home"] },
  3: { postCredits: 2, scenes: ["Thor and Loki's ship is approached by a massive vessel (Thanos)", "Grandmaster faces angry revolutionaries"], trivia: ["80% of the dialogue was improvised", "Taika Waititi voiced Korg via motion capture", "The film was inspired by 1980s sci-fi aesthetics"], connections: ["Avengers: Infinity War", "Thor: Love and Thunder"] },
  4: { postCredits: 2, scenes: ["T'Challa reveals Wakanda's true nature to the UN", "Bucky Barnes awakens in Wakanda"], trivia: ["First superhero film nominated for Best Picture at the Oscars", "Wakandan language is based on Xhosa", "The film won 3 Academy Awards"], connections: ["Avengers: Infinity War", "Black Panther: Wakanda Forever"] },
  5: { postCredits: 1, scenes: ["Valentina Allegra de Fontaine recruits Yelena to kill Hawkeye"], trivia: ["Set between Civil War and Infinity War", "Florence Pugh did 90% of her own stunts", "The Red Room was inspired by real Soviet programs"], connections: ["Hawkeye", "Thunderbolts*"] },
  6: { postCredits: 2, scenes: ["Scott enters the Quantum Realm as the Pym family is dusted", "Giant ant plays drums (joke scene)"], trivia: ["Michelle Pfeiffer's de-aging used no CGI, only makeup", "The film has over 2,000 VFX shots", "Paul Rudd improvised many of his lines"], connections: ["Avengers: Endgame", "Ant-Man and the Wasp: Quantumania"] },
  7: { postCredits: 1, scenes: ["Nick Fury sends a distress signal to Captain Marvel before being dusted"], trivia: ["Largest cast in MCU history at the time", "Robert Downey Jr. kept food hidden on set and ate during takes", "The Snap was filmed with actors not knowing who would be dusted"], connections: ["Avengers: Endgame", "Captain Marvel"] },
  8: { postCredits: 0, scenes: ["No traditional post-credits scene, only the sound of Tony forging his first armor"], trivia: ["Highest-grossing film of all time (briefly)", "The final battle scene took 3 months to film", "Robert Downey Jr. improvised 'I am Iron Man'", "Over 3,000 VFX shots in the film"], connections: ["Spider-Man: Far From Home", "Loki", "WandaVision"] },
  9: { postCredits: 2, scenes: ["Mysterio reveals Spider-Man's identity to the world", "Nick Fury is revealed to be Talos; real Fury is in space"], trivia: ["First MCU film set after Endgame", "Jake Gyllenhaal performed his own stunts", "The illusion sequences used practical effects and CGI"], connections: ["Spider-Man: No Way Home", "Secret Invasion"] },
  10: { postCredits: 1, scenes: ["Wanda studies the Darkhold in astral form while hearing her children"], trivia: ["Each episode mimics a different sitcom era", "Elizabeth Olsen studied classic sitcoms for months", "The show has over 300 VFX shots per episode", "Paul Bettany finally got to act with himself as Vision and White Vision"], connections: ["Doctor Strange in the Multiverse of Madness", "Agatha: Darkhold Diaries"] },
  11: { postCredits: 0, scenes: [], trivia: ["Anthony Mackie did his own stunts including the opening helicopter sequence", "The show explores PTSD and racial issues in America", "Isaiah Bradley's story is based on the Tuskegee experiments"], connections: ["Captain America: Brave New World", "Thunderbolts*"] },
  12: { postCredits: 1, scenes: ["Full 'Rogers: The Musical' performance"], trivia: ["Hailee Steinfeld did her own archery training", "The show was filmed during the COVID-19 pandemic", "Lucky the Pizza Dog is based on the comics character"], connections: ["Echo", "Daredevil: Born Again"] },
  13: { postCredits: 2, scenes: ["Wong, Bruce Banner, and Carol Danvers analyze the Ten Rings", "Xialing takes over her father's organization"], trivia: ["Simu Liu did 95% of his own stunts", "The bus fight scene was shot in one continuous take", "The Ten Rings' origin remains a mystery"], connections: ["The Marvels", "Shang-Chi 2"] },
  14: { postCredits: 2, scenes: ["Zeus sends Hercules to kill Thor", "Jane Foster arrives in Valhalla"], trivia: ["Christian Bale improvised much of Gorr's dialogue", "Natalie Portman trained for 10 months to get in shape", "The film features the most Guns N' Roses songs in any movie"], connections: ["Thor 5", "Hercules appearance"] },
  17: { postCredits: 2, scenes: ["Eddie Brock returns to his universe, leaving a Venom symbiote behind", "Doctor Strange in the Multiverse of Madness trailer"], trivia: ["Kept the three Spider-Men secret until release", "Andrew Garfield lied about his involvement for months", "The film grossed over $1.9 billion worldwide", "Tom Holland cried when he first saw Tobey and Andrew in costume"], connections: ["Doctor Strange in the Multiverse of Madness", "Venom 3"] },
  18: { postCredits: 2, scenes: ["Clea recruits Strange to fix an incursion", "Strange develops a third eye (joke scene)"], trivia: ["Sam Raimi's first superhero film since Spider-Man 3", "The film features the most variants of any MCU film", "John Krasinski appears as Reed Richards", "Bruce Campbell has his traditional Sam Raimi cameo"], connections: ["Loki Season 2", "Avengers: Secret Wars"] },
  19: { postCredits: 2, scenes: ["Kang variants gather in the Quantum Realm", "Loki and Mobius investigate a Kang variant in 1901"], trivia: ["Introduces Kang the Conqueror as the next big bad", "Jonathan Majors plays multiple Kang variants", "The Quantum Realm was entirely CGI", "MODOK's design was controversial among fans"], connections: ["Loki Season 2", "Avengers: The Kang Dynasty"] },
  20: { postCredits: 1, scenes: ["Shuri meets T'Challa's son in Haiti"], trivia: ["Tribute to Chadwick Boseman throughout the film", "Namor speaks Mayan language", "Rihanna returned to music for the soundtrack", "The film was rewritten after Boseman's passing"], connections: ["Ironheart", "Wakanda series"] },
  21: { postCredits: 1, scenes: ["Monica Rambeau wakes up in a parallel universe with Binary and Beast"], trivia: ["Shortest MCU film at 105 minutes", "Features the first musical number in the MCU", "Kamala Khan forms the Young Avengers", "The three leads trained together for months"], connections: ["X-Men integration", "Young Avengers"] },
  22: { postCredits: 1, scenes: ["Deadpool and Wolverine's adventure continues (details TBD)"], trivia: ["First R-rated MCU film", "Hugh Jackman returns as Wolverine after Logan", "Integrates Fox's X-Men universe into MCU", "Ryan Reynolds and Hugh Jackman improvised extensively"], connections: ["Avengers: Secret Wars", "X-Men reboot"] },
  23: { postCredits: 2, scenes: ["Details TBD - Film not yet released"], trivia: ["Anthony Mackie's first film as Captain America", "Harrison Ford debuts as Thunderbolt Ross/Red Hulk", "Features the Serpent Society as villains", "Tim Blake Nelson returns as The Leader"], connections: ["Thunderbolts*", "World War Hulk"] },
  24: { postCredits: 2, scenes: ["Details TBD - Film not yet released"], trivia: ["The asterisk in the title is intentional and mysterious", "Features anti-heroes and reformed villains", "Florence Pugh returns as Yelena Belova", "Sebastian Stan returns as Bucky Barnes"], connections: ["Captain America: Brave New World", "Avengers: Doomsday"] },
  27: { postCredits: 0, scenes: [], trivia: ["Charlie Cox and Vincent D'Onofrio return from Netflix series", "18-episode season, longest MCU Disney+ series", "Continues storylines from the Netflix show", "Features a darker, more mature tone"], connections: ["Echo", "Spider-Man 4"] },
  30: { postCredits: 2, scenes: ["Details TBD - Film not yet released"], trivia: ["Robert Downey Jr. returns as Doctor Doom", "Largest MCU cast ever assembled", "Directed by the Russo Brothers", "Culmination of the Multiverse Saga"], connections: ["Avengers: Secret Wars"] }
};

// ===== TOAST NOTIFICATION SYSTEM =====
class ToastManager {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;
    
    this.container.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

const toast = new ToastManager();

// ===== PARALLAX SCROLLING FOR HEADER =====
function initParallax() {
  const doomsdayLogo = document.querySelector('.doomsday-logo');
  if (!doomsdayLogo) return;
  
  doomsdayLogo.classList.add('parallax');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxOffset = scrolled * 0.3;
    doomsdayLogo.style.setProperty('--parallax-offset', `${parallaxOffset}px`);
  }, { passive: true });
}

// ===== CONCEPT BADGES =====
function addConceptBadges() {
  const cards = document.querySelectorAll('.timeline-card');
  
  cards.forEach(card => {
    // Check if badge already exists
    if (card.querySelector('.concept-badge')) return;
    
    const key = parseInt(card.dataset.key);
    const score = window.conceptScores?.[key] || 0;
    
    if (score > 0) {
      const badge = document.createElement('div');
      badge.className = `concept-badge ${score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low'}`;
      badge.textContent = `${score} Concept${score > 1 ? 's' : ''}`;
      badge.title = 'Number of key Doomsday concepts in this title';
      
      const cardBody = card.querySelector('.card-body');
      if (cardBody) {
        cardBody.appendChild(badge);
      }
    }
  });
}

// ===== TRIVIA & EASTER EGGS =====
function addTriviaToCards() {
  const cards = document.querySelectorAll('.timeline-card');
  
  cards.forEach(card => {
    // Check if trivia already exists
    if (card.querySelector('.trivia-toggle')) return;
    
    const key = parseInt(card.dataset.key);
    const trivia = triviaData[key];
    
    if (!trivia) return;
    
    // Create trivia toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'trivia-toggle';
    toggleButton.innerHTML = `
      <span class="trivia-icon">🎬</span>
      <span>Easter Eggs & Trivia</span>
    `;
    
    // Create trivia content container
    const triviaContent = document.createElement('div');
    triviaContent.className = 'trivia-content';
    
    let contentHTML = '';
    
    // Post-credits scenes
    if (trivia.postCredits > 0) {
      contentHTML += `
        <div class="trivia-section">
          <h4 class="trivia-heading">
            <span class="trivia-heading-icon">🎞️</span>
            Post-Credits Scenes
            <span class="post-credits-count">${trivia.postCredits}</span>
          </h4>
          ${trivia.scenes.map(scene => `
            <div class="post-credit-scene">${scene}</div>
          `).join('')}
        </div>
      `;
    }
    
    // Fun trivia
    if (trivia.trivia && trivia.trivia.length > 0) {
      contentHTML += `
        <div class="trivia-section">
          <h4 class="trivia-heading">
            <span class="trivia-heading-icon">💡</span>
            Fun Facts
          </h4>
          <ul class="trivia-list">
            ${trivia.trivia.map(fact => `<li>${fact}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    // Connections
    if (trivia.connections && trivia.connections.length > 0) {
      contentHTML += `
        <div class="trivia-section">
          <h4 class="trivia-heading">
            <span class="trivia-heading-icon">🔗</span>
            Connections
          </h4>
          <ul class="connections-list">
            ${trivia.connections.map(conn => `
              <li class="connection-tag">${conn}</li>
            `).join('')}
          </ul>
        </div>
      `;
    }
    
    if (!contentHTML) {
      contentHTML = '<div class="no-trivia">No trivia available yet</div>';
    }
    
    triviaContent.innerHTML = contentHTML;
    
    // Toggle functionality
    toggleButton.addEventListener('click', () => {
      const isExpanded = toggleButton.classList.contains('active');
      toggleButton.classList.toggle('active');
      triviaContent.classList.toggle('expanded');
      
      // Analytics
      if (!isExpanded) {
        console.log(`Trivia opened for: ${card.querySelector('h3')?.textContent}`);
      }
    });
    
    // Add to card
    const cardActions = card.querySelector('.card-actions');
    if (cardActions) {
      cardActions.appendChild(toggleButton);
      cardActions.appendChild(triviaContent);
    }
  });
}

// ===== BLOCK COLOR CODING =====
function applyBlockColors() {
  const cards = document.querySelectorAll('.timeline-card');
  
  cards.forEach(card => {
    const key = parseInt(card.dataset.key);
    if (isNaN(key)) return;
    
    let blockNum = 1;
    if (key >= 9 && key <= 14) blockNum = 2;
    else if (key >= 15 && key <= 22) blockNum = 3;
    else if (key >= 23 && key <= 30) blockNum = 4;
    
    card.setAttribute('data-block', blockNum);
  });
}

// ===== FLIP CARD ANIMATION =====
function addFlipAnimation(card) {
  card.classList.add('flipping');
  setTimeout(() => card.classList.remove('flipping'), 600);
}

// ===== NEXT TO WATCH PULSE =====
function highlightNextToWatch() {
  const cards = document.querySelectorAll('.timeline-card');
  cards.forEach(card => card.classList.remove('next-to-watch'));
  
  const nextCard = Array.from(cards).find(card => 
    !card.classList.contains('is-read') && !card.dataset.key.startsWith('B')
  );
  
  if (nextCard) {
    nextCard.classList.add('next-to-watch');
  }
}

// ===== PROGRESS MILESTONES =====
function checkMilestones(percent) {
  const milestones = [25, 50, 75, 100];
  const achieved = localStorage.getItem('mcu-milestones') || '[]';
  const achievedMilestones = JSON.parse(achieved);
  
  milestones.forEach(milestone => {
    if (percent >= milestone && !achievedMilestones.includes(milestone)) {
      achievedMilestones.push(milestone);
      localStorage.setItem('mcu-milestones', JSON.stringify(achievedMilestones));
      showMilestone(milestone);
    }
  });
}

function showMilestone(percent) {
  const messages = {
    25: 'Quarter Way There! 🎯',
    50: 'Halfway to Doomsday! 🔥',
    75: 'Almost Ready! ⚡',
    100: 'Doomsday Ready! 🏆'
  };
  
  toast.show(messages[percent], 'success', 5000);
  
  // Add milestone badge to status panel
  const statusPanel = document.querySelector('.status-panel');
  if (statusPanel && !document.querySelector(`.milestone-${percent}`)) {
    const badge = document.createElement('div');
    badge.className = `milestone-badge milestone-${percent}`;
    badge.textContent = messages[percent];
    statusPanel.appendChild(badge);
    
    setTimeout(() => badge.remove(), 8000);
  }
}

// ===== PULL TO REFRESH =====
function initPullToRefresh() {
  if (!('ontouchstart' in window)) return;
  
  let startY = 0;
  let currentY = 0;
  let pulling = false;
  
  const indicator = document.createElement('div');
  indicator.className = 'pull-to-refresh';
  indicator.innerHTML = '<span class="spinner"></span> Pull to refresh';
  document.body.appendChild(indicator);
  
  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].pageY;
      pulling = true;
    }
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    currentY = e.touches[0].pageY;
    const diff = currentY - startY;
    
    if (diff > 80) {
      indicator.classList.add('visible');
    }
  }, { passive: true });
  
  document.addEventListener('touchend', () => {
    if (pulling && currentY - startY > 80) {
      indicator.innerHTML = '<span class="spinner"></span> Refreshing...';
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      indicator.classList.remove('visible');
    }
    pulling = false;
  });
}

// ===== FLOATING ACTION BUTTON =====
function initFAB() {
  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.innerHTML = '⚡';
  fab.title = 'Quick Actions';
  fab.setAttribute('aria-label', 'Quick actions menu');
  
  fab.addEventListener('click', () => {
    // Toggle bottom sheet or show quick actions
    const bottomSheet = document.querySelector('.bottom-sheet');
    if (bottomSheet) {
      bottomSheet.classList.toggle('open');
      document.querySelector('.bottom-sheet-backdrop')?.classList.toggle('visible');
    } else {
      // Scroll to top as fallback
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.show('Scrolled to top', 'info', 2000);
    }
  });
  
  document.body.appendChild(fab);
}

// ===== BOTTOM SHEET FILTERS (MOBILE) =====
function initBottomSheet() {
  if (window.innerWidth > 768) return;
  
  const backdrop = document.createElement('div');
  backdrop.className = 'bottom-sheet-backdrop';
  
  const sheet = document.createElement('div');
  sheet.className = 'bottom-sheet';
  sheet.innerHTML = `
    <div class="bottom-sheet-handle"></div>
    <div class="bottom-sheet-content">
      <h3>Quick Filters</h3>
      <div id="mobile-filters"></div>
    </div>
  `;
  
  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);
  
  // Move filters to bottom sheet
  const filters = document.querySelector('.controls-panel');
  if (filters) {
    const mobileFilters = document.getElementById('mobile-filters');
    mobileFilters.appendChild(filters.cloneNode(true));
  }
  
  backdrop.addEventListener('click', () => {
    sheet.classList.remove('open');
    backdrop.classList.remove('visible');
  });
  
  // Swipe down to close
  let startY = 0;
  sheet.addEventListener('touchstart', (e) => {
    startY = e.touches[0].pageY;
  }, { passive: true });
  
  sheet.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].pageY;
    if (currentY - startY > 50) {
      sheet.classList.remove('open');
      backdrop.classList.remove('visible');
    }
  }, { passive: true });
}

// ===== CHARACTER TIMELINE GRAPH =====
function createCharacterTimeline() {
  const panel = document.getElementById('characterTimelinePanel');
  if (!panel) return;
  
  // Set panel heading
  const heading = document.createElement('h2');
  heading.textContent = 'Character Appearances';
  panel.appendChild(heading);
  
  const container = document.createElement('div');
  container.className = 'character-timeline';
  
  // Count character appearances
  const characterCounts = {};
  document.querySelectorAll('.timeline-card').forEach(card => {
    const who = card.querySelector('.why')?.textContent || '';
    const characters = ['Thor', 'Loki', 'Strange', 'Spider-Man', 'Wanda', 'Captain America'];
    
    characters.forEach(char => {
      if (who.includes(char)) {
        characterCounts[char] = (characterCounts[char] || 0) + 1;
      }
    });
  });
  
  // Create bars
  const maxCount = Math.max(...Object.values(characterCounts), 1);
  Object.entries(characterCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([char, count]) => {
      const row = document.createElement('div');
      row.className = 'character-timeline-row';
      row.innerHTML = `
        <div class="character-name">${char}</div>
        <div class="character-bar">
          <div class="character-bar-fill" style="width: ${(count / maxCount) * 100}%"></div>
        </div>
        <div class="character-count">${count}</div>
      `;
      container.appendChild(row);
    });
  
  panel.appendChild(container);
}

// ===== CONCEPT HEATMAP =====
function createConceptHeatmap() {
  const panel = document.getElementById('conceptHeatmapPanel');
  if (!panel || !window.conceptScores) return;
  
  // Set panel heading
  const heading = document.createElement('h2');
  heading.textContent = 'Concept Density';
  panel.appendChild(heading);
  
  const container = document.createElement('div');
  container.className = 'concept-heatmap';
  container.innerHTML = '<div class="heatmap-grid"></div>';
  
  const grid = container.querySelector('.heatmap-grid');
  
  // Create cells for each title
  Object.entries(window.conceptScores).forEach(([key, score]) => {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.setAttribute('data-intensity', Math.min(score, 5));
    cell.textContent = key;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'heatmap-tooltip';
    tooltip.textContent = `Title ${key}: ${score} concepts`;
    cell.appendChild(tooltip);
    
    cell.addEventListener('click', () => {
      const card = document.querySelector(`[data-key="${key}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.animation = 'none';
        setTimeout(() => {
          card.style.animation = 'cardSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 10);
      }
    });
    
    grid.appendChild(cell);
  });
  
  panel.appendChild(container);
}

// ===== ENHANCED READ BUTTON HANDLER =====
function enhanceReadButtons() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.read-button').forEach(button => {
      if (button.dataset.enhanced) return;
      button.dataset.enhanced = 'true';
      
      const originalClick = button.onclick;
      button.onclick = function(e) {
        const card = this.closest('.timeline-card');
        addFlipAnimation(card);
        
        if (originalClick) {
          originalClick.call(this, e);
        }
        
        setTimeout(() => {
          highlightNextToWatch();
          addConceptBadges(); // Re-add badges after render
          applyBlockColors(); // Re-apply block colors after render
          addTriviaToCards(); // Re-add trivia after render
          
          // Check milestones
          const main = Array.from(document.querySelectorAll('.timeline-card'))
            .filter(c => !c.dataset.key.startsWith('B'));
          const mainRead = main.filter(c => c.classList.contains('is-read')).length;
          const percent = Math.round((mainRead / main.length) * 100);
          checkMilestones(percent);
          
          // Show toast
          const isRead = card.classList.contains('is-read');
          const title = card.querySelector('h3')?.textContent || 'Title';
          toast.show(
            isRead ? `Marked "${title}" as watched ✓` : `Unmarked "${title}"`,
            isRead ? 'success' : 'info',
            2000
          );
        }, 300);
      };
    });
  });
  
  observer.observe(document.getElementById('timeline'), {
    childList: true,
    subtree: true
  });
}

// ===== SMOOTH SCROLL ENHANCEMENTS =====
function enhanceScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchInput')?.focus();
      toast.show('Search focused', 'info', 1500);
    }
    
    // Escape: Clear search
    if (e.key === 'Escape') {
      const searchInput = document.getElementById('searchInput');
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        toast.show('Search cleared', 'info', 1500);
      }
    }
  });
}

// ===== PERFORMANCE MONITORING =====
function monitorPerformance() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });
    observer.observe({ entryTypes: ['measure'] });
  }
}

// ===== INITIALIZATION =====
function initEnhancements() {
  console.log('🎨 Initializing MCU Doomsday Reader Enhancements...');
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
    return;
  }
  
  // Wait for main app to load
  setTimeout(() => {
    try {
      initParallax();
      enhanceReadButtons();
      enhanceScrolling();
      initKeyboardShortcuts();
      initPullToRefresh();
      initFAB();
      initBottomSheet();
      monitorPerformance();
      
      // Wait for timeline to render
      const checkTimeline = setInterval(() => {
        const cards = document.querySelectorAll('.timeline-card');
        if (cards.length > 0) {
          clearInterval(checkTimeline);
          applyBlockColors();
          addConceptBadges();
          addTriviaToCards();
          highlightNextToWatch();
          createCharacterTimeline();
          createConceptHeatmap();
          
          console.log('✨ All enhancements loaded successfully!');
          toast.show('Enhanced UI loaded! 🎨', 'success', 3000);
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => clearInterval(checkTimeline), 5000);
      
    } catch (error) {
      console.error('Error initializing enhancements:', error);
      toast.show('Some enhancements failed to load', 'error', 3000);
    }
  }, 500);
}

// Auto-initialize
initEnhancements();

// Export for external use
window.MCUEnhancements = {
  toast,
  addConceptBadges,
  applyBlockColors,
  highlightNextToWatch,
  checkMilestones,
  addTriviaToCards,
  triviaData
};

// Made with Bob
