// ============================================
// PHASE 16: CHARACTER NETWORK GRAPH
// ============================================

let characterNetworkData = null;

/**
 * Load character network data
 */
async function loadCharacterNetwork() {
  try {
    const response = await fetch('./data/character-network.json');
    characterNetworkData = await response.json();
    console.log('[Network] Character network data loaded:', Object.keys(characterNetworkData.characters).length, 'characters');
    return characterNetworkData;
  } catch (error) {
    console.error('[Network] Failed to load character network data:', error);
    return null;
  }
}

/**
 * Create character network visualization container
 */
function createCharacterNetworkContainer() {
  const container = document.createElement('div');
  container.className = 'character-network-container';
  container.innerHTML = `
    <div class="network-header">
      <div>
        <h2 class="network-title">🕸️ Character Network Graph</h2>
        <p class="network-subtitle">Explore connections, Infinity Stones, teams, and villain relationships</p>
      </div>
      <div class="network-controls">
        <button class="network-tab active" data-view="connections">Character Connections</button>
        <button class="network-tab" data-view="stones">Infinity Stones</button>
        <button class="network-tab" data-view="teams">Team Formations</button>
        <button class="network-tab" data-view="villains">Villain Networks</button>
      </div>
    </div>
    <div class="network-content">
      <!-- Content will be dynamically inserted here -->
    </div>
  `;
  
  // Add event listeners for tabs
  const tabs = container.querySelectorAll('.network-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.dataset.view;
      updateNetworkView(view, container);
    });
  });
  
  return container;
}

/**
 * Update network view based on selected tab
 */
function updateNetworkView(view, container) {
  const contentDiv = container.querySelector('.network-content');
  
  switch(view) {
    case 'connections':
      contentDiv.innerHTML = createCharacterConnectionsView();
      initializeCharacterCanvas();
      break;
    case 'stones':
      contentDiv.innerHTML = createInfinityStonesView();
      break;
    case 'teams':
      contentDiv.innerHTML = createTeamFormationsView();
      break;
    case 'villains':
      contentDiv.innerHTML = createVillainNetworksView();
      break;
  }
}

/**
 * Create character connections view with canvas
 */
function createCharacterConnectionsView() {
  return `
    <div class="network-canvas-wrapper">
      <canvas id="character-network-canvas"></canvas>
    </div>
    <div class="network-legend">
      <div class="legend-item">
        <div class="legend-color" style="background: #c8102e;"></div>
        <span>Heroes</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #4b0082;"></div>
        <span>Villains</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #006400;"></div>
        <span>Anti-Heroes</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: rgba(255, 215, 0, 0.3); border-style: dashed;"></div>
        <span>Connections</span>
      </div>
    </div>
  `;
}

/**
 * Initialize character network canvas
 */
function initializeCharacterCanvas() {
  const canvas = document.getElementById('character-network-canvas');
  if (!canvas || !characterNetworkData) return;
  
  const ctx = canvas.getContext('2d');
  const wrapper = canvas.parentElement;
  
  // Set canvas size
  canvas.width = wrapper.clientWidth;
  canvas.height = wrapper.clientHeight;
  
  // Prepare nodes
  const characters = characterNetworkData.characters;
  const nodes = Object.entries(characters).map(([id, char], index) => {
    const angle = (index / Object.keys(characters).length) * Math.PI * 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;
    return {
      id,
      x: canvas.width / 2 + Math.cos(angle) * radius,
      y: canvas.height / 2 + Math.sin(angle) * radius,
      radius: 8,
      color: char.color,
      name: char.name,
      type: char.type,
      connections: char.connections || []
    };
  });
  
  // Draw connections
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
  ctx.lineWidth = 1;
  nodes.forEach(node => {
    node.connections.forEach(connId => {
      const targetNode = nodes.find(n => n.id === connId);
      if (targetNode) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
      }
    });
  });
  
  // Draw nodes
  nodes.forEach(node => {
    // Outer glow
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 2);
    gradient.addColorStop(0, node.color + '80');
    gradient.addColorStop(1, node.color + '00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Node circle
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Add interactivity
  let tooltip = null;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hoveredNode = nodes.find(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius * 2;
    });
    
    if (hoveredNode) {
      canvas.style.cursor = 'pointer';
      showTooltip(hoveredNode, e.clientX, e.clientY);
    } else {
      canvas.style.cursor = 'grab';
      hideTooltip();
    }
  });
  
  canvas.addEventListener('mouseleave', hideTooltip);
  
  function showTooltip(node, x, y) {
    hideTooltip();
    tooltip = document.createElement('div');
    tooltip.className = 'character-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-name">${node.name}</div>
      <div class="tooltip-info">
        Type: ${node.type}<br>
        Connections: ${node.connections.length}
      </div>
    `;
    tooltip.style.left = x + 10 + 'px';
    tooltip.style.top = y + 10 + 'px';
    document.body.appendChild(tooltip);
  }
  
  function hideTooltip() {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
  }
  
  console.log('[Network] Character canvas initialized with', nodes.length, 'nodes');
}

/**
 * Create Infinity Stones tracking view
 */
function createInfinityStonesView() {
  if (!characterNetworkData) return '<p>Loading...</p>';
  
  const stones = characterNetworkData.infinityStones;
  let html = '<div class="infinity-stone-tracker">';
  
  Object.entries(stones).forEach(([id, stone]) => {
    html += `
      <div class="stone-card ${id}">
        <div class="stone-icon"></div>
        <div class="stone-name">${stone.name}</div>
        <div class="stone-appearances">${stone.appearances.length} appearances</div>
        <div class="stone-appearances">${stone.power}</div>
      </div>
    `;
  });
  
  html += '</div>';
  
  // Add detailed timeline
  html += '<div class="team-timeline"><h3 class="network-title">Infinity Stone Timeline</h3>';
  html += '<div class="timeline-track"><div class="timeline-line"></div><div class="timeline-events">';
  
  // Collect all stone events
  const events = [];
  Object.entries(stones).forEach(([id, stone]) => {
    stone.appearances.forEach(titleNum => {
      events.push({
        title: titleNum,
        stone: stone.name,
        color: stone.color
      });
    });
  });
  
  // Sort by title number
  events.sort((a, b) => a.title - b.title);
  
  // Group by title
  const groupedEvents = {};
  events.forEach(event => {
    if (!groupedEvents[event.title]) {
      groupedEvents[event.title] = [];
    }
    groupedEvents[event.title].push(event);
  });
  
  Object.entries(groupedEvents).forEach(([titleNum, stoneEvents]) => {
    html += `
      <div class="timeline-event">
        <div class="timeline-marker" style="background: ${stoneEvents[0].color};"></div>
        <div class="timeline-content">
          <div class="timeline-title">Title #${titleNum}</div>
          <div class="timeline-members">
            ${stoneEvents.map(e => e.stone.split(' ')[0]).join(', ')}
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div></div></div>';
  
  return html;
}

/**
 * Create team formations timeline view
 */
function createTeamFormationsView() {
  if (!characterNetworkData) return '<p>Loading...</p>';
  
  const teams = characterNetworkData.teams;
  let html = '';
  
  Object.entries(teams).forEach(([teamId, team]) => {
    html += `
      <div class="team-timeline">
        <h3 class="network-title" style="color: ${team.color};">${team.name}</h3>
        <div class="timeline-track">
          <div class="timeline-line" style="background: linear-gradient(90deg, 
            ${team.color}30 0%, ${team.color}80 50%, ${team.color}30 100%);"></div>
          <div class="timeline-events">
    `;
    
    team.formations.forEach(formation => {
      html += `
        <div class="timeline-event">
          <div class="timeline-marker" style="background: ${team.color};"></div>
          <div class="timeline-content">
            <div class="timeline-title">Title #${formation.title}</div>
            <div class="timeline-title" style="font-size: 0.8rem; color: rgba(255,255,255,0.8);">${formation.event}</div>
            <div class="timeline-members">${formation.members.length} members</div>
          </div>
        </div>
      `;
    });
    
    html += '</div></div></div>';
  });
  
  return html;
}

/**
 * Create villain networks view
 */
function createVillainNetworksView() {
  if (!characterNetworkData) return '<p>Loading...</p>';
  
  const villainNetworks = characterNetworkData.villainRelationships;
  let html = '<div class="villain-network"><h3 class="network-title">Villain Relationship Webs</h3>';
  html += '<div class="villain-web-container">';
  
  Object.entries(villainNetworks).forEach(([networkId, network]) => {
    html += `
      <div class="villain-node">
        <div class="villain-central">${network.central.replace(/-/g, ' ').toUpperCase()}</div>
        <div class="villain-type">${network.type}</div>
        <div class="villain-connections">
          <strong>Allies:</strong> ${network.allies.join(', ').replace(/-/g, ' ')}
          <strong>Enemies:</strong> ${network.enemies.join(', ').replace(/-/g, ' ')}
        </div>
      </div>
    `;
  });
  
  html += '</div></div>';
  return html;
}

/**
 * Initialize Phase 16: Character Network Graph
 */
async function initializeCharacterNetwork() {
  console.log('[Network] Initializing Phase 16: Character Network Graph...');
  
  // Load character network data
  await loadCharacterNetwork();
  
  if (!characterNetworkData) {
    console.error('[Network] Failed to initialize - no data loaded');
    return;
  }
  
  // Create network container
  const networkContainer = createCharacterNetworkContainer();
  
  // Insert after convergence dashboard
  const convergenceDashboard = document.querySelector('.convergence-dashboard');
  if (convergenceDashboard) {
    convergenceDashboard.after(networkContainer);
  } else {
    // Fallback: insert before watchlist
    const watchlist = document.querySelector('.watchlist');
    if (watchlist) {
      watchlist.before(networkContainer);
    }
  }
  
  // Initialize default view (character connections)
  updateNetworkView('connections', networkContainer);
  
  console.log('[Network] Phase 16 initialization complete!');
}

/* ============================================
   PHASE 15: CONVERGENCE ANALYSIS LAYER
   ============================================ */

// Load convergence data
let convergenceData = {};

async function loadConvergenceData() {
  try {
    const response = await fetch('./data/convergence-data.json');
    convergenceData = await response.json();
    console.log('[Convergence] Data loaded:', Object.keys(convergenceData).length, 'titles');
    return convergenceData;
  } catch (error) {
    console.error('[Convergence] Failed to load data:', error);
    return {};
  }
}

