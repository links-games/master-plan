import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { SCENES } from './lore-scenes.mjs';

export function validateSceneAssets(root = 'examples/lore-scenes/assets') {
  const manifest = JSON.parse(readFileSync(join(root, 'manifest.json')));
  for (const entry of manifest) {
    assert.equal(entry.license, 'CC0-1.0');
    assert.ok(entry.url.startsWith('https://dl.polyhaven.org/'));
    assert.ok(!entry.file.split('/').includes('..'));
    const data = readFileSync(join(root, entry.file));
    assert.equal(data.length, entry.bytes, `${entry.file}: source bytes`);
    assert.equal(
      createHash('sha256').update(data).digest('hex'),
      entry.sha256,
      `${entry.file}: source checksum`
    );
  }
  return manifest;
}

export function validateScenes(
  root = 'docs/master-plan/lore/scenes',
  specs = SCENES
) {
  const hashes = new Set();
  const reports = [];
  for (const spec of specs) {
    const path = join(root, spec.id);
    const manifest = JSON.parse(readFileSync(join(path, 'manifest.json')));
    assert.equal(manifest.id, spec.id);
    assert.equal(manifest.seed, spec.seed);
    for (const name of [
      'render.py',
      'detail.py',
      'trees.py',
      'scenes.json',
      'assets/manifest.json',
    ]) {
      assert.equal(
        manifest.sourceInputs[name],
        createHash('sha256')
          .update(readFileSync(join('examples/lore-scenes', name)))
          .digest('hex'),
        `${spec.id}: render source ${name}`
      );
    }
    assert.equal(manifest.engine, 'Cycles CPU');
    assert.equal(manifest.denoiser, 'OpenImageDenoise');
    assert.ok(manifest.samples >= 64 && manifest.samples <= 128);
    assert.deepEqual(manifest.resolution, [1280, 720]);
    for (const name of [
      'environment.blend',
      'poster.png',
      'poster.webp',
      'scene.json',
    ]) {
      const data = readFileSync(join(path, name));
      assert.equal(
        data.length,
        manifest.files[name].bytes,
        `${spec.id}: ${name} bytes`
      );
      assert.equal(
        createHash('sha256').update(data).digest('hex'),
        manifest.files[name].sha256,
        `${spec.id}: ${name} hash`
      );
    }
    const png = readFileSync(join(path, 'poster.png'));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.deepEqual(
      [png.readUInt32BE(16), png.readUInt32BE(20)],
      manifest.resolution
    );
    const webp = readFileSync(join(path, 'poster.webp'));
    assert.equal(webp.subarray(0, 4).toString(), 'RIFF');
    assert.equal(webp.subarray(8, 12).toString(), 'WEBP');
    assert.ok(webp.length < 500000, `${spec.id}: web preview budget`);
    const raw = readFileSync(join(path, 'scene.json'));
    const mesh = JSON.parse(raw);
    assert.equal(mesh.version, 1);
    assert.equal(mesh.id, spec.id);
    assert.equal(mesh.positions.length, mesh.colors.length);
    assert.equal(mesh.positions.length, mesh.triangles * 9);
    assert.ok(
      mesh.triangles > 100 && mesh.triangles <= 60000,
      `${spec.id}: geometry budget`
    );
    assert.equal(mesh.triangles, manifest.triangles);
    assert.ok(mesh.positions.every(Number.isFinite));
    assert.ok(mesh.colors.every((n) => Number.isFinite(n) && n >= 0 && n <= 1));
    for (const name of ['camera', 'target', 'background']) {
      assert.equal(mesh[name].length, 3);
      assert.ok(mesh[name].every(Number.isFinite));
    }
    assert.ok(Math.hypot(...mesh.camera.map((n, i) => n - mesh.target[i])) > 1);
    assert.ok(raw.length <= 4000000, `${spec.id}: raw geometry budget`);
    const compressed = gzipSync(raw).length;
    assert.ok(compressed <= 600000, `${spec.id}: compressed geometry budget`);
    assert.ok(
      !hashes.has(manifest.files['scene.json'].sha256),
      `${spec.id}: unique environment`
    );
    hashes.add(manifest.files['scene.json'].sha256);
    reports.push({
      id: spec.id,
      triangles: mesh.triangles,
      geometryBytes: raw.length,
      gzipBytes: compressed,
      posterBytes: webp.length,
    });
  }
  assert.equal(reports.length, specs.length);
  return reports;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  validateSceneAssets();
  const batch = process.argv[3]?.split('/').map(Number);
  if (batch) {
    assert.ok(
      batch.length === 2 &&
        batch.every(Number.isInteger) &&
        batch[0] >= 0 &&
        batch[0] < batch[1] &&
        batch[1] <= 22
    );
  }
  const specs = batch
    ? SCENES.filter((scene, i) => i % batch[1] === batch[0])
    : SCENES;
  console.log(JSON.stringify(validateScenes(process.argv[2], specs), null, 2));
}
