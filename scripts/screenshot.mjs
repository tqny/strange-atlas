// Usage: node scripts/screenshot.mjs [url] [output-path] [--wait=ms] [--click="selector"]
// Defaults: http://localhost:8080/globe-preview.html -> screenshots/latest.png

import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:8080/globe-preview.html';
const output = process.argv[3] || 'screenshots/latest.png';
const waitMs = parseInt((process.argv.find(a => a.startsWith('--wait=')) || '--wait=2000').split('=')[1]);
const clickSel = (process.argv.find(a => a.startsWith('--click=')) || '').split('=')[1];

import { mkdirSync } from 'fs';
import { dirname } from 'path';
mkdirSync(dirname(output), { recursive: true });

const headless = !process.env.DISPLAY;
const browser = await chromium.launch({
  headless,
  args: [
    '--enable-webgl',
    '--enable-webgl2',
    '--ignore-gpu-blocklist',
    '--enable-gpu-rasterization',
  ],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });

await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(waitMs);

if (clickSel) {
  await page.click(clickSel);
  await page.waitForTimeout(1000);
}

await page.screenshot({ path: output, type: 'png' });
console.log(`Screenshot saved: ${output}`);

await browser.close();