// Get control mechanism class
function getControlClass(mechanism) {
  const map = {
    'Military hierarchy': 'military',
    'Military experiment': 'military',
    'Corporate governance': 'corporate',
    'Weak oversight': 'corporate',
    'Monarchy': 'monarchy',
    'Monarchy collapse': 'monarchy',
    'Monarchy evolution': 'monarchy',
    'SHIELD coordination': 'intelligence',
    'Intelligence agency': 'intelligence',
    'Intelligence': 'intelligence',
    'Individual autonomy': 'individual',
    'Individual responsibility': 'individual',
    'Individual heroism': 'individual',
    'Individual power': 'individual',
    'Personal sacrifice': 'individual',
    'Mystic order': 'mystic',
    'Mystic governance': 'mystic',
    'Scientific stewardship': 'scientific',
    'Scientific leadership': 'scientific',
    'Scientific collaboration': 'scientific',
    'Scientific dictatorship': 'scientific',
    'Family structure': 'family',
    'Family hierarchy': 'family',
    'Chaos': 'chaos',
    'No control': 'chaos'
  };
  
  for (const [key, value] of Object.entries(map)) {
    if (mechanism.includes(key)) return value;
  }
  return 'individual';
}

// Add governance badges to cards
function addGovernanceBadges() {
  const cards = document.querySelectorAll('.timeline-card');
  
  cards.forEach(card => {
    const key = card.dataset.key;
    const convergence = convergenceData[key];
    
    if (!convergence || card.querySelector('.governance-badge')) return;
    
    const controlClass = getControlClass(convergence.controlMechanism);
    const badge = document.createElement('div');
    badge.className = `governance-badge gov-${controlClass}`;
    badge.innerHTML = `🏛️ ${convergence.controlMechanism}`;
    badge.title = `Control Mechanism: ${convergence.controlMechanism}`;
    
    // Add to card front
    const cardFront = card.querySelector('.card-front .card-body') || card.querySelector('.card-body');
    if (cardFront) {
      cardFront.appendChild(badge);
    }
  });
  
  console.log('[Convergence] Added governance badges to', cards.length, 'cards');
}

// Add saga arc badges
function addSagaArcBadges() {
  const cards = document.querySelectorAll('.timeline-card');
  
  cards.forEach(card => {
    const key = card.dataset.key;
    const convergence = convergenceData[key];
    
    if (!convergence || card.querySelector('.saga-arc-badge')) return;
    
    const sagaClass = convergence.saga.toLowerCase();
    const badge = document.createElement('div');
    badge.className = `saga-arc-badge saga-${sagaClass}`;
    badge.textContent = convergence.arc;
    badge.title = `${convergence.saga} Saga: ${convergence.arc}`;
    
    // Add to card front
    const cardFront = card.querySelector('.card-front') || card;
    cardFront.style.position = 'relative';
    cardFront.appendChild(badge);
  });
}

// Enhanced card back with convergence data
function enhanceCardBackWithConvergence(item) {
  const convergence = convergenceData[item.key];
  if (!convergence) return '';
  
  return `
    <div class="convergence-section">
      <div class="convergence-title">
        <span>🎯</span>
        <span>Convergence Analysis</span>
      </div>
      
      <div class="allegiance-badge">
        👥 ${convergence.allegiance}
      </div>
      
      <div class="convergence-grid">
        <div class="convergence-item control">
          <div class="convergence-label">🏛️ Control Mechanism</div>
          <div class="convergence-value">${convergence.controlMechanism}</div>
        </div>
        
        <div class="convergence-item failure">
          <div class="convergence-label">⚠️ Failure Implication</div>
          <div class="convergence-value">${convergence.failureImplication}</div>
        </div>
        
        <div class="convergence-item point">
          <div class="convergence-label">🔗 Convergence Point</div>
          <div class="convergence-value">${convergence.convergence}</div>
        </div>
        
        <div class="convergence-item topic">
          <div class="convergence-label">📖 Topic</div>
          <div class="convergence-value">${convergence.topic}</div>
        </div>
      </div>
      
      <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 6px;">
        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">
          <strong style="color: var(--gov-monarchy);">Narrative Context:</strong><br>
          ${convergence.saga} Saga → ${convergence.arc}
        </div>
      </div>
    </div>
  `;
}

// Create convergence dashboard
function createConvergenceDashboard() {
  const existingDashboard = document.querySelector('.convergence-dashboard');
  if (existingDashboard) return;
  
  const dashboard = document.createElement('div');
  dashboard.className = 'convergence-dashboard';
  dashboard.innerHTML = `
    <div class="dashboard-header">
      <div class="dashboard-title">
        <span>🧩</span>
        <span>Convergence Analysis</span>
      </div>
      <button class="dashboard-toggle" onclick="toggleConvergenceView()">
        Toggle View
      </button>
    </div>
    
    <div class="convergence-stats">
      <div class="stat-card infinity">
        <div class="stat-label">Infinity Saga</div>
        <div class="stat-value" id="infinity-count">0</div>
        <div class="stat-description">Centralized control failure</div>
      </div>
      
      <div class="stat-card multiverse">
        <div class="stat-label">Multiverse Saga</div>
        <div class="stat-value" id="multiverse-count">0</div>
        <div class="stat-description">Fragmented control failure</div>
      </div>
      
      <div class="stat-card control">
        <div class="stat-label">Control Mechanisms</div>
        <div class="stat-value" id="control-count">0</div>
        <div class="stat-description">Governance models tracked</div>
      </div>
      
      <div class="stat-card failure">
        <div class="stat-label">Convergence Points</div>
        <div class="stat-value" id="convergence-count">0</div>
        <div class="stat-description">Major narrative nodes</div>
      </div>
    </div>
    
    <div id="stakes-panel"></div>
    <div id="narrative-arc-timeline"></div>
    <div id="allegiance-network"></div>
  `;
  
  // Insert before timeline grid
  const timelineGrid = document.querySelector('.timeline-grid');
  if (timelineGrid) {
    timelineGrid.parentNode.insertBefore(dashboard, timelineGrid);
  }
  
  updateConvergenceStats();
  createStakesPanel();
  createNarrativeArcTimeline();
  createAllegianceNetwork();
}

// Update convergence statistics
function updateConvergenceStats() {
  const items = window.state?.items || [];
  
  const infinityCount = items.filter(item => {
    const conv = convergenceData[item.key];
    return conv && conv.saga === 'Infinity';
  }).length;
  
  const multiverseCount = items.filter(item => {
    const conv = convergenceData[item.key];
    return conv && conv.saga === 'Multiverse';
  }).length;
  
  const controlMechanisms = new Set();
  const convergencePoints = new Set();
  
  items.forEach(item => {
    const conv = convergenceData[item.key];
    if (conv) {
      controlMechanisms.add(conv.controlMechanism);
      convergencePoints.add(conv.convergence);
    }
  });
  
  const infinityEl = document.getElementById('infinity-count');
  const multiverseEl = document.getElementById('multiverse-count');
  const controlEl = document.getElementById('control-count');
  const convergenceEl = document.getElementById('convergence-count');
  
  if (infinityEl) infinityEl.textContent = infinityCount;
  if (multiverseEl) multiverseEl.textContent = multiverseCount;
  if (controlEl) controlEl.textContent = controlMechanisms.size;
  if (convergenceEl) convergenceEl.textContent = convergencePoints.size;
  
  // Animate counters
  if (infinityEl) animateCounter(infinityEl, 0, infinityCount, 1000);
  if (multiverseEl) animateCounter(multiverseEl, 0, multiverseCount, 1000);
  if (controlEl) animateCounter(controlEl, 0, controlMechanisms.size, 1000);
  if (convergenceEl) animateCounter(convergenceEl, 0, convergencePoints.size, 1000);
}

// Create "What's at Stake" panel
function createStakesPanel() {
  const panel = document.getElementById('stakes-panel');
  if (!panel) return;
  
  const items = window.state?.items || [];
  const unwatchedItems = items.filter(item => !item.watched && !item.bonus);
  
  const criticalFailures = unwatchedItems
    .map(item => convergenceData[item.key])
    .filter(conv => conv && (
      conv.failureImplication.includes('extinction') ||
      conv.failureImplication.includes('collapse') ||
      conv.failureImplication.includes('destruction')
    ));
  
  const riskLevel = (criticalFailures.length / unwatchedItems.length) * 100;
  
  panel.innerHTML = `
    <div class="stakes-panel">
      <div class="stakes-header">
        <div class="stakes-icon">⚠️</div>
        <div class="stakes-title">What's at Stake</div>
      </div>
      
      <div class="stakes-meter">
        <div class="stakes-fill" style="width: ${riskLevel}%">
          ${Math.round(riskLevel)}% Risk
        </div>
      </div>
      
      <ul class="stakes-list">
        ${criticalFailures.slice(0, 5).map(conv => `
          <li><strong>${conv.title}:</strong> ${conv.failureImplication}</li>
        `).join('')}
        ${criticalFailures.length > 5 ? `<li>...and ${criticalFailures.length - 5} more critical threats</li>` : ''}
      </ul>
    </div>
  `;
}

