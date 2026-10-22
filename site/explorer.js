/* global document, window, history, URLSearchParams, FormData */
// Filters and sorts the game cards of games.html. Every card carries its
// data in data-* attributes; the form state is mirrored in the URL query so
// a filtered list can be shared.
const form = document.querySelector('#filters');
const list = document.querySelector('#games');
const count = document.querySelector('#count');
const cards = [...list.querySelectorAll('.card')];

const number = (card, key) => Number(card.dataset[key]);

const SORTS = {
  start: (a, b) => number(a, 'start') - number(b, 'start'),
  days: (a, b) => number(a, 'days') - number(b, 'days'),
  toddler: (a, b) =>
    number(b, 'toddler') - number(a, 'toddler') ||
    number(a, 'days') - number(b, 'days'),
  age: (a, b) =>
    number(a, 'age') - number(b, 'age') ||
    number(a, 'start') - number(b, 'start'),
  id: (a, b) => a.dataset.id.localeCompare(b.dataset.id),
};

function matches(card, filters) {
  const checks = [
    !filters.q || card.dataset.search.includes(filters.q),
    !filters.collection || card.dataset.family === filters.collection,
    !filters.age || number(card, 'age') <= Number(filters.age),
    !filters.toddler || number(card, 'toddler') >= Number(filters.toddler),
    !filters.days || number(card, 'days') <= Number(filters.days),
    !filters.art || card.dataset.art === filters.art,
  ];
  return checks.every(Boolean);
}

function apply() {
  const data = new FormData(form);
  const filters = Object.fromEntries(data.entries());
  filters.q = (filters.q || '').trim().toLowerCase();
  const sort = Object.hasOwn(SORTS, filters.sort)
    ? SORTS[filters.sort]
    : SORTS.start;
  const sorted = [...cards].sort(sort);
  let shown = 0;
  for (const card of sorted) {
    card.hidden = !matches(card, filters);
    shown += card.hidden ? 0 : 1;
    list.append(card);
  }
  count.textContent = `${shown} of ${cards.length} games`;
  const query = new URLSearchParams(
    [...data.entries()].filter(
      ([key, value]) => value && !(key === 'sort' && value === 'start')
    )
  ).toString();
  history.replaceState(
    null,
    '',
    query ? `?${query}` : window.location.pathname
  );
}

// Only the form's own fields are restored, so a query key such as
// __proto__ never reaches a property assignment.
const fields = new Map(
  [...form.elements]
    .filter((field) => field.name)
    .map((field) => [field.name, field])
);
for (const [key, value] of new URLSearchParams(window.location.search)) {
  if (fields.has(key)) {
    fields.get(key).value = value;
  }
}
form.addEventListener('input', apply);
form.addEventListener('submit', (event) => event.preventDefault());
apply();
