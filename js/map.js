/**
 * map.js
 * Canvas map renderer.
 * - Draws dot-matrix continent outlines from GeoJSON
 * - Draws category points as colored glowing dots
 */

import { Projection } from './projection.js';
import { topoToGeo } from './topo.js';

export class MapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.projection = new Projection(canvas);
    this.landGeometry = null;
    this.landMask = null; // ImageData for point-in-land checks
    this.dotSpacing = 5; // px between dots in the grid
    this.dotRadius = 0.8;

    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.displayWidth = rect.width;
    this.displayHeight = rect.height;
    this.projection.update();
    this._buildLandMask();
  }

  async loadWorld(url) {
    const resp = await fetch(url);
    const topo = await resp.json();
    this.landGeometry = topoToGeo(topo, 'land');
    this._buildLandMask();
  }

  /** Build an offscreen canvas mask of the land areas for fast point-in-land checks */
  _buildLandMask() {
    if (!this.landGeometry) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    const offscreen = document.createElement('canvas');
    offscreen.width = w;
    offscreen.height = h;
    const octx = offscreen.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    octx.scale(dpr, dpr);

    // Fill land polygons in white on black
    octx.fillStyle = '#000';
    octx.fillRect(0, 0, w, h);
    octx.fillStyle = '#fff';

    this._forEachPolygon(this.landGeometry, (ring) => {
      octx.beginPath();
      for (let i = 0; i < ring.length; i++) {
        const [x, y] = this.projection.project(ring[i][0], ring[i][1]);
        if (i === 0) octx.moveTo(x, y);
        else octx.lineTo(x, y);
      }
      octx.closePath();
      octx.fill();
    });

    this.landMask = octx.getImageData(0, 0, w, h);
  }

  /** Check if a display-pixel coordinate is on land */
  _isLand(dispX, dispY) {
    if (!this.landMask) return false;
    const dpr = window.devicePixelRatio || 1;
    const px = Math.round(dispX * dpr);
    const py = Math.round(dispY * dpr);
    const w = this.landMask.width;
    if (px < 0 || py < 0 || px >= w || py >= this.landMask.height) return false;
    const idx = (py * w + px) * 4;
    return this.landMask.data[idx] > 128; // white = land
  }

  /** Iterate over all polygon rings in a geometry */
  _forEachPolygon(geom, fn) {
    if (geom.type === 'Polygon') {
      // Only outer ring (index 0), skip holes
      fn(geom.coordinates[0]);
    } else if (geom.type === 'MultiPolygon') {
      for (const polygon of geom.coordinates) {
        fn(polygon[0]);
      }
    } else if (geom.type === 'GeometryCollection') {
      for (const g of geom.geometries) {
        this._forEachPolygon(g, fn);
      }
    }
  }

  /** Main render call */
  render(state) {
    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    // Draw dot-matrix continents
    this._drawContinentDots(ctx, w, h);

    // Draw category points
    if (state && state.activePoints) {
      for (const layer of state.activePoints) {
        this._drawCategoryPoints(ctx, layer.points, layer.color);
      }
    }
  }

  /** Draw the dot-matrix continent pattern */
  _drawContinentDots(ctx, w, h) {
    if (!this.landMask) return;

    const spacing = this.dotSpacing;
    const r = this.dotRadius;

    ctx.fillStyle = '#2a2a2a';

    for (let y = spacing; y < h; y += spacing) {
      for (let x = spacing; x < w; x += spacing) {
        if (this._isLand(x, y)) {
          // Variable density: compute distance from edge using neighbor sampling
          // Simple version: check if we're deep inland (all neighbors are land)
          const deep = this._isLand(x - spacing * 2, y) &&
                       this._isLand(x + spacing * 2, y) &&
                       this._isLand(x, y - spacing * 2) &&
                       this._isLand(x, y + spacing * 2);

          const dotR = deep ? r * 1.1 : r * 0.7;
          const alpha = deep ? 0.6 : 0.3;

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.globalAlpha = 1;
  }

  /** Draw points for a single category */
  _drawCategoryPoints(ctx, points, color) {
    const r = 1.8;

    // Glow layer
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = color;
    for (const pt of points) {
      const [x, y] = this.projection.project(pt.longitude, pt.latitude);
      ctx.beginPath();
      ctx.arc(x, y, r * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Core dot
    ctx.globalAlpha = 0.85;
    for (const pt of points) {
      const [x, y] = this.projection.project(pt.longitude, pt.latitude);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  /** Find the nearest point to a display coordinate, within a threshold */
  hitTest(dispX, dispY, allPoints, threshold = 8) {
    let nearest = null;
    let nearestDist = threshold * threshold;

    for (const layer of allPoints) {
      for (const pt of layer.points) {
        const [px, py] = this.projection.project(pt.longitude, pt.latitude);
        const dx = px - dispX;
        const dy = py - dispY;
        const d2 = dx * dx + dy * dy;
        if (d2 < nearestDist) {
          nearestDist = d2;
          nearest = { ...pt, _color: layer.color, _category: layer.display };
        }
      }
    }

    return nearest;
  }
}