// Create narrative arc timeline
function createNarrativeArcTimeline() {
  const container = document.getElementById('narrative-arc-timeline');
  if (!container) return;
  
  const arcs = {};
  Object.values(convergenceData).forEach(conv => {
    if (!arcs[conv.arc]) {
      arcs[conv.arc] = { count: 0, saga: conv.saga };
    }
    arcs[conv.arc].count++;
  });
  
  const arcOrder = [
    'Foundations of Heroes',
    'Formation & SHIELD Collapse',
    'Expansion (Cosmic / Street / Science)',
    'Collapse Toward Infinity War',
    'Endgame Arc',
    'Identity & Aftermath',
    'Multiverse Opens',
    'New Generation',
    'Global & Cosmic Instability',
    'Kang Setup & Collapse',
    'Anti-Hero & Street Power',
    'Final Convergence'
  ];
  
  const arcClassMap = {
    'Foundations of Heroes': 'foundations',
    'Formation & SHIELD Collapse': 'formation',
    'Expansion (Cosmic / Street / Science)': 'expansion',
    'Collapse Toward Infinity War': 'collapse',
    'Endgame Arc': 'endgame',
    'Identity & Aftermath': 'identity',
    'Multiverse Opens': 'multiverse-opens',
    'New Generation': 'new-generation',
    'Global & Cosmic Instability': 'instability',
    'Kang Setup & Collapse': 'collapse',
    'Anti-Hero & Street Power': 'instability',
    'Final Convergence': 'final'
  };
  
  container.innerHTML = `
    <div class="narrative-arc-timeline">
      <h3 style="color: var(--gov-monarchy); margin-bottom: 1.5rem; font-size: 1.3rem;">
        📈 Narrative Arc Timeline
      </h3>
      <div class="arc-track">
        ${arcOrder.filter(arc => arcs[arc]).map(arc => `
          <div class="arc-node ${arcClassMap[arc]}" onclick="filterByArc('${arc}')">
            <div class="arc-name">${arc}</div>
            <div class="arc-count">${arcs[arc].count} titles</div>
            <div class="arc-count" style="margin-top: 0.25rem; color: ${arcs[arc].saga === 'Infinity' ? '#ff6b35' : '#667eea'};">
              ${arcs[arc].saga} Saga
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Create allegiance network
function createAllegianceNetwork() {
  const container = document.getElementById('allegiance-network');
  if (!container) return;
  
  const allegiances = {};
  Object.values(convergenceData).forEach(conv => {
    if (!allegiances[conv.allegiance]) {
      allegiances[conv.allegiance] = 0;
    }
    allegiances[conv.allegiance]++;
  });
  
  const allegiancePositions = {
    'Avengers': { x: 50, y: 30 },
    'Guardians': { x: 20, y: 50 },
    'Defenders': { x: 80, y: 50 },
    'Young Avengers': { x: 35, y: 70 },
    'Mystic Arts': { x: 65, y: 70 },
    'Wakanda': { x: 50, y: 90 },
    'Fantastic Four': { x: 15, y: 30 },
    'X-Men': { x: 85, y: 30 },
    'Eternals': { x: 10, y: 70 },
    'Midnight Sons': { x: 90, y: 70 },
    'SHIELD': { x: 30, y: 10 },
    'TVA': { x: 70, y: 10 },
    'New Avengers': { x: 50, y: 50 }
  };
  
  const allegianceClasses = {
    'Avengers': 'avengers',
    'Guardians': 'guardians',
    'Defenders': 'defenders',
    'Young Avengers': 'young-avengers',
    'Mystic Arts': 'mystic-arts',
    'Wakanda': 'wakanda'
  };
  
  container.innerHTML = `
    <div class="allegiance-network">
      <h3 style="color: var(--gov-individual); margin-bottom: 1.5rem; font-size: 1.3rem;">
        🕸️ Allegiance Network
      </h3>
      ${Object.entries(allegiances).map(([allegiance, count]) => {
        const pos = allegiancePositions[allegiance] || { x: 50, y: 50 };
        const className = allegianceClasses[allegiance] || 'avengers';
        return `
          <div class="network-node ${className}" 
               style="left: ${pos.x}%; top: ${pos.y}%;"
               onclick="filterByAllegiance('${allegiance}')"
               title="${allegiance}: ${count} titles">
            ${allegiance}<br><small>(${count})</small>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Filter functions
function filterByArc(arc) {
  console.log('[Convergence] Filtering by arc:', arc);
  // Implement filtering logic
  toast.show(`Filtering by: ${arc}`, 'info', 3000);
}

function filterByAllegiance(allegiance) {
  console.log('[Convergence] Filtering by allegiance:', allegiance);
  toast.show(`Filtering by: ${allegiance}`, 'info', 3000);
}

// Toggle convergence view
function toggleConvergenceView() {
  const dashboard = document.querySelector('.convergence-dashboard');
  const button = dashboard.querySelector('.dashboard-toggle');
  
  button.classList.toggle('active');
  
  const isActive = button.classList.contains('active');
  
  if (isActive) {
    // Show detailed view
    document.getElementById('stakes-panel').style.display = 'block';
    document.getElementById('narrative-arc-timeline').style.display = 'block';
    document.getElementById('allegiance-network').style.display = 'block';
    button.textContent = 'Hide Details';
  } else {
    // Show compact view
    document.getElementById('stakes-panel').style.display = 'none';
    document.getElementById('narrative-arc-timeline').style.display = 'none';
    document.getElementById('allegiance-network').style.display = 'none';
    button.textContent = 'Show Details';
  }
}

// Add thematic filters
function addThematicFilters() {
  const existingFilters = document.querySelector('.theme-filters');
  if (existingFilters) return;
  
  const themes = new Set();
  Object.values(convergenceData).forEach(conv => {
    themes.add(conv.topic);
  });
  
  const filterContainer = document.createElement('div');
  filterContainer.className = 'theme-filters';
  filterContainer.innerHTML = `
    <h3 style="width: 100%; color: var(--gov-mystic); margin-bottom: 0.5rem; font-size: 1.1rem;">
      🎭 Thematic Filters
    </h3>
    ${Array.from(themes).sort().map(theme => `
      <div class="theme-chip" onclick="filterByTheme('${theme}')">
        ${theme}
      </div>
    `).join('')}
  `;
  
  const controlsPanel = document.querySelector('.controls-panel');
  if (controlsPanel) {
    controlsPanel.appendChild(filterContainer);
  }
}

function filterByTheme(theme) {
  console.log('[Convergence] Filtering by theme:', theme);
  
  // Toggle chip active state
  const chips = document.querySelectorAll('.theme-chip');
  let isActive = false;
  chips.forEach(chip => {
    if (chip.textContent.trim() === theme) {
      chip.classList.toggle('active');
      isActive = chip.classList.contains('active');
    }
  });
  
  // Filter cards
  const cards = document.querySelectorAll('.timeline-card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const key = card.dataset.key;
    const data = convergenceData[key];
    
    if (!data) {
      card.style.display = '';
      return;
    }
    
    // Check if any active theme filters match
    const activeChips = document.querySelectorAll('.theme-chip.active');
    if (activeChips.length === 0) {
      // No filters active, show all
      card.style.display = '';
      visibleCount++;
    } else {
      // Check if card matches any active theme
      let matches = false;
      activeChips.forEach(activeChip => {
        const activeTheme = activeChip.textContent.trim();
        if (data.topic && data.topic.toLowerCase().includes(activeTheme.toLowerCase())) {
          matches = true;
        }
      });
      
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    }
  });
  
  // Update message
  const activeFilters = document.querySelectorAll('.theme-chip.active').length;
  if (activeFilters === 0) {
    toast.show(`Showing all titles`, 'info', 2000);
  } else {
    toast.show(`Filtering by ${activeFilters} theme(s): ${visibleCount} titles match`, 'info', 3000);
  }
}

// Initialize Phase 15
async function initConvergenceLayer() {
  console.log('[Convergence] Initializing Phase 15: Convergence Analysis Layer...');
  
  await loadConvergenceData();
  
  if (Object.keys(convergenceData).length === 0) {
    console.error('[Convergence] No data loaded, skipping initialization');
    return;
  }
  
  createConvergenceDashboard();
  addGovernanceBadges();
  addSagaArcBadges();
  addThematicFilters();
  
  // Enhance existing flip card generation
  const originalGenerateTriviaContent = window.generateTriviaContent;
  if (originalGenerateTriviaContent) {
    window.generateTriviaContent = function(item) {
      const originalContent = originalGenerateTriviaContent(item);
      const convergenceContent = enhanceCardBackWithConvergence(item);
      return originalContent + convergenceContent;
    };
  }
  
  console.log('[Convergence] Phase 15 initialization complete!');
}

// Make functions globally available
window.toggleConvergenceView = toggleConvergenceView;
window.filterByArc = filterByArc;
window.filterByAllegiance = filterByAllegiance;
window.filterByTheme = filterByTheme;

/* ============================================
   PHASE 14: PWA SUPPORT
   ============================================ */

// Service Worker Registration
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Workers not supported');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('./sw.js', {
      scope: './'
    });
    
    console.log('[PWA] Service Worker registered:', registration.scope);
    
    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('[PWA] New Service Worker found');
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version available
          showUpdateNotification();
        }
      });
    });
    
    // Cache poster images after registration
    if (registration.active) {
      cachePosters();
    }
    
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
  }
}

// Show update notification
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <div class="update-content">
      <span class="update-icon">🔄</span>
      <div class="update-text">
        <strong>Update Available</strong>
        <p>A new version is ready to install</p>
      </div>
      <button class="update-btn" onclick="updateApp()">Update Now</button>
      <button class="update-dismiss" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('visible'), 100);
}

// Update app
function updateApp() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  }
}

// Cache poster images
async function cachePosters() {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return;
  }
  
  const posterUrls = [];
  for (let i = 1; i <= 45; i++) {
    const num = i.toString().padStart(2, '0');
    posterUrls.push(`./assets/posters/${num}.jpg`);
  }
  
  // Add bonus posters
  posterUrls.push('./assets/posters/B1.jpg');
  posterUrls.push('./assets/posters/B2.jpg');
  posterUrls.push('./assets/posters/B3.jpg');
  
  navigator.serviceWorker.controller.postMessage({
    type: 'CACHE_URLS',
    urls: posterUrls
  });
  
  console.log('[PWA] Requested caching of', posterUrls.length, 'posters');
}

// Install prompt
let deferredPrompt;

function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] Install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });
  
  // Track installation
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;
    hideInstallButton();
    toast.show('App installed successfully! 🎉', 'success', 5000);
  });
}

// Show install button
function showInstallButton() {
  const installBtn = document.createElement('button');
  installBtn.className = 'install-btn';
  installBtn.innerHTML = `
    <span class="install-icon">📱</span>
    <span class="install-text">Install App</span>
  `;
  installBtn.onclick = promptInstall;
  
  // Add to header or create floating button
  const header = document.querySelector('.site-header');
  if (header) {
    header.appendChild(installBtn);
  } else {
    installBtn.classList.add('floating');
    document.body.appendChild(installBtn);
  }
}

// Hide install button
function hideInstallButton() {
  const installBtn = document.querySelector('.install-btn');
  if (installBtn) {
    installBtn.remove();
  }
}

// Prompt installation
async function promptInstall() {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available');
    return;
  }
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log('[PWA] User choice:', outcome);
  
  if (outcome === 'accepted') {
    toast.show('Installing app...', 'info', 3000);
  }
  
  deferredPrompt = null;
  hideInstallButton();
}

// Check if running as PWA
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// PWA-specific UI adjustments
function adjustPWAUI() {
  if (isPWA()) {
    document.body.classList.add('pwa-mode');
    console.log('[PWA] Running in standalone mode');
    
    // Hide browser-specific elements
    const browserElements = document.querySelectorAll('.browser-only');
    browserElements.forEach(el => el.style.display = 'none');
    
    // Add PWA badge
    const header = document.querySelector('.site-header');
    if (header && !header.querySelector('.pwa-badge')) {
      const badge = document.createElement('div');
      badge.className = 'pwa-badge';
      badge.textContent = 'App Mode';
      badge.title = 'Running as installed app';
      header.appendChild(badge);
    }
  }
}

// Online/Offline status
function initOnlineStatus() {
  function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    document.body.classList.toggle('offline', !isOnline);
    
    if (!isOnline) {
      toast.show('You are offline. Using cached data.', 'warning', 5000);
    } else if (document.body.classList.contains('was-offline')) {
      toast.show('Back online! Syncing data...', 'success', 3000);
      // Trigger sync if needed
      syncData();
    }
    
    document.body.classList.toggle('was-offline', !isOnline);
  }
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Initial check
  updateOnlineStatus();
}

