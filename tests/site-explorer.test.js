import { describe, it, expect } from 'test-anywhere';
import { readFileSync } from 'node:fs';
import { URL, URLSearchParams } from 'node:url';
import { runInNewContext } from 'node:vm';

const source = readFileSync(
  new URL('../site/explorer.js', import.meta.url),
  'utf8'
);

// Runs explorer.js against a minimal fake DOM: a form with named fields, a
// list of cards with data-* attributes, and the page URL's query string.
function runExplorer(search) {
  const field = (name, value = '') => ({ name, value });
  const fields = [field('q'), field('collection'), field('sort', 'start')];
  const elements = Object.assign([...fields], {
    namedItem: (name) => fields.find((f) => f.name === name) ?? null,
  });
  for (const f of fields) {
    elements[f.name] = f;
  }
  const form = { elements, addEventListener: () => {} };
  const card = (id, family, start) => ({
    hidden: false,
    dataset: { id, family, start, search: id.toLowerCase() },
  });
  const cards = [card('B-02', 'b', '2'), card('A-01', 'a', '1')];
  const order = [];
  const list = {
    querySelectorAll: () => cards,
    append: (c) => order.push(c.dataset.id),
  };
  const count = { textContent: '' };
  const nodes = { '#filters': form, '#games': list, '#count': count };
  const urls = [];
  runInNewContext(source, {
    document: { querySelector: (selector) => nodes[selector] },
    window: { location: { search, pathname: '/games.html' } },
    history: { replaceState: (_, __, url) => urls.push(url) },
    URLSearchParams,
    FormData: class {
      constructor(target) {
        this.target = target;
      }
      entries() {
        return [...this.target.elements].map((f) => [f.name, f.value]);
      }
    },
  });
  return { cards, count, order, urls };
}

describe('game explorer (site/explorer.js)', () => {
  it('restores the filters from the URL and sorts by start score', () => {
    const { cards, count, order, urls } = runExplorer('?collection=a');
    expect(order).toEqual(['A-01', 'B-02']);
    expect(cards.map((c) => c.hidden)).toEqual([true, false]);
    expect(count.textContent).toBe('1 of 2 games');
    expect(urls.at(-1)).toBe('?collection=a');
  });

  it('ignores query keys that are not form fields', () => {
    runExplorer('?__proto__=polluted&constructor=x&namedItem=y');
    expect({}.value).toBe(undefined);
    expect([].value).toBe(undefined);
  });

  it('falls back to the start sort for unknown sort names', () => {
    for (const sort of ['constructor', 'toString', '__proto__', 'nope']) {
      expect(runExplorer(`?sort=${sort}`).order).toEqual(['A-01', 'B-02']);
    }
  });
});
