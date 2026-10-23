/* global document, window, innerWidth, OffscreenCanvas, createImageBitmap, HTMLCanvasElement */
// Install Playwright in an isolated prefix; the website has no runtime deps.
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { FAMILIES, readCatalog } from '../scripts/game-families.mjs';
import {
  DIRECTIONS,
  extraStyleDirections,
} from '../scripts/concept-prompts.mjs';
const modulePath =
  process.env.PLAYWRIGHT_MODULE ||
  '/tmp/master-plan-browser/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(resolve(modulePath)).href);
const browser = await chromium.launch({
  headless: true,
  channel: 'chromium',
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
  args: [
    '--no-sandbox',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
});
const origin = process.env.SITE_URL || 'http://127.0.0.1:4173';
const directory =
  process.env.SCREENSHOT_DIRECTORY || 'docs/screenshots/issue-3';
const output = process.env.BROWSER_OUTPUT || 'ci-logs/browser';
mkdirSync(directory, { recursive: true });
mkdirSync(output, { recursive: true });
const before = process.argv.includes('--before');
const update = process.argv.includes('--update');
const scenesOnly = process.argv.includes('--scenes-only');
const failures = [];

async function screenshot(page, name) {
  await page.evaluate(() => document.fonts.ready);
  const bytes = await page.screenshot({
    fullPage: false,
    animations: 'disabled',
  });
  const path = `${directory}/${before ? 'before' : 'after'}-${name}.png`;
  if (before || update) {
    writeFileSync(path, bytes);
    return;
  }
  assert.ok(existsSync(path), `Missing visual baseline: ${path}`);
  writeFileSync(`${output}/${name}.png`, bytes);
  const baseline = readFileSync(path).toString('base64');
  const actual = bytes.toString('base64');
  const difference = await page.evaluate(
    async ([a, b]) => {
      const pixels = async (data) => {
        const bitmap = await createImageBitmap(
          await (await fetch(`data:image/png;base64,${data}`)).blob()
        );
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const context = canvas.getContext('2d');
        context.drawImage(bitmap, 0, 0);
        const result = context.getImageData(
          0,
          0,
          bitmap.width,
          bitmap.height
        ).data;
        bitmap.close();
        return result;
      };
      const [left, right] = await Promise.all([pixels(a), pixels(b)]);
      if (left.length !== right.length) {
        return 1;
      }
      let different = 0;
      for (let i = 0; i < left.length; i += 4) {
        if (
          Math.max(
            ...[0, 1, 2].map((c) => Math.abs(left[i + c] - right[i + c]))
          ) > 40
        ) {
          different++;
        }
      }
      return different / (left.length / 4);
    },
    [baseline, actual]
  );
  assert.ok(
    difference < 0.08,
    `${name}: ${(difference * 100).toFixed(2)}% visual difference exceeds 8%`
  );
  console.log(`VISUAL ${name}: ${(difference * 100).toFixed(2)}%`);
}

async function images(page) {
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => element.decode());
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth
    ),
    false,
    'Horizontal overflow'
  );
}

