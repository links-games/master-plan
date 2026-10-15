import { describe, expect } from 'test-anywhere';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { itUnless, noPosixShell, sandboxed } from './helpers/skip.js';

const scriptPath = fileURLToPath(
  new URL('../scripts/check-dependency-graph.sh', import.meta.url)
);

// Runs the probe with a fake `gh` that prints `ghOutput` and exits `ghExit`.
function runProbe({ eventName, ghExit, ghOutput = '' }) {
  const dir = mkdtempSync(path.join(tmpdir(), 'dependency-graph-'));
  try {
    const fakeGh = path.join(dir, 'gh');
    writeFileSync(
      fakeGh,
      `#!/usr/bin/env bash\necho "$*" >"${dir}/args"\necho '${ghOutput}' >&2\nexit ${ghExit}\n`
    );
    chmodSync(fakeGh, 0o755);
    const outputFile = path.join(dir, 'output');
    writeFileSync(outputFile, '');
    const result = spawnSync('bash', [scriptPath], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${dir}${path.delimiter}${process.env.PATH}`,
        REPOSITORY: 'links-games/example',
        EVENT_NAME: eventName,
        GITHUB_OUTPUT: outputFile,
      },
    });
    return {
      status: result.status,
      stdout: result.stdout,
      output: readFileSync(outputFile, 'utf8'),
      args: readFileSync(path.join(dir, 'args'), 'utf8'),
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('check-dependency-graph.sh', () => {
  itUnless(sandboxed, noPosixShell)(
    'enables dependency review when the SBOM endpoint answers',
    () => {
      const result = runProbe({ eventName: 'pull_request', ghExit: 0 });

      expect(result.status).toBe(0);
      expect(result.output).toBe('enabled=true\n');
      expect(result.args).toContain(
        'api repos/links-games/example/dependency-graph/sbom'
      );
    }
  );

  itUnless(sandboxed, noPosixShell)(
    'only warns on pull requests when the dependency graph is disabled',
    () => {
      const result = runProbe({
        eventName: 'pull_request',
        ghExit: 1,
        ghOutput: 'gh: Not Found (HTTP 404)',
      });

      expect(result.status).toBe(0);
      expect(result.output).toBe('enabled=false\n');
      expect(result.stdout).toContain(
        '::warning::Dependency graph is disabled'
      );
      expect(result.stdout).toContain(
        'https://github.com/links-games/example/settings/security_analysis'
      );
    }
  );

  itUnless(sandboxed, noPosixShell)(
    'fails on main pushes with the setting an admin must enable',
    () => {
      const result = runProbe({
        eventName: 'push',
        ghExit: 1,
        ghOutput: 'gh: Not Found (HTTP 404)',
      });

      expect(result.status).toBe(1);
      expect(result.output).toBe('enabled=false\n');
      expect(result.stdout).toContain('::error::Dependency graph is disabled');
      expect(result.stdout).toContain('Dependency graph -> Enable');
    }
  );

  itUnless(sandboxed, noPosixShell)(
    'fails closed when the API errors for another reason',
    () => {
      const result = runProbe({
        eventName: 'pull_request',
        ghExit: 1,
        ghOutput: 'gh: Server Error (HTTP 502)',
      });

      expect(result.status).toBe(1);
      expect(result.output).toBe('');
      expect(result.stdout).toContain('::error::Could not check');
    }
  );
});
