/**
 * projection.js
 * Equirectangular projection: lat/lng → canvas x/y
 * No D3 dependency — equirectangular is just linear scaling.
 */

export class Projection {
  constructor(canvas) {
    this.canvas = canvas;
    this.padding = 40; // px padding around edges
    this.update();
  }

  update() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const p = this.padding;

    // Usable area
    this.drawW = w - p * 2;
    this.drawH = h - p * 2;
    this.offsetX = p;
    this.offsetY = p;

    // Scale to fit: aspect ratio of equirectangular is 2:1
    const mapAspect = 2;
    const canvasAspect = this.drawW / this.drawH;

    if (canvasAspect > mapAspect) {
      // Canvas is wider — constrain by height
      const usedW = this.drawH * mapAspect;
      this.offsetX = p + (this.drawW - usedW) / 2;
      this.drawW = usedW;
    } else {
      // Canvas is taller — constrain by width
      const usedH = this.drawW / mapAspect;
      this.offsetY = p + (this.drawH - usedH) / 2;
      this.drawH = usedH;
    }

    // Lng: -180 to 180 → 0 to drawW
    this.scaleX = this.drawW / 360;
    // Lat: 90 to -90 → 0 to drawH (note: y is flipped)
    this.scaleY = this.drawH / 180;
  }

  /** Convert lng/lat to canvas pixel coordinates */
  project(lng, lat) {
    const x = this.offsetX + (lng + 180) * this.scaleX;
    const y = this.offsetY + (90 - lat) * this.scaleY;
    return [x, y];
  }

  /** Convert canvas pixel coordinates back to lng/lat */
  unproject(x, y) {
    const lng = (x - this.offsetX) / this.scaleX - 180;
    const lat = 90 - (y - this.offsetY) / this.scaleY;
    return [lng, lat];
  }
}