async function scenes(page, device) {
  const requested = [];
  page.on('request', (request) => {
    if (request.url().endsWith('/scene.json')) {
      requested.push(request.url());
    }
  });
  await page.goto(`${origin}/worlds.html?debugScene`, {
    waitUntil: 'networkidle',
  });
  await images(page);
  assert.equal(requested.length, 0, 'Scenes must not load on initial visit');
  await screenshot(page, `worlds-${device}`);
  const viewers = page.locator('[data-scene]');
  assert.equal(await viewers.count(), 22);
  for (let i = 0; i < 22; i++) {
    const viewer = viewers.nth(i);
    await viewer.locator('[data-open-scene]').click();
    const canvas = viewer.locator('canvas');
    await canvas.waitFor({ state: 'visible' });
    await page.waitForFunction(
      (index) =>
        Number(
          document
            .querySelectorAll('[data-scene]')
            [index].querySelector('canvas').dataset.frames
        ) > 0,
      i
    );
    assert.equal(
      await page.locator('canvas:visible').count(),
      1,
      'Only one active context'
    );
    const initial = Number(await canvas.getAttribute('data-frames'));
    await canvas.press('ArrowRight');
    assert.ok(
      Number(await canvas.getAttribute('data-frames')) > initial,
      'Keyboard rotation must draw'
    );
    if (i === 0) {
      await page.waitForTimeout(150);
      const stable = await canvas.getAttribute('data-frames');
      await page.waitForTimeout(200);
      assert.equal(
        await canvas.getAttribute('data-frames'),
        stable,
        'No idle rendering'
      );
      assert.ok(await canvas.evaluate((element) => element.width <= 1600));
      await screenshot(page, `scene-${device}`);
      await viewer.locator('[data-close-scene]').click();
      assert.equal(
        await viewer
          .locator('[data-open-scene]')
          .evaluate((element) => element === document.activeElement),
        true,
        'Closing the view must return keyboard focus to its open button'
      );
      await viewer.locator('[data-open-scene]').click();
      await viewer.locator('canvas').waitFor({ state: 'visible' });
      await viewer
        .locator('canvas')
        .evaluate((element) =>
          element
            .getContext('webgl')
            .getExtension('WEBGL_lose_context')
            .loseContext()
        );
      await viewer.locator('canvas').waitFor({ state: 'hidden' });
      assert.match(
        await viewer.locator('[role="status"]').textContent(),
        /rendered view remains available/
      );
      assert.equal(
        await viewer
          .locator('[data-open-scene]')
          .evaluate((element) => element === document.activeElement),
        true,
        'Context loss must leave keyboard focus on a visible control'
      );
    }
    console.log(`SCENE ${device}: ${i + 1}/22 opened and rotated`);
  }
  await viewers.last().locator('[data-close-scene]').click();
  // A failed download must preserve the rendered fallback and allow retry.
  await page.route('**/scene.json', (route) =>
    route.fulfill({ status: 503, body: 'Unavailable' })
  );
  await viewers.first().locator('[data-open-scene]').click();
  await page.waitForFunction(() =>
    document
      .querySelector('[data-scene] [role="status"]')
      .textContent.includes('unavailable')
  );
  assert.equal(await viewers.first().locator('canvas').isVisible(), false);
  assert.equal(await viewers.first().locator('img').isVisible(), true);
  await page.unroute('**/scene.json');
  // Switching scenes cancels a pending fetch before it can create a context.
  const firstURL = `${origin}/${await viewers.first().getAttribute('data-scene')}`;
  let release;
  let settled;
  const held = new Promise((resolve) => {
    release = resolve;
  });
  const routeDone = new Promise((resolve) => {
    settled = resolve;
  });
  await page.route(firstURL, async (route) => {
    try {
      await held;
      // The fetch cancellation can finish this route before it is released.
      if (!route.request().failure()) {
        await route.fulfill({ status: 503, body: 'Cancelled scene' });
      }
    } finally {
      settled();
    }
  });
  try {
    const cancelled = page.waitForEvent('requestfailed', {
      predicate: (request) => request.url() === firstURL,
    });
    await Promise.all([
      page.waitForRequest(firstURL),
      viewers.first().locator('[data-open-scene]').click(),
    ]);
    assert.equal(
      await viewers.first().locator('[data-open-scene]').isDisabled(),
      true
    );
    await viewers.nth(1).locator('[data-open-scene]').click();
    await viewers.nth(1).locator('canvas').waitFor({ state: 'visible' });
    assert.match((await cancelled).failure().errorText, /ABORTED/);
    assert.equal(await viewers.first().locator('canvas').isVisible(), false);
    assert.equal(
      await viewers.first().locator('[data-open-scene]').isEnabled(),
      true
    );
    await viewers.nth(1).locator('[data-close-scene]').click();
  } finally {
    release();
    await routeDone;
    await page.unroute(firstURL);
  }
}

async function everyGame() {
  let total = 0;
  let imageCount = 0;
  for (const family of Object.keys(FAMILIES)) {
    // Releasing each collection's context bounds decoded-image and cache memory.
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      reducedMotion: 'reduce',
    });
    try {
      const page = await context.newPage();
      page.on('pageerror', (error) => failures.push(error.message));
      for (const game of readCatalog(family)) {
        const id = game.id.toLowerCase();
        await page.goto(`${origin}/concepts/pages/${id}.html`);
        const expected =
          DIRECTIONS.length + extraStyleDirections(game, family).length;
        assert.equal(
          await page.locator(`img[src*="/art/${id}/"]`).count(),
          expected,
          `${id}: every concept must appear`
        );
        await images(page);
        imageCount += expected;
        total++;
      }
      console.log(
        `ART ${family}: all ${readCatalog(family).length} game pages decoded`
      );
    } finally {
      await context.close();
    }
  }
  assert.equal(total, 310);
  assert.equal(imageCount, 1672);
}

