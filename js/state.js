/**
 * state.js
 * Simple reactive state manager.
 */

export class State {
  constructor() {
    this.activeCategories = new Set();
    this.hoveredPoint = null;
    this.atlasText = '354,770 phenomena. 14 categories. Select one to begin.';
    this._listeners = [];
  }

  onChange(fn) {
    this._listeners.push(fn);
  }

  _emit() {
    for (const fn of this._listeners) fn(this);
  }

  toggleCategory(id) {
    if (this.activeCategories.has(id)) {
      this.activeCategories.delete(id);
    } else {
      this.activeCategories.add(id);
    }
    this._emit();
  }

  setHoveredPoint(pt) {
    this.hoveredPoint = pt;
    // Don't emit for hover — handled directly by app for performance
  }

  setAtlasText(text) {
    this.atlasText = text;
    // Updated inline, no emit needed
  }

  getActiveList() {
    return [...this.activeCategories];
  }
}
