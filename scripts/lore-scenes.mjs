import { readFileSync } from 'node:fs';

export const SCENES = JSON.parse(
  readFileSync('examples/lore-scenes/scenes.json', 'utf8')
);