async function embeddedPreviews(page, device) {
  await page.goto(`${origin}/lore/scenery-pilots.html`);
  await images(page);
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
  assert.deepEqual(
    alignment,
    Array(22).fill(true),
    'Embedded previews must align with their 16:9 interactive stages'
  );
  console.log(`LAYOUT ${device}: all 22 embedded pilot previews align`);
}

try {
  for (const [device, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 390, 844],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion: 'reduce',
    });
    page.on('pageerror', (error) => failures.push(error.message));
    for (const [slug, path] of scenesOnly
      ? []
      : [
          ['home', ''],
          ['games', 'games.html'],
          ['toddler', 'concepts/pages/td-01.html'],
        ]) {
      await page.goto(`${origin}/${path}`, { waitUntil: 'networkidle' });
      if (!before) {
        await images(page);
      }
      await screenshot(page, `${slug}-${device}`);
      if (slug === 'games' && !before) {
        await page.locator('[name="collection"]').selectOption('td');
        assert.equal(await page.locator('#games > li:visible').count(), 30);
        await page.locator('[name="q"]').fill('peek');
        assert.ok((await page.locator('#games > li:visible').count()) > 0);
        assert.match(page.url(), /collection=td/);
        await page.goto(
          `${origin}/games.html?__proto__=ignored&collection=sh&age=3`
        );
        assert.equal(
          await page.locator('#games > li:visible').count(),
          0,
          'No Shacados for preschool ages'
        );
      }
    }
    if (!before) {
      await scenes(page, device);
      await embeddedPreviews(page, device);
    }
    await page.close();
  }
  if (!before) {
    if (!scenesOnly) {
      await everyGame();
    }
    const gpuPage = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    gpuPage.on('pageerror', (error) => failures.push(error.message));
    await gpuPage.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...options) {
        return type === 'webgl' ? null : original.call(this, type, ...options);
      };
    });
    await gpuPage.goto(`${origin}/worlds.html`);
    await gpuPage.locator('[data-open-scene]').first().click();
    await gpuPage.waitForFunction(() =>
      document
        .querySelector('[data-scene] [role="status"]')
        .textContent.includes('unavailable')
    );
    assert.equal(await gpuPage.locator('canvas:visible').count(), 0);
    assert.equal(
      await gpuPage.locator('[data-scene] img').first().isVisible(),
      true
    );
    await gpuPage.close();
    const highDPI = await browser.newPage({
      deviceScaleFactor: 3,
      viewport: { width: 390, height: 844 },
    });
    highDPI.on('pageerror', (error) => failures.push(error.message));
    await highDPI.goto(`${origin}/worlds.html?debugScene`);
    await highDPI.locator('[data-open-scene]').first().click();
    const denseCanvas = highDPI.locator('canvas').first();
    await denseCanvas.waitFor({ state: 'visible' });
    await highDPI.waitForFunction(
      () => Number(document.querySelector('canvas').dataset.frames) > 0
    );
    assert.equal(await highDPI.evaluate(() => window.devicePixelRatio), 3);
    assert.equal(
      await denseCanvas.evaluate(
        (element) =>
          element.width <=
          Math.min(
            1600,
            Math.round(element.getBoundingClientRect().width * 1.25)
          )
      ),
      true,
      'High-density devices must retain the capped drawing resolution'
    );
    console.log('BUDGET: device pixel ratio 3 retains the 1.25 rendering cap');
    await highDPI.close();
    const staticPage = await browser.newPage({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    await staticPage.goto(`${origin}/worlds.html`);
    assert.equal(
      await staticPage.locator('[data-open-scene]:visible').count(),
      0
    );
    assert.equal(await staticPage.locator('img').count(), 22);
    assert.deepEqual(
      await staticPage.locator('.scene-status').allTextContents(),
      Array(22).fill('Rendered view.'),
      'Static fallback must not advertise unavailable controls'
    );
    await staticPage.goto(`${origin}/games.html`);
    assert.equal(await staticPage.locator('#games > li').count(), 310);
    await staticPage.close();
  }
  assert.deepEqual(failures, [], 'No browser JavaScript errors');
  console.log(
    scenesOnly
      ? 'Scene verification passed: desktop/mobile, all 22 scenes, context loss, cancelled loads, unavailable WebGL, idle budget and static fallback.'
      : 'Browser verification passed: desktop/mobile, 1,672 images on all 310 game pages, filters, all 22 scenes, context loss, idle budget and no-JavaScript fallback.'
  );
} finally {
  await browser.close();
}