// Sync data when back online
async function syncData() {
  if (!navigator.onLine) return;
  
  console.log('[PWA] Syncing data...');
  
  // Reload JSON data
  try {
    const response = await fetch('./data/watchlist.en.json');
    if (response.ok) {
      const data = await response.json();
      console.log('[PWA] Data synced successfully');
    }
  } catch (error) {
    console.error('[PWA] Sync failed:', error);
  }
}

// Background sync registration
async function registerBackgroundSync() {
  if (!('serviceWorker' in navigator) || !('sync' in ServiceWorkerRegistration.prototype)) {
    console.log('[PWA] Background Sync not supported');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-watchlist');
    console.log('[PWA] Background sync registered');
  } catch (error) {
    console.error('[PWA] Background sync registration failed:', error);
  }
}

// Share API integration
async function shareProgress() {
  const watched = window.state?.items?.filter(item => item.watched && !item.bonus).length || 0;
  const total = window.state?.items?.filter(item => !item.bonus).length || 45;
  const percent = Math.round((watched / total) * 100);
  
  const shareData = {
    title: 'MCU Doomsday Reader',
    text: `I've watched ${watched}/${total} MCU titles (${percent}%) on my journey to Avengers: Doomsday! 🎬`,
    url: window.location.href
  };
  
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      console.log('[PWA] Shared successfully');
      toast.show('Shared successfully!', 'success', 3000);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[PWA] Share failed:', error);
      }
    }
  } else {
    // Fallback: copy to clipboard
    const text = `${shareData.text}\n${shareData.url}`;
    await navigator.clipboard.writeText(text);
    toast.show('Link copied to clipboard!', 'success', 3000);
  }
}

// Add share button
function addShareButton() {
  const statsPanel = document.querySelector('.status-panel');
  if (!statsPanel || statsPanel.querySelector('.share-btn')) return;
  
  const shareBtn = document.createElement('button');
  shareBtn.className = 'share-btn';
  shareBtn.innerHTML = '📤 Share Progress';
  shareBtn.onclick = shareProgress;
  
  statsPanel.appendChild(shareBtn);
}

// Initialize all PWA features
function initPWA() {
  console.log('[PWA] Initializing Progressive Web App features...');
  
  registerServiceWorker();
  initInstallPrompt();
  adjustPWAUI();
  initOnlineStatus();
  registerBackgroundSync();
  addShareButton();
  
  console.log('[PWA] Initialization complete');
}

/* ============================================
   PHASE 13: ENHANCED ANIMATIONS
   ============================================ */

// Enhanced Parallax Scrolling
function initEnhancedParallax() {
  console.log('Initializing enhanced parallax...');
  
  const parallaxElements = [
    { selector: '.doomsday-logo', speed: 0.3 },
    { selector: '.site-header', speed: 0.15 },
    { selector: '.phase-timeline-bar', speed: 0.1 }
  ];
  
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.scrollY;
    
    parallaxElements.forEach(({ selector, speed }) => {
      const element = document.querySelector(selector);
      if (element) {
        const offset = scrolled * speed;
        element.style.transform = `translateY(${offset}px)`;
      }
    });
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
  console.log('Initializing scroll animations...');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe sections
  const sections = document.querySelectorAll('.controls-panel, .status-panel, .phase-timeline-bar');
  sections.forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
  });
}

// Smooth scroll to element
function smoothScrollTo(element, offset = 0) {
  const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

// Add smooth scroll to anchor links
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        smoothScrollTo(target, 80);
      }
    });
  });
}

// Animated counter for stats
function animateCounter(element, start, end, duration = 1000) {
  const range = end - start;
  const increment = range / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.round(current);
  }, 16);
}

// Animate stats when they come into view
function initStatsAnimation() {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statValue = entry.target.querySelector('.stat-value');
        if (statValue && !statValue.dataset.animated) {
          const endValue = parseInt(statValue.textContent);
          statValue.dataset.animated = 'true';
          animateCounter(statValue, 0, endValue, 1500);
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
  });
}

// Add ripple effect to buttons
function addRippleEffect(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// Apply ripple to all buttons
function initRippleEffects() {
  const buttons = document.querySelectorAll('.btn, button, .phase-chip, .filter-chip');
  buttons.forEach(button => {
    button.addEventListener('click', addRippleEffect);
  });
}

// Stagger card animations on filter change
function staggerCardAnimations() {
  const cards = document.querySelectorAll('.timeline-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.05}s`;
    card.classList.remove('timeline-card');
    // Force reflow
    void card.offsetWidth;
    card.classList.add('timeline-card');
  });
}

// Enhanced progress ring animation
function animateProgressRing(ring, percent) {
  const circle = ring.querySelector('.progress-ring-circle');
  if (!circle) return;
  
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;
  
  // Trigger animation
  setTimeout(() => {
    circle.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
    circle.style.strokeDashoffset = offset;
  }, 100);
}

// Animate all progress rings
function initProgressRingAnimations() {
  const rings = document.querySelectorAll('.progress-ring');
  rings.forEach(ring => {
    const percentText = ring.querySelector('.progress-text');
    if (percentText) {
      const percent = parseInt(percentText.textContent);
      animateProgressRing(ring, percent);
    }
  });
}

// Page transition effect
function initPageTransition() {
  document.body.classList.add('page-transition');
}

// Scroll indicator bounce
function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      indicator.style.opacity = '0';
    } else {
      indicator.style.opacity = '1';
    }
  }, { passive: true });
}

// Enhanced card entrance on scroll
function initCardEntranceAnimations() {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.timeline-card').forEach(card => {
    card.style.animationPlayState = 'paused';
    cardObserver.observe(card);
  });
}

// Micro-interaction: Button press feedback
function initButtonFeedback() {
  document.addEventListener('click', (e) => {
    const button = e.target.closest('button, .btn, .phase-chip, .filter-chip');
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 100);
    }
  });
}

// Initialize all Phase 13 animations
function initEnhancedAnimations() {
  console.log('Initializing Phase 13: Enhanced Animations...');
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    console.log('Reduced motion preferred - skipping complex animations');
    return;
  }
  
  initEnhancedParallax();
  initScrollAnimations();
  initSmoothScrollLinks();
  initStatsAnimation();
  initRippleEffects();
  initProgressRingAnimations();
  initPageTransition();
  initScrollIndicator();
  initCardEntranceAnimations();
  initButtonFeedback();
  
  console.log('Phase 13 animations initialized successfully!');
}

/* ============================================
   PHASE 12: INTERACTIVE FLIP CARDS
   ============================================ */

