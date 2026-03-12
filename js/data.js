/**
 * data.js
 * Category data loader with in-memory cache.
 */

export class DataLoader {
  constructor(basePath = 'data') {
    this.basePath = basePath;
    this.cache = new Map();
    this.manifest = null;
  }

  async loadManifest() {
    const resp = await fetch(`${this.basePath}/categories.json`);
    this.manifest = await resp.json();
    return this.manifest;
  }

  async loadCategory(id) {
    if (this.cache.has(id)) return this.cache.get(id);

    const cat = this.manifest.find(c => c.id === id);
    if (!cat) throw new Error(`Unknown category: ${id}`);

    const resp = await fetch(`${this.basePath}/${cat.file}`);
    const data = await resp.json();
    this.cache.set(id, data);
    return data;
  }

  getManifest() {
    return this.manifest;
  }
}
