// Complexity estimates for every game concept: validation and scoring.
// Data lives in docs/master-plan/concepts/estimates/; the formula is
// documented in docs/master-plan/development-plan.md.
import {
  FAMILIES,
  readCatalog,
  readEstimates,
  readLibrary,
} from './game-families.mjs';

export function loadGames() {
  const library = readLibrary();
  const games = [];
  for (const family of Object.keys(FAMILIES)) {
    const estimates = new Map(readEstimates(family).map((e) => [e.id, e]));
    for (const game of readCatalog(family)) {
      games.push({ ...game, family, estimate: estimates.get(game.id) });
    }
  }
  return { library, games };
}

export function computeEstimate(estimate, library) {
  const algorithms = new Map(library.algorithms.map((a) => [a.id, a]));
  const hours = new Map(library.assets.map((a) => [a.id, a.hours]));
  const used = estimate.algorithms.map((id) => algorithms.get(id));
  const loc =
    used.reduce((sum, algorithm) => sum + algorithm.loc, 0) + estimate.extraLoc;
  const assetHours = Object.entries(estimate.assets).reduce(
    (sum, [type, count]) => sum + hours.get(type) * count,
    0
  );
  const { locPerDay, assetHoursPerDay } = library.productivity;
  const codeDays = loc / locPerDay;
  const assetDays = assetHours / assetHoursPerDay;
  const effortDays = Math.round((codeDays + assetDays) * 10) / 10;
  const risk = Math.max(...used.map((algorithm) => algorithm.difficulty));
  const startScore =
    Math.round(effortDays * library.playFactor[estimate.toddler] * 10) / 10;
  return {
    loc,
    assetHours: Math.round(assetHours),
    codeDays: Math.round(codeDays * 10) / 10,
    assetDays: Math.round(assetDays * 10) / 10,
    effortDays,
    risk,
    startScore,
  };
}

const isCount = (value, max) =>
  Number.isInteger(value) && value >= 0 && value <= max;

function checkAlgorithms(e, algorithmIds) {
  if (!Array.isArray(e.algorithms) || e.algorithms.length === 0) {
    return ['needs at least one algorithm'];
  }
  const errors = e.algorithms
    .filter((id) => !algorithmIds.has(id))
    .map((id) => `unknown algorithm ${id}`);
  if (new Set(e.algorithms).size !== e.algorithms.length) {
    errors.push('repeats an algorithm');
  }
  return errors;
}

function checkAssets(e, assetIds) {
  if (!e.assets || typeof e.assets !== 'object') {
    return ['needs an assets object'];
  }
  return Object.entries(e.assets).flatMap(([type, count]) => [
    ...(assetIds.has(type) ? [] : [`unknown asset type ${type}`]),
    ...(isCount(count, 2000)
      ? []
      : [`asset count ${type} must be an integer from 0 to 2000`]),
  ]);
}

// [message, predicate that is true when the estimate breaks the rule]
const AGE_RULES = [
  [
    'toddler rating must be 1-5',
    (e) => !Number.isInteger(e.toddler) || e.toddler < 1 || e.toddler > 5,
  ],
  [
    'minAge must be 1-18',
    (e) => !Number.isInteger(e.minAge) || e.minAge < 1 || e.minAge > 18,
  ],
  [
    'a toddler rating of 4-5 needs minAge 3 or less',
    (e) => e.toddler >= 4 && e.minAge > 3,
  ],
  [
    'games for 6+ must have toddler rating 1',
    (e) => e.minAge >= 6 && e.toddler !== 1,
  ],
  [
    'toddler games need rating 3+ and minAge 3 or less',
    (e, family) => family === 'td' && (e.toddler < 3 || e.minAge > 3),
  ],
  [
    'Shacados games are for ages 10+',
    (e, family) => family === 'sh' && e.minAge < 10,
  ],
  [
    'extraLoc must be an integer from 0 to 5000',
    (e) => !isCount(e.extraLoc, 5000),
  ],
  [
    'plan must describe the first playable version (40+ characters)',
    (e) => typeof e.plan !== 'string' || e.plan.length < 40,
  ],
];

export function validateGames({ library, games }) {
  const algorithmIds = new Set(library.algorithms.map((a) => a.id));
  const assetIds = new Set(library.assets.map((a) => a.id));
  const gameIds = new Set(games.map((game) => game.id));
  const errors = Object.keys(FAMILIES).flatMap((family) =>
    readEstimates(family)
      .filter((estimate) => !gameIds.has(estimate.id))
      .map((estimate) => `${family}: estimate for unknown game ${estimate.id}`)
  );
  for (const game of games) {
    const e = game.estimate;
    const problems = e
      ? [
          ...checkAlgorithms(e, algorithmIds),
          ...checkAssets(e, assetIds),
          ...AGE_RULES.filter(([, broken]) => broken(e, game.family)).map(
            ([message]) => message
          ),
        ]
      : ['missing estimate'];
    errors.push(...problems.map((message) => `${game.id}: ${message}`));
  }
  return errors;
}
