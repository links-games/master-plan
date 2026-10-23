/* global document, innerWidth */
// Inspect rendered geometry: document-image margins can collapse outside stages.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(
  pathToFileURL(
    process.env.PLAYWRIGHT_MODULE ||
      '/tmp/master-plan-browser/node_modules/playwright/index.mjs'
  ).href
);
const server = spawn(
  process.execPath,
  ['experiments/serve-master-plan.mjs', 'ci-logs/cached_site'],
  {
    env: { ...process.env, PORT: '4174' },
    stdio: ['ignore', 'pipe', 'inherit'],
  }
);
let browser;
try {
  await once(server.stdout, 'data');
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--no-zygote',
      '--single-process',
      '--renderer-process-limit=1',
    ],
  });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const [device, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:4174/lore/scenery-pilots.html');
    const alignment = await page.locator('.scene-stage').evaluateAll((stages) =>
      stages.map((stage) => {
        const parent = stage.getBoundingClientRect();
        const image = stage.querySelector('img').getBoundingClientRect();
        return (
          ['x', 'y', 'width', 'height'].every(
            (key) => Math.abs(parent[key] - image[key]) < 0.5
          ) && Math.abs(parent.width / parent.height - 16 / 9) < 0.01
        );
      })
    );
    assert.deepEqual(alignment, Array(22).fill(true));
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      ),
      false
    );
    const viewer = page.locator('[data-scene]').first();
    await viewer.scrollIntoViewIfNeeded();
    await viewer.locator('img').evaluate((element) => element.decode());
    await page.screenshot({
      path: `docs/screenshots/issue-3/pilot-layout-${device}.png`,
      animations: 'disabled',
    });
    console.log(
      `${device}: all 22 embedded previews align with their 16:9 stages; no overflow.`
    );
  }
} finally {
  await browser?.close();
  if (server.exitCode === null && server.signalCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    await exited;
  }
}
