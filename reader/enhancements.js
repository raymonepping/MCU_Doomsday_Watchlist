/* ============================================
   MCU DOOMSDAY READER - JAVASCRIPT ENHANCEMENTS
   ============================================ */

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
  const panel = document.querySelector('.stats-panel');
  if (!panel) return;
  
  const container = document.createElement('div');
  container.className = 'character-timeline';
  container.innerHTML = '<h3>Character Appearances</h3>';
  
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
  const panel = document.querySelector('.stats-panel');
  if (!panel || !window.conceptScores) return;
  
  const container = document.createElement('div');
  container.className = 'concept-heatmap';
  container.innerHTML = '<h3>Concept Density Map</h3><div class="heatmap-grid"></div>';
  
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
  checkMilestones
};

// Made with Bob