// Initialize flip card functionality
function initializeFlipCards() {
  console.log('Initializing flip cards...');
  
  // Add flip buttons and card structure to all timeline cards
  const timelineCards = document.querySelectorAll('.timeline-card');
  
  timelineCards.forEach((card, index) => {
    // Skip if already initialized
    if (card.querySelector('.flip-button')) return;
    
    const itemKey = card.dataset.key;
    const item = window.state?.items?.find(i => i.key === itemKey);
    
    if (!item) return;
    
    // Wrap existing content in card-front
    const existingContent = card.innerHTML;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">
          ${existingContent}
          <button class="flip-button" aria-label="Show trivia" title="Show trivia">
            <span aria-hidden="true">ℹ️</span>
          </button>
          <div class="hover-info-overlay">
            <p class="hover-info-text">Click ℹ️ to see trivia, Easter eggs, and more!</p>
          </div>
        </div>
        <div class="card-face card-back">
          <div class="card-back-content">
            ${generateTriviaContent(item)}
          </div>
          <button class="flip-button" aria-label="Show poster" title="Back to poster">
            <span aria-hidden="true">🎬</span>
          </button>
        </div>
      </div>
    `;
    
    // Add click handlers to flip buttons
    const flipButtons = card.querySelectorAll('.flip-button');
    flipButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCardFlip(card);
      });
    });
    
    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const flipButton = card.querySelector('.flip-button');
        if (flipButton) flipButton.click();
      }
    });
  });
  
  console.log(`Initialized ${timelineCards.length} flip cards`);
}

// Toggle card flip state
function toggleCardFlip(card) {
  card.classList.add('flipping');
  card.classList.toggle('flipped');
  
  // Remove flipping class after animation
  setTimeout(() => {
    card.classList.remove('flipping');
  }, 600);
  
  // Update ARIA label
  const isFlipped = card.classList.contains('flipped');
  const flipButton = card.querySelector('.flip-button');
  if (flipButton) {
    flipButton.setAttribute('aria-label', isFlipped ? 'Show poster' : 'Show trivia');
  }
}

// Generate trivia content for card back
function generateTriviaContent(item) {
  const trivia = triviaData[item.key];
  
  if (!trivia) {
    return `
      <h3 class="card-back-title">${item.title}</h3>
      <p style="color: rgba(255,255,255,0.7); font-style: italic;">Trivia coming soon!</p>
    `;
  }
  
  let content = `<h3 class="card-back-title">${item.title}</h3>`;
  
  // Post-credits scenes
  if (trivia.postCredits) {
    const count = trivia.postCredits.count || 0;
    const scenes = trivia.postCredits.scenes || [];
    content += `
      <div class="trivia-section">
        <div class="post-credits-info">
          <div class="post-credits-count">🎬 ${count} Post-Credits Scene${count !== 1 ? 's' : ''}</div>
          ${scenes.length > 0 ? `<div style="font-size: 0.8rem; margin-top: 0.25rem;">${scenes.join(' • ')}</div>` : ''}
        </div>
      </div>
    `;
  }
  
  // Trivia facts
  if (trivia.trivia && trivia.trivia.length > 0) {
    content += `
      <div class="trivia-section">
        <div class="trivia-section-title">🎯 Trivia</div>
        <ul class="trivia-list">
          ${trivia.trivia.map(fact => `<li>${fact}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Easter eggs
  if (trivia.easterEggs && trivia.easterEggs.length > 0) {
    content += `
      <div class="trivia-section">
        <div class="trivia-section-title">🥚 Easter Eggs</div>
        <ul class="trivia-list">
          ${trivia.easterEggs.map(egg => `<li>${egg}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  // Stan Lee cameo
  if (trivia.stanLeeCameo) {
    content += `
      <div class="trivia-section">
        <div class="stan-lee-cameo">
          <strong>👴 Stan Lee Cameo:</strong> ${trivia.stanLeeCameo}
        </div>
      </div>
    `;
  }
  
  // Connections
  if (trivia.connections && trivia.connections.length > 0) {
    content += `
      <div class="trivia-section">
        <div class="trivia-section-title">🔗 MCU Connections</div>
        <ul class="trivia-list">
          ${trivia.connections.map(conn => `<li>${conn}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  
  return content;
}

// Re-initialize flip cards when items are filtered or state changes
function reinitializeFlipCards() {
  // Wait for DOM to update
  setTimeout(() => {
    initializeFlipCards();
  }, 100);
}

// Listen for state changes to reinitialize cards
if (window.state) {
  const originalSetState = window.setState;
  window.setState = function(newState) {
    originalSetState(newState);
    reinitializeFlipCards();
  };
}

/* ============================================
   MCU DOOMSDAY READER - JAVASCRIPT ENHANCEMENTS
   ============================================ */

// ===== TRIVIA DATA =====
const triviaData = {
  // ===== PHASE 1 (2008-2012) =====
  
  1: { // Iron Man (2008)
    postCredits: 1,
    scenes: ["Nick Fury approaches Tony Stark about the Avengers Initiative"],
    trivia: [
      "The film that started the MCU and changed cinema forever",
      "Robert Downey Jr. improvised the iconic 'I am Iron Man' line at the end",
      "Jeff Bridges shaved his head for the role of Obadiah Stane",
      "The Mark I armor was a practical suit that weighed 90 pounds",
      "Gwyneth Paltrow's blue dress in the final scene cost $5,000"
    ],
    easterEggs: [
      "Captain America's shield can be seen on Tony's workbench in his workshop",
      "The Ten Rings terrorist organization connects to Shang-Chi",
      "J.A.R.V.I.S. is named after Edwin Jarvis, Howard Stark's butler from the comics"
    ],
    connections: ["Iron Man 2", "The Avengers", "Iron Man 3"],
    stanLeeCameo: "Tony Stark mistakes Stan Lee for Hugh Hefner at a party and says 'You look great, Hef!'"
  },

  2: { // The Incredible Hulk (2008)
    postCredits: 1,
    scenes: ["Tony Stark meets General Ross at a bar, hinting at the Avengers Initiative"],
    trivia: [
      "Edward Norton was replaced by Mark Ruffalo in later films",
      "The opening credits sequence replaces the entire origin story",
      "Lou Ferrigno (original TV Hulk) voices the Hulk and has a cameo as a security guard",
      "The film was shot in Toronto, standing in for New York City",
      "Tim Roth performed many of his own stunts as Emil Blonsky"
    ],
    easterEggs: [
      "Captain America can be seen frozen in ice in a deleted scene",
      "Nick Fury appears on a monitor in a deleted scene",
      "The Super Soldier Serum connects directly to Captain America"
    ],
    connections: ["The Avengers", "She-Hulk", "Captain America: Civil War"],
    stanLeeCameo: "Drinks a soda contaminated with Bruce Banner's blood, inadvertently poisoning himself"
  },

  3: { // Iron Man 2 (2010)
    postCredits: 1,
    scenes: ["Agent Coulson discovers Thor's hammer in the New Mexico desert"],
    trivia: [
      "Mickey Rourke did not wear prosthetic teeth; those are his real teeth",
      "Scarlett Johansson trained for months to perform Black Widow's fight scenes",
      "The Monaco Grand Prix sequence took two weeks to film",
      "Sam Rockwell improvised much of Justin Hammer's dialogue and dance moves",
      "The film introduces S.H.I.E.L.D. more prominently than any previous MCU film"
    ],
    easterEggs: [
      "A map in Fury's office shows 'hot spots' including Wakanda and Atlantis",
      "The Stark Expo design is based on the 1964 World's Fair",
      "Captain America's shield is used to level Tony's particle accelerator"
    ],
    connections: ["Thor", "The Avengers", "Black Widow"],
    stanLeeCameo: "Mistaken for Larry King at the Stark Expo, Tony says 'Hi, Larry!'"
  },

  4: { // Thor (2011)
    postCredits: 2,
    scenes: [
      "Loki manipulates Erik Selvig while possessing the Tesseract",
      "Thor returns to Earth (only in some versions)"
    ],
    trivia: [
      "Chris Hemsworth gained 20 pounds of muscle for the role",
      "Natalie Portman's character was originally going to be a nurse, not a scientist",
      "The Bifrost sound effect is a didgeridoo",
      "Tom Hiddleston originally auditioned for Thor, not Loki",
      "The film's New Mexico town was built as a set in Galisteo, New Mexico"
    ],
    easterEggs: [
      "Hawkeye makes his first MCU appearance as a S.H.I.E.L.D. agent",
      "The Infinity Gauntlet can be seen in Odin's vault (later revealed as a fake)",
      "Donald Blake's name appears on a hospital ID tag"
    ],
    connections: ["The Avengers", "Thor: The Dark World", "Thor: Ragnarok"],
    stanLeeCameo: "Attempts to pull Thor's hammer from the ground with his pickup truck, failing spectacularly"
  },

  5: { // Captain America: The First Avenger (2011)
    postCredits: 1,
    scenes: ["The Avengers teaser trailer"],
    trivia: [
      "Chris Evans initially turned down the role three times",
      "The skinny Steve Rogers effect used a combination of CGI and body doubles",
      "Hayley Atwell's red lipstick became iconic and was specially created for the film",
      "The film's budget was $140 million, one of the most expensive at the time",
      "Sebastian Stan (Bucky) signed a nine-picture deal with Marvel"
    ],
    easterEggs: [
      "The original Human Torch (android) is displayed at the Stark Expo",
      "Arnim Zola's consciousness transfer hints at his future as an AI",
      "The Tesseract is revealed to be an Infinity Stone"
    ],
    connections: ["The Avengers", "Captain America: The Winter Soldier", "Avengers: Endgame"],
    stanLeeCameo: "A general at the medal ceremony who mistakes Steve Rogers for someone else"
  },

  6: { // The Avengers (2012)
    postCredits: 2,
    scenes: [
      "The Avengers eat shawarma in silence",
      "Thanos is revealed as the mastermind behind Loki's invasion"
    ],
    trivia: [
      "The shawarma scene was shot after the premiere; Chris Evans wore a prosthetic jaw to hide his beard",
      "Robert Downey Jr. hid snacks around the set and ate during takes",
      "The Battle of New York was filmed in Cleveland, Ohio",
      "Joss Whedon wrote the script in three weeks",
      "Mark Ruffalo is the first actor to play both Bruce Banner and the Hulk via motion capture"
    ],
    easterEggs: [
      "Thanos' appearance sets up the Infinity Saga",
      "The Chitauri are connected to the Kree Empire",
      "Tony's 'genius, billionaire, playboy, philanthropist' line was improvised"
    ],
    connections: ["Iron Man 3", "Thor: The Dark World", "Avengers: Age of Ultron"],
    stanLeeCameo: "Interviewed on TV, skeptical about superheroes in New York: 'Superheroes in New York? Give me a break!'"
  },

  // ===== PHASE 2 (2013-2015) =====

  7: { // Iron Man 3 (2013)
    postCredits: 1,
    scenes: ["Tony Stark recounts his story to Bruce Banner, who fell asleep"],
    trivia: [
      "The Mandarin twist was one of the most controversial decisions in MCU history",
      "Robert Downey Jr. suffered an ankle injury during filming",
      "The barrel of monkeys sequence was performed by actual skydivers",
      "Shane Black directed and brought his signature Christmas setting",
      "The film grossed over $1.2 billion worldwide"
    ],
    easterEggs: [
      "The Ten Rings organization returns, connecting to Iron Man and Shang-Chi",
      "Harley Keener returns in Avengers: Endgame",
      "J.A.R.V.I.S. is destroyed, leading to the creation of Vision"
    ],
    connections: ["Avengers: Age of Ultron", "Spider-Man: Homecoming", "Shang-Chi"],
    stanLeeCameo: "A beauty pageant judge holding a '10' scorecard as Tony's suits explode"
  },

  8: { // Thor: The Dark World (2013)
    postCredits: 2,
    scenes: [
      "Sif and Volstagg deliver the Aether to the Collector",
      "Thor returns to Earth to reunite with Jane"
    ],
    trivia: [
      "Loki's death scene made Tom Hiddleston cry during filming",
      "Natalie Portman's scenes were partially reshot with a body double",
      "The film introduces the Reality Stone (Aether)",
      "Chris O'Dowd was originally cast as a love interest for Jane but was cut",
      "The Dark Elves' language was created specifically for the film"
    ],
    easterEggs: [
      "The Collector's museum contains a Chitauri, a Dark Elf, and other MCU artifacts",
      "Loki's 'death' is revealed to be a trick in Thor: Ragnarok",
      "The Convergence event connects to the multiverse concept"
    ],
    connections: ["Guardians of the Galaxy", "Thor: Ragnarok", "Avengers: Infinity War"],
    stanLeeCameo: "A mental patient in the asylum where Erik Selvig is held, asking for his shoe back"
  },

  9: { // Captain America: The Winter Soldier (2014)
    postCredits: 2,
    scenes: [
      "Baron von Strucker experiments on Quicksilver and Scarlet Witch with Loki's scepter",
      "Bucky visits the Captain America exhibit at the Smithsonian"
    ],
    trivia: [
      "Considered one of the best MCU films and a political thriller",
      "The Russo Brothers' first MCU film",
      "Robert Redford's first superhero film role",
      "The highway fight scene took two weeks to film",
      "Hydra's infiltration of S.H.I.E.L.D. affected Agents of S.H.I.E.L.D. TV series simultaneously"
    ],
    easterEggs: [
      "Stephen Strange is mentioned as a target by Zola's algorithm",
      "Arnim Zola returns as a computer consciousness",
      "Bucky's metal arm is Wakandan technology (revealed later)"
    ],
    connections: ["Avengers: Age of Ultron", "Captain America: Civil War", "Black Panther"],
    stanLeeCameo: "A Smithsonian security guard who discovers Captain America's stolen uniform"
  },

  10: { // Guardians of the Galaxy (2014)
    postCredits: 2,
    scenes: [
      "Baby Groot dances to 'I Want You Back'",
      "Howard the Duck appears in the Collector's destroyed museum"
    ],
    trivia: [
      "Chris Pratt lost 60 pounds for the role of Star-Lord",
      "Vin Diesel recorded 'I am Groot' in multiple languages",
      "The Awesome Mix Vol. 1 soundtrack became a cultural phenomenon",
      "James Gunn fought to keep the film's humor and music",
      "Bradley Cooper voiced Rocket Raccoon without ever being on set"
    ],
    easterEggs: [
      "The Collector's museum contains a Chitauri, a Dark Elf, and Cosmo the space dog",
      "Thanos sits in a floating chair, a reference to his comic book throne",
      "The Power Stone is the first Infinity Stone explicitly named"
    ],
    connections: ["Guardians of the Galaxy Vol. 2", "Avengers: Infinity War", "Thor: Love and Thunder"],
    stanLeeCameo: "A ladies' man on Xandar, flirting with a young woman and calling her 'beautiful'"
  },

  11: { // Avengers: Age of Ultron (2015)
    postCredits: 1,
    scenes: ["Thanos retrieves the Infinity Gauntlet, saying 'Fine, I'll do it myself'"],
    trivia: [
      "The party scene was filmed at a real location in England",
      "Joss Whedon fought with Marvel executives over the film's length and content",
      "The Hulkbuster armor weighs over 1,700 pounds in real life",
      "Quicksilver's death was controversial and unexpected",
      "The film introduces Vision, who wields Mjolnir"
    ],
    easterEggs: [
      "Wakanda is mentioned as the source of vibranium",
      "Thor's vision in the cave hints at the Infinity Stones",
      "The Mind Stone is revealed to be in Loki's scepter"
    ],
    connections: ["Captain America: Civil War", "Black Panther", "Avengers: Infinity War"],
    stanLeeCameo: "A World War II veteran at the Avengers' party, trying to drink Thor's Asgardian liquor"
  },

  12: { // Ant-Man (2015)
    postCredits: 2,
    scenes: [
      "Falcon meets with Captain America and Bucky, mentioning 'a guy who can shrink'",
      "Hope van Dyne is shown the Wasp suit"
    ],
    trivia: [
      "Edgar Wright left the project due to creative differences",
      "Paul Rudd co-wrote the screenplay",
      "Michael Peña's storytelling scenes were improvised",
      "The Thomas the Tank Engine fight was a fan-favorite moment",
      "The film introduces the Quantum Realm, crucial to Endgame"
    ],
    easterEggs: [
      "Howard Stark and Peggy Carter appear in the opening scene",
      "The Falcon fight connects directly to Civil War",
      "Hank Pym mentions his wife Janet being lost in the Quantum Realm"
    ],
    connections: ["Captain America: Civil War", "Ant-Man and the Wasp", "Avengers: Endgame"],
    stanLeeCameo: "A bartender who serves Luis and comments on his story"
  },

  // ===== PHASE 3 (2016-2019) - Existing trivia remapped =====

  13: { // Captain America: Civil War (2016)
    postCredits: 2,
    scenes: [
      "Bucky is placed in cryogenic sleep in Wakanda",
      "Peter Parker tests his new web-shooters"
    ],
    trivia: [
      "Considered 'Avengers 2.5' due to its large cast",
      "The airport battle scene took weeks to choreograph",
      "Spider-Man's introduction was kept secret until the trailer",
      "Black Panther's debut led to his solo film",
      "The Sokovia Accords divide the Avengers permanently"
    ],
    easterEggs: [
      "Wakanda is revealed as a technologically advanced nation",
      "Zemo's plan is one of the most successful villain plots in the MCU",
      "The rift between Tony and Steve sets up Infinity War"
    ],
    connections: ["Black Panther", "Spider-Man: Homecoming", "Avengers: Infinity War"],
    stanLeeCameo: "A FedEx delivery man who mispronounces Tony Stark's name as 'Tony Stank'"
  },

  14: { // Doctor Strange (2016) - OLD KEY 1
    postCredits: 2,
    scenes: [
      "Thor appears asking for Strange's help to find Odin",
      "Mordo confronts Jonathan Pangborn and steals his magic"
    ],
    trivia: [
      "Benedict Cumberbatch performed many of his own stunts",
      "The Ancient One's death scene was shot in one take",
      "The film features over 1,000 VFX shots",
      "Benedict Cumberbatch performed the motion capture for Dormammu",
      "The Cloak of Levitation's personality was inspired by Aladdin's Magic Carpet"
    ],
    easterEggs: [
      "A file mentions a '35-year-old Air Force Colonel'—War Machine reference",
      "The Eye of Agamotto contains the Time Stone",
      "The Sanctum Sanctorum address is 177A Bleecker Street"
    ],
    connections: ["Thor: Ragnarok", "Avengers: Infinity War", "Spider-Man: No Way Home"],
    stanLeeCameo: "On a bus, laughing while reading 'The Doors of Perception' as Strange crashes into the window"
  },

  15: { // Guardians of the Galaxy Vol. 2 (2017)
    postCredits: 5,
    scenes: [
      "Kraglin learns to use Yondu's arrow",
      "Ravager leaders reunite for Yondu's funeral",
      "Ayesha creates Adam Warlock",
      "Teenage Groot acts rebellious",
      "Stan Lee talks to the Watchers"
    ],
    trivia: [
      "Kurt Russell is Chris Pratt's real-life childhood hero",
      "Baby Groot's dance was motion-captured from James Gunn",
      "The film explores Star-Lord's celestial heritage",
      "Yondu's funeral is one of the most emotional MCU moments",
      "The soundtrack features 'Guardians Inferno' by David Hasselhoff"
    ],
    easterEggs: [
      "Stan Lee's cameo confirms he's been the same character in all his appearances",
      "Adam Warlock's cocoon sets up Vol. 3",
      "Ego's planet contains thousands of skeletons of his children"
    ],
    connections: ["Avengers: Infinity War", "Thor: Love and Thunder", "Guardians of the Galaxy Vol. 3"],
    stanLeeCameo: "In a spacesuit, telling stories to the Watchers about his past adventures"
  },

  16: { // Spider-Man: Homecoming (2017) - OLD KEY 2
    postCredits: 2,
    scenes: [
      "Adrian Toomes protects Spider-Man's identity in prison",
      "Captain America's patience PSA (joke scene)"
    ],
    trivia: [
      "Tom Holland did his own stunts including the Washington Monument climb",
      "The film has over 2,800 VFX shots",
      "Donald Glover's character is Miles Morales' uncle in the comics",
      "Tom Holland went undercover at a Bronx high school for three days",
      "The title 'Homecoming' refers to both the dance and Spider-Man's MCU return"
    ],
    easterEggs: [
      "The mask Peter wears is a reference to the 1960s Spider-Man cartoon",
      "Damage Control is introduced as a cleanup organization",
      "The Avengers Tower is visible in the New York skyline"
    ],
    connections: ["Avengers: Infinity War", "Spider-Man: Far From Home", "Spider-Man: No Way Home"],
    stanLeeCameo: "A neighbor named Gary who yells at Peter for disturbing the neighborhood"
  },

  17: { // Thor: Ragnarok (2017) - OLD KEY 6
    postCredits: 2,
    scenes: [
      "Thor and Loki's ship is approached by Thanos' vessel",
      "Grandmaster faces angry revolutionaries"
    ],
    trivia: [
      "80% of the dialogue was improvised",
      "Taika Waititi voiced Korg via motion capture",
      "The film was inspired by 1980s sci-fi aesthetics",
      "The 'help me' play scene was Chris Hemsworth's idea",
      "Cate Blanchett performed her own stunts as Hela"
    ],
    easterEggs: [
      "The faces on Grandmaster's tower include Beta Ray Bill and Man-Thing",
      "Loki's play features Matt Damon as Loki",
      "The Hulk has been on Sakaar for two years (time dilation)"
    ],
    connections: ["Avengers: Infinity War", "Thor: Love and Thunder", "Loki"],
    stanLeeCameo: "The barber on Sakaar who cuts Thor's hair with a terrifying blade contraption"
  },

  18: { // Black Panther (2018) - OLD KEY 3
    postCredits: 2,
    scenes: [
      "T'Challa reveals Wakanda's true nature to the UN",
      "Bucky Barnes awakens in Wakanda"
    ],
    trivia: [
      "First superhero film nominated for Best Picture at the Oscars",
      "Wakandan language is based on Xhosa",
      "The film won 3 Academy Awards",
      "John Kani speaks Xhosa fluently",
      "The South Korea car chase used a real Lexus LC 500"
    ],
    easterEggs: [
      "Shuri calls Ross 'another broken white boy,' referencing Bucky",
      "Killmonger's scars represent his kills",
      "The heart-shaped herb connects to the Panther God Bast"
    ],
    connections: ["Avengers: Infinity War", "Black Panther: Wakanda Forever", "Captain America: Civil War"],
    stanLeeCameo: "A 'thirsty' gambler in the South Korean casino who takes T'Challa's winnings"
  },

  19: { // Avengers: Infinity War (2018) - OLD KEY 7
    postCredits: 1,
    scenes: ["Nick Fury sends a distress signal to Captain Marvel before being dusted"],
    trivia: [
      "Largest cast in MCU history at the time",
      "Robert Downey Jr. kept food hidden on set",
      "The Snap was filmed with actors not knowing who would be dusted",
      "Many actors were given fake scripts",
      "First film shot entirely using IMAX digital cameras"
    ],
    easterEggs: [
      "The 'arrested development' blue man in the Collector's collection",
      "Red Skull returns as the Soul Stone's keeper",
      "Thor's new weapon Stormbreaker is more powerful than Mjolnir"
    ],
    connections: ["Avengers: Endgame", "Captain Marvel", "Spider-Man: Far From Home"],
    stanLeeCameo: "Peter Parker's school bus driver: 'What's the matter with you kids? You never seen a spaceship before?'"
  },

  20: { // Ant-Man and the Wasp (2018) - OLD KEY 5
    postCredits: 2,
    scenes: [
      "Scott enters the Quantum Realm as the Pym family is dusted",
      "Giant ant plays drums (joke scene)"
    ],
    trivia: [
      "Michelle Pfeiffer's de-aging used no CGI, only makeup",
      "The film has over 2,000 VFX shots",
      "Paul Rudd improvised many of his lines",
      "Most 'macro' shots used specialized lenses",
      "The film takes place over just 48-72 hours"
    ],
    easterEggs: [
      "A microscopic city (Chronopolis) is visible in the Quantum Realm",
      "Ghost's quantum phasing connects to the multiverse",
      "The film ends exactly as the Snap happens"
    ],
    connections: ["Avengers: Endgame", "Ant-Man and the Wasp: Quantumania", "Loki"],
    stanLeeCameo: "A pedestrian whose car is shrunk: 'Well, the '60s were fun, but now I'm paying for it'"
  },

  21: { // Captain Marvel (2019)
    postCredits: 2,
    scenes: [
      "Carol Danvers appears at the Avengers compound asking 'Where's Fury?'",
      "Goose coughs up the Tesseract on Fury's desk"
    ],
    trivia: [
      "Set in the 1990s, it's a prequel to most MCU films",
      "Brie Larson trained for 9 months for the role",
      "The film introduces the Skrulls to the MCU",
      "Nick Fury loses his eye to Goose the Flerken",
      "The pager from Infinity War is explained"
    ],
    easterEggs: [
      "Young Phil Coulson and Nick Fury appear",
      "The Tesseract's journey from Captain America to Avengers is revealed",
      "Ronan the Accuser appears before Guardians of the Galaxy"
    ],
    connections: ["Avengers: Endgame", "The Marvels", "Secret Invasion"],
    stanLeeCameo: "On a train, reading the script for 'Mallrats' (a Kevin Smith film Stan appeared in)"
  },

  22: { // Avengers: Endgame (2019) - OLD KEY 8
    postCredits: 0,
    scenes: ["No traditional post-credits, only the sound of Tony forging his first armor"],
    trivia: [
      "Highest-grossing film of all time (briefly)",
      "The final battle took 3 months to film",
      "Robert Downey Jr. improvised 'I am Iron Man'",
      "Over 3,000 VFX shots",
      "Tony's death scene was filmed next to where RDJ first screen-tested",
      "At 3 hours 1 minute, it's the longest MCU film"
    ],
    easterEggs: [
      "The 1970s helmet is the original Ant-Man helmet from the comics",
      "Steve Rogers finally gets his dance with Peggy",
      "The funeral scene includes every major MCU character"
    ],
    connections: ["Spider-Man: Far From Home", "Loki", "WandaVision"],
    stanLeeCameo: "His final MCU cameo; a 1970s hippie driving past Camp Lehigh: 'Hey man, make love, not war!'"
  },

  23: { // Spider-Man: Far From Home (2019) - OLD KEY 9
    postCredits: 2,
    scenes: [
      "Mysterio reveals Spider-Man's identity to the world",
      "Nick Fury is revealed to be Talos; real Fury is in space"
    ],
    trivia: [
      "First MCU film set after Endgame",
      "Jake Gyllenhaal performed his own stunts",
      "The illusion sequences used practical effects and CGI",
      "The 'Peter Tingle' was kept in the final script",
      "First MCU movie where Peter's identity is outed"
    ],
    easterEggs: [
      "A tribute to fallen Avengers plays to 'I Will Always Love You'",
      "The Elementals are revealed to be illusions",
      "E.D.I.T.H. stands for 'Even Dead, I'm The Hero'"
    ],
    connections: ["Spider-Man: No Way Home", "Secret Invasion", "The Marvels"],
    stanLeeCameo: null
  },

  // ===== PHASE 4-6 (Existing trivia continues with updated keys) =====
  
  24: { // WandaVision - OLD KEY 10
    postCredits: 1,
    scenes: ["Wanda studies the Darkhold in astral form while hearing her children"],
    trivia: [
      "Each episode mimics a different sitcom era",
      "Elizabeth Olsen studied classic sitcoms for months",
      "Over 300 VFX shots per episode",
      "Paul Bettany acts with himself as Vision and White Vision",
      "First episode filmed in front of a live studio audience"
    ],
    easterEggs: [
      "Commercials represent Wanda's traumas (Stark Industries toaster)",
      "Agatha Harkness was the villain all along",
      "The Darkhold connects to Doctor Strange 2"
    ],
    connections: ["Doctor Strange in the Multiverse of Madness", "Agatha: Darkhold Diaries"],
    stanLeeCameo: null
  },

  25: { // Falcon & Winter Soldier - OLD KEY 11
    postCredits: 1,
    scenes: ["Sharon Carter sells government secrets"],
    trivia: [
      "Anthony Mackie did his own stunts",
      "Explores PTSD and racial issues",
      "Isaiah Bradley's story based on Tuskegee experiments",
      "Zemo's dance became a viral meme"
    ],
    easterEggs: [
      "The 'Big Three' (Androids, Aliens, Wizards) joke",
      "Sam's new Captain America suit is Wakandan",
      "Sharon is revealed as the Power Broker"
    ],
    connections: ["Captain America: Brave New World", "Thunderbolts*"],
    stanLeeCameo: null
  },

  26: { // Loki Season 1 & 2
    postCredits: 1,
    scenes: ["Loki finds himself in a branched timeline where Mobius doesn't recognize him"],
    trivia: [
      "Introduces the multiverse and Kang variants",
      "Tom Hiddleston's favorite MCU project",
      "The TVA design was inspired by 1970s sci-fi",
      "Sylvie is a female Loki variant"
    ],
    easterEggs: [
      "Throg (Frog Thor) appears in a jar",
      "The Void contains many MCU Easter eggs",
      "He Who Remains is a Kang variant"
    ],
    connections: ["Doctor Strange 2", "Ant-Man 3", "Avengers: The Kang Dynasty"],
    stanLeeCameo: null
  },

  27: { // Black Widow - OLD KEY 4
    postCredits: 1,
    scenes: ["Valentina recruits Yelena to kill Hawkeye"],
    trivia: [
      "Set between Civil War and Infinity War",
      "Florence Pugh did 90% of her own stunts",
      "The Red Room was inspired by real Soviet programs",
      "Florence Pugh's landing pose became a recurring gag",
      "Only film to take place in the past but released after Infinity Saga"
    ],
    easterEggs: [
      "The red 'Crimson Dynamo' action figure",
      "Taskmaster's identity twist",
      "Natasha's sacrifice in Endgame is referenced"
    ],
    connections: ["Hawkeye", "Thunderbolts*"],
    stanLeeCameo: null
  },

  28: { // Shang-Chi - OLD KEY 13
    postCredits: 2,
    scenes: [
      "Wong, Bruce Banner, and Carol Danvers analyze the Ten Rings",
      "Xialing takes over her father's organization"
    ],
    trivia: [
      "Simu Liu did 95% of his own stunts",
      "The bus fight was shot in one continuous take",
      "The Ten Rings' origin remains a mystery",
      "Simu Liu was cast after tweeting at Marvel in 2014"
    ],
    easterEggs: [
      "Trevor Slattery returns from Iron Man 3",
      "The Great Protector dragon",
      "Ta Lo connects to ancient MCU mythology"
    ],
    connections: ["The Marvels", "Shang-Chi 2"],
    stanLeeCameo: null
  },

  29: { // Hawkeye - OLD KEY 12
    postCredits: 1,
    scenes: ["Full 'Rogers: The Musical' performance"],
    trivia: [
      "Hailee Steinfeld did her own archery training",
      "Filmed during COVID-19 pandemic",
      "Lucky the Pizza Dog is from the comics",
      "Lucky's missing eye was added via CGI"
    ],
    easterEggs: [
      "Kate's purple suit is from the 2012 Matt Fraction comics",
      "Kingpin returns from Netflix's Daredevil",
      "The Tracksuit Mafia says 'bro' constantly"
    ],
    connections: ["Echo", "Daredevil: Born Again"],
    stanLeeCameo: null
  },

  30: { // Spider-Man: No Way Home - OLD KEY 17
    postCredits: 2,
    scenes: [
      "Eddie Brock returns to his universe, leaving a Venom symbiote",
      "Doctor Strange 2 trailer"
    ],
    trivia: [
      "Kept three Spider-Men secret until release",
      "Andrew Garfield lied for months",
      "Grossed over $1.9 billion",
      "Tom Holland cried seeing Tobey and Andrew",
      "Andrew lied to Emma Stone for over a year",
      "Features five villains from two franchises"
    ],
    easterEggs: [
      "Venom leaves a symbiote piece in the MCU",
      "The three Spider-Men compare web-shooters",
      "Matt Murdock appears as Peter's lawyer"
    ],
    connections: ["Doctor Strange 2", "Venom 3", "Spider-Man 4"],
    stanLeeCameo: null
  },

  31: { // Moon Knight - OLD KEY 16
    postCredits: 0,
    scenes: [],
    trivia: [
      "Oscar Isaac plays multiple personalities",
      "The show explores Egyptian mythology",
      "Filmed in Budapest and Jordan",
      "The suit transformations are practical effects"
    ],
    easterEggs: [
      "Khonshu is an actual Egyptian god",
      "The asylum scenes blur reality",
      "Jake Lockley is revealed in the finale"
    ],
    connections: ["Blade", "Midnight Sons"],
    stanLeeCameo: null
  },

  32: { // Doctor Strange 2 - OLD KEY 18
    postCredits: 2,
    scenes: [
      "Clea recruits Strange to fix an incursion",
      "Strange develops a third eye (joke scene)"
    ],
    trivia: [
      "Sam Raimi's first superhero film since Spider-Man 3",
      "Features the most variants",
      "John Krasinski as Reed Richards",
      "Bruce Campbell has his traditional Raimi cameo",
      "Sam Raimi brought horror style to MCU"
    ],
    easterEggs: [
      "Professor X with 90s cartoon theme",
      "The Illuminati members",
      "Zombie Strange uses the Darkhold"
    ],
    connections: ["Loki Season 2", "Avengers: Secret Wars"],
    stanLeeCameo: null
  },

  33: { // Thor: Love and Thunder - OLD KEY 14
    postCredits: 2,
    scenes: [
      "Zeus sends Hercules to kill Thor",
      "Jane Foster arrives in Valhalla"
    ],
    trivia: [
      "Christian Bale improvised much of Gorr's dialogue",
      "Natalie Portman trained for 10 months",
      "Features the most Guns N' Roses songs in any movie",
      "The Guardians appear briefly"
    ],
    easterEggs: [
      "Hercules is played by Brett Goldstein",
      "The Necrosword connects to Knull",
      "Gorr's daughter becomes Love"
    ],
    connections: ["Thor 5", "Hercules appearance"],
    stanLeeCameo: null
  },

  34: { // Black Panther: Wakanda Forever - OLD KEY 20
    postCredits: 1,
    scenes: ["Shuri meets T'Challa's son in Haiti"],
    trivia: [
      "Tribute to Chadwick Boseman throughout",
      "Namor speaks Mayan language",
      "Rihanna returned to music for soundtrack",
      "Rewritten after Boseman's passing",
      "Namor changed from Atlantis to Talokan"
    ],
    easterEggs: [
      "Talokan draws from Mayan/Aztec mythology",
      "Shuri becomes the new Black Panther",
      "Ironheart is introduced"
    ],
    connections: ["Ironheart", "Wakanda series"],
    stanLeeCameo: null
  },

  35: { // Ant-Man 3 - OLD KEY 19
    postCredits: 2,
    scenes: [
      "Kang variants gather in the Quantum Realm",
      "Loki and Mobius investigate a Kang variant in 1901"
    ],
    trivia: [
      "Introduces Kang the Conqueror",
      "Jonathan Majors plays multiple Kang variants",
      "Quantum Realm entirely CGI",
      "MODOK's design was controversial"
    ],
    easterEggs: [
      "The Council of Kangs",
      "MODOK is Darren Cross",
      "Cassie Lang becomes Stature"
    ],
    connections: ["Loki Season 2", "Avengers: The Kang Dynasty"],
    stanLeeCameo: null
  },

  36: { // The Marvels - OLD KEY 21
    postCredits: 1,
    scenes: ["Monica Rambeau in parallel universe with Binary and Beast"],
    trivia: [
      "Shortest MCU film at 105 minutes",
      "First musical number in MCU",
      "Kamala forms Young Avengers",
      "Three leads trained together"
    ],
    easterEggs: [
      "The Flerken kittens",
      "Binary appearance hints at X-Men",
      "Young Avengers assembly begins"
    ],
    connections: ["X-Men integration", "Young Avengers"],
    stanLeeCameo: null
  },

  37: { // Deadpool & Wolverine - OLD KEY 22
    postCredits: 1,
    scenes: ["Deadpool shows Johnny Storm footage"],
    trivia: [
      "First R-rated MCU film",
      "Hugh Jackman returns after Logan",
      "Integrates Fox X-Men into MCU",
      "Ryan Reynolds and Hugh Jackman improvised extensively"
    ],
    easterEggs: [
      "Multiple Fox characters return",
      "Blade, Elektra, Gambit appear",
      "TVA integration"
    ],
    connections: ["Avengers: Secret Wars", "X-Men reboot"],
    stanLeeCameo: null
  },

  38: { // Captain America: Brave New World - OLD KEY 23
    postCredits: 2,
    scenes: ["Expected Thunderbolts setup"],
    trivia: [
      "Anthony Mackie's first film as Captain America",
      "Harrison Ford as Red Hulk",
      "Serpent Society as villains",
      "Tim Blake Nelson returns as The Leader",
      "Harrison Ford joins MCU"
    ],
    easterEggs: [],
    connections: ["Thunderbolts*", "World War Hulk"],
    stanLeeCameo: null
  },

  39: { // Thunderbolts* - OLD KEY 24
    postCredits: 2,
    scenes: ["TBD"],
    trivia: [
      "Asterisk is intentional and mysterious",
      "Anti-heroes and reformed villains",
      "Florence Pugh returns",
      "Sebastian Stan returns",
      "Asterisk implies name change to Dark Avengers"
    ],
    easterEggs: [],
    connections: ["Captain America 4", "Avengers: Doomsday"],
    stanLeeCameo: null
  },

  40: { // Fantastic Four: First Steps - OLD KEY 25
    postCredits: 2,
    scenes: ["TBD"],
    trivia: [
      "Set in alternate 1960s timeline",
      "Introduces Marvel's First Family to MCU",
      "Galactus as the villain",
      "Period piece aesthetic"
    ],
    easterEggs: [],
    connections: ["Avengers: Doomsday", "Avengers: Secret Wars"],
    stanLeeCameo: null
  },

  41: { // Wonder Man - OLD KEY 26
    postCredits: 0,
    scenes: [],
    trivia: [
      "Simon Williams' Hollywood career",
      "Disney+ series format",
      "Connects to West Coast Avengers"
    ],
    easterEggs: [],
    connections: ["Young Avengers"],
    stanLeeCameo: null
  },

  42: { // Daredevil: Born Again S2 - OLD KEY 27
    postCredits: 0,
    scenes: [],
    trivia: [
      "Charlie Cox and Vincent D'Onofrio return",
      "18-episode season",
      "Continues Netflix storylines",
      "Darker, mature tone"
    ],
    easterEggs: [],
    connections: ["Echo", "Spider-Man 4"],
    stanLeeCameo: null
  },

  43: { // VisionQuest - OLD KEY 28
    postCredits: 0,
    scenes: [],
    trivia: [
      "White Vision's journey",
      "Explores synthetic life",
      "Paul Bettany returns"
    ],
    easterEggs: [],
    connections: ["WandaVision", "Young Avengers"],
    stanLeeCameo: null
  },

  44: { // Spider-Man: Brand New Day - OLD KEY 29
    postCredits: 2,
    scenes: ["TBD"],
    trivia: [
      "Tom Holland's fourth Spider-Man film",
      "Street-level story",
      "Deals with identity crisis aftermath"
    ],
    easterEggs: [],
    connections: ["Avengers: Doomsday"],
    stanLeeCameo: null
  },

  45: { // Avengers: Doomsday - OLD KEY 30
    postCredits: 2,
    scenes: ["TBD"],
    trivia: [
      "Robert Downey Jr. returns as Doctor Doom",
      "Largest MCU cast ever",
      "Directed by Russo Brothers",
      "Culmination of Multiverse Saga"
    ],
    easterEggs: [],
    connections: ["Avengers: Secret Wars"],
    stanLeeCameo: null
  }
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
  let badgesAdded = 0;
  
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
        badgesAdded++;
      }
    }
  });
  
  console.log(`[Concepts] Added ${badgesAdded} concept badges to cards`);
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
    
    // Easter Eggs
    if (trivia.easterEggs && trivia.easterEggs.length > 0) {
      contentHTML += `
        <div class="trivia-section">
          <h4 class="trivia-heading">
            <span class="trivia-heading-icon">🥚</span>
            Easter Eggs
          </h4>
          <ul class="trivia-list">
            ${trivia.easterEggs.map(egg => `<li>${egg}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    // Stan Lee Cameo
    if (trivia.stanLeeCameo) {
      contentHTML += `
        <div class="trivia-section">
          <h4 class="trivia-heading">
            <span class="trivia-heading-icon">👴</span>
            Stan Lee Cameo
          </h4>
          <div class="stan-lee-cameo">${trivia.stanLeeCameo}</div>
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
      initBadgeToggles(); // Phase 17: Badge visibility toggles
      
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
// ============================================
// PHASE 17: BADGE VISIBILITY TOGGLES
// ============================================

/**
 * Initialize badge visibility toggles
 */
function initBadgeToggles() {
  const toggleButtons = document.querySelectorAll('.badge-toggle');
  
  // Load saved states from localStorage
  const savedStates = {
    saga: localStorage.getItem('show-saga-badges') === 'true',
    governance: localStorage.getItem('show-governance-badges') === 'true',
    concepts: localStorage.getItem('show-concept-badges') === 'true'
  };
  
  // Apply saved states
  if (savedStates.saga) {
    document.body.classList.add('show-saga-badges');
  }
  if (savedStates.governance) {
    document.body.classList.add('show-governance-badges');
  }
  if (savedStates.concepts) {
    document.body.classList.add('show-concept-badges');
  }
  
  // Update button states
  toggleButtons.forEach(button => {
    const badgeType = button.dataset.badgeType;
    if (savedStates[badgeType]) {
      button.classList.add('is-active');
    }
    
    // Add click handler
    button.addEventListener('click', () => {
      const isActive = button.classList.toggle('is-active');
      const bodyClass = `show-${badgeType}-badges`;
      
      if (isActive) {
        document.body.classList.add(bodyClass);
        localStorage.setItem(bodyClass, 'true');
        console.log(`[Badges] ${badgeType} badges enabled - body class added:`, bodyClass);
        console.log(`[Badges] Body classes:`, document.body.className);
        console.log(`[Badges] Visible ${badgeType} badges:`, document.querySelectorAll(`.${badgeType === 'concepts' ? 'concept' : badgeType === 'saga' ? 'saga-arc' : 'governance'}-badge:not([style*="display: none"])`).length);
        toast.show(`${button.textContent.trim()} badges visible`, 'success', 2000);
      } else {
        document.body.classList.remove(bodyClass);
        localStorage.setItem(bodyClass, 'false');
        console.log(`[Badges] ${badgeType} badges disabled - body class removed:`, bodyClass);
        toast.show(`${button.textContent.trim()} badges hidden`, 'info', 2000);
      }
    });
  });
  
  console.log('[Badges] Toggle controls initialized:', savedStates);
}

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

/* ============================================
   PHASE 11: TIMELINE VISUALIZATION
   ============================================ */

// Initialize Timeline Bar
function initializeTimelineBar() {
  const phaseSegments = document.querySelectorAll('.phase-segment');
  const progressIndicator = document.getElementById('timelineProgress');

// Initialize Phase 15: Convergence Analysis Layer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initConvergenceLayer);
} else {
  initConvergenceLayer();

// Initialize Phase 16: Character Network Graph
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCharacterNetwork);
} else {
  initializeCharacterNetwork();
}
}
  
  // Make phase segments clickable
  phaseSegments.forEach(segment => {
    segment.addEventListener('click', () => {
      const phase = segment.dataset.phase;
      
      // Find and click the corresponding phase chip
      const phaseChip = document.querySelector(`.phase-chip[data-phase="${phase}"]`);
      if (phaseChip) {
        phaseChip.click();
      }
      
      // Update active state
      phaseSegments.forEach(s => s.classList.remove('active'));
      segment.classList.add('active');
    });
  });
  
  // Update progress indicator based on watched titles
  function updateTimelineProgress() {

// Initialize Phase 14: PWA Support
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPWA);
} else {
  initPWA();
}
    if (typeof window.state === 'undefined' || !window.state.items) return;
    
    const totalTitles = window.state.items.filter(item => !item.bonus).length;

// Initialize Phase 13: Enhanced Animations
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancedAnimations);
} else {
  initEnhancedAnimations();
}
    const watchedTitles = window.state.items.filter(item => !item.bonus && item.watched).length;
    const progressPercent = totalTitles > 0 ? (watchedTitles / totalTitles) * 100 : 0;
    
    if (progressIndicator) {
      progressIndicator.style.width = `${progressPercent}%`;
    }
  }
  
  // Update progress on load and when items change
  updateTimelineProgress();
  
  // Listen for state changes
  if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener('stateUpdated', updateTimelineProgress);
  }
  
  // Sync with phase filter chips
  const phaseChips = document.querySelectorAll('.phase-chip');
  phaseChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const phase = chip.dataset.phase;
      
      // Update timeline segment active state
      phaseSegments.forEach(s => s.classList.remove('active'));
      
      if (phase === 'all') {
        // No specific segment active
      } else {
        const activeSegment = document.querySelector(`.phase-segment[data-phase="${phase}"]`);
        if (activeSegment) {
          activeSegment.classList.add('active');
        }
      }
    });
  });
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTimelineBar);
} else {
  initializeTimelineBar();

// Initialize flip cards when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFlipCards);
} else {
  initializeFlipCards();
}

// Re-initialize flip cards when state changes (filtering, etc.)
if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target.classList?.contains('timeline-grid')) {
        reinitializeFlipCards();
      }
    });
  });
  
  // Start observing when DOM is ready
  const startObserving = () => {
    const timelineGrid = document.querySelector('.timeline-grid');
    if (timelineGrid) {
      observer.observe(timelineGrid, { childList: true, subtree: true });
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
  }
}
}
