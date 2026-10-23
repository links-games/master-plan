// Check the built website's local links, fragments and lazily loaded assets.
// Run after scripts/build-site.mjs; no browser or network access is needed.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { URL, pathToFileURL, fileURLToPath } from 'node:url';

const root = resolve(process.argv[2] || '_site');
const base = pathToFileURL(`${root}${sep}`);
const pages = readdirSync(root, { recursive: true })
  .filter((path) => path.endsWith('.html'))
  .map((path) => join(root, path));
assert.ok(pages.length, 'No built HTML pages found');
const ids = new Map();
const problems = [];
let checked = 0;

for (const path of pages) {
  ids.set(
    path,
    new Set(
      [...readFileSync(path, 'utf8').matchAll(/\bid="([^"]+)"/g)].map(
        (match) => match[1]
      )
    )
  );
}

for (const path of pages) {
  const html = readFileSync(path, 'utf8');
  const references = [
    ...html.matchAll(/\b(?:href|src|data-scene)="([^"]+)"/g),
  ].map((match) => match[1]);
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    references.push(
      ...match[1].split(',').map((value) => value.trim().split(/\s+/)[0])
    );
  }
  for (const reference of references) {
    const url = new URL(
      reference.replaceAll('&amp;', '&'),
      pathToFileURL(path)
    );
    if (url.protocol !== 'file:') {
      continue;
    }
    let target = fileURLToPath(url);
    const from = relative(root, path);
    if (!url.href.startsWith(base.href)) {
      problems.push(`${from}: escapes website root: ${reference}`);
      continue;
    }
    if (existsSync(target) && statSync(target).isDirectory()) {
      target = join(target, 'index.html');
    }
    checked++;
    if (!existsSync(target)) {
      problems.push(`${from}: missing ${reference}`);
    } else if (
      url.hash &&
      ids.has(target) &&
      !ids.get(target).has(decodeURIComponent(url.hash.slice(1)))
    ) {
      problems.push(`${from}: missing fragment ${reference}`);
    }
  }
}

for (const problem of problems) {
  console.error(problem);
}
assert.equal(
  problems.length,
  0,
  `${problems.length} broken website references`
);
console.log(
  `Verified ${checked} local references across ${pages.length} HTML pages.`
);
