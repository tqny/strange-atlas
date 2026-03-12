/**
 * app.js
 * Entry point — wires state, data, map, and UI together.
 */

import { MapRenderer } from './map.js';
import { DataLoader } from './data.js';
import { State } from './state.js';
import { CATEGORY_COLORS, getColor } from './categories.js';

const canvas = document.getElementById('map-canvas');
const togglesEl = document.getElementById('category-toggles');
const atlasTextEl = document.getElementById('atlas-text');
const tooltipEl = document.getElementById('tooltip');
const tooltipName = document.getElementById('tooltip-name');
const tooltipMeta = document.getElementById('tooltip-meta');
const tooltipDesc = document.getElementById('tooltip-desc');

const map = new MapRenderer(canvas);
const data = new DataLoader('data');
const state = new State();

// Loaded point data keyed by category id
const loadedPoints = new Map();

async function init() {
  // Load world map + category manifest in parallel
  const [manifest] = await Promise.all([
    data.loadManifest(),
    map.loadWorld('data/world-110m.json'),
  ]);

  // Build toggle UI
  buildToggles(manifest);

  // Initial render — just the continent dots
  map.render({ activePoints: [] });

  // Wire state changes
  state.onChange(onStateChange);

  // Wire hover
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', () => {
    tooltipEl.classList.add('hidden');
  });

  // Wire resize
  window.addEventListener('resize', () => {
    map.resize();
    map.render(buildRenderState());
  });
}

function buildToggles(manifest) {
  for (const cat of manifest) {
    const btn = document.createElement('button');
    btn.className = 'toggle-btn';
    btn.dataset.id = cat.id;

    const dot = document.createElement('span');
    dot.className = 'toggle-dot';
    dot.style.backgroundColor = getColor(cat.id);
    dot.style.color = getColor(cat.id);

    const label = document.createElement('span');
    label.textContent = cat.display;

    btn.appendChild(dot);
    btn.appendChild(label);
    btn.addEventListener('click', () => state.toggleCategory(cat.id));
    togglesEl.appendChild(btn);
  }
}

async function onStateChange(st) {
  const active = st.getActiveList();

  // Update toggle button states
  for (const btn of togglesEl.querySelectorAll('.toggle-btn')) {
    btn.classList.toggle('active', active.includes(btn.dataset.id));
  }

  // Load any categories we haven't loaded yet
  for (const id of active) {
    if (!loadedPoints.has(id)) {
      const points = await data.loadCategory(id);
      loadedPoints.set(id, points);
    }
  }

  // Update atlas text
  updateAtlasText(active);

  // Re-render
  map.render(buildRenderState());
}

function buildRenderState() {
  const active = state.getActiveList();
  const manifest = data.getManifest();

  const activePoints = active
    .filter(id => loadedPoints.has(id))
    .map(id => ({
      id,
      display: manifest.find(c => c.id === id)?.display || id,
      color: getColor(id),
      points: loadedPoints.get(id),
    }));

  return { activePoints };
}

function updateAtlasText(activeIds) {
  if (activeIds.length === 0) {
    atlasTextEl.textContent = '354,770 phenomena. 14 categories. Select one to begin.';
  } else {
    const manifest = data.getManifest();
    const names = activeIds.map(id => manifest.find(c => c.id === id)?.display || id);
    const counts = activeIds.map(id => (loadedPoints.get(id)?.length || 0).toLocaleString());
    if (activeIds.length === 1) {
      atlasTextEl.textContent = `${names[0]}. ${counts[0]} records.`;
    } else {
      atlasTextEl.textContent = `${names.join(' + ')}. ${counts.map((c, i) => `${c} ${names[i].toLowerCase()}`).join(', ')}.`;
    }
  }
}

function onMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const renderState = buildRenderState();
  const hit = map.hitTest(x, y, renderState.activePoints);

  if (hit) {
    tooltipName.textContent = hit.name || 'Unknown';
    tooltipMeta.textContent = `${hit._category}${hit.date ? ' · ' + hit.date : ''}`;
    tooltipDesc.textContent = hit.description || '';
    tooltipEl.classList.remove('hidden');

    // Position tooltip near cursor
    const tx = e.clientX + 14;
    const ty = e.clientY - 10;
    tooltipEl.style.left = `${tx}px`;
    tooltipEl.style.top = `${ty}px`;
  } else {
    tooltipEl.classList.add('hidden');
  }
}

init().catch(err => console.error('Init failed:', err));
