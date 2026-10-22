import { describe, it, expect } from 'test-anywhere';
import { readFileSync } from 'node:fs';

// The AI pipeline templates live under docs/ so they do not run in this
// repository; game repositories copy them (docs/master-plan/ai-pipeline.md).
const templatesDir = 'docs/master-plan/templates/workflows';
const reusable = readText(`${templatesDir}/ai-solve-reusable.yml`);
const caller = readText(`${templatesDir}/ai-solve.yml`);

function readText(filePath) {
  return readFileSync(filePath, 'utf8').replaceAll('\r\n', '\n');
}

// Extracts the `actions/github-script` body of the decide job.
function decideScript() {
  const lines = reusable.split('\n');
  const start = lines.findIndex((line) => line === '          script: |');
  const body = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() !== '' && !line.startsWith('            ')) {
      break;
    }
    body.push(line.slice(12));
  }
  return body.join('\n');
}

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

async function decide({ eventName, payload, comments = {}, pulls = [] }) {
  const outputs = {};
  const env = {
    TRIGGER_LABEL: 'ai-solve',
    DRAFT_LABEL: 'ai-draft',
    OPT_OUT_LABEL: 'no-ai',
    MAX_SWEEP_ATTEMPTS: '5',
    DISPATCH_TARGET: payload.dispatchTarget ?? '',
  };
  const listComments = Symbol('listComments');
  const listPulls = Symbol('listPulls');
  const github = {
    rest: {
      issues: {
        listComments,
        get: async ({ issue_number }) => ({
          data: { pull_request: issue_number === 7 ? {} : undefined },
        }),
      },
      pulls: { list: listPulls },
    },
    paginate: async (method, params) =>
      method === listPulls ? pulls : (comments[params.issue_number] ?? []),
  };
  const context = {
    eventName,
    payload,
    repo: { owner: 'links-games', repo: 'memory-pairs' },
  };
  const core = {
    info: () => {},
    setOutput: (name, value) => {
      outputs[name] = value;
    },
  };
  const run = new AsyncFunction(
    'github',
    'context',
    'core',
    'process',
    decideScript()
  );
  await run(github, context, core, { env });
  return JSON.parse(outputs.targets);
}

// Timestamps for comments and pull requests, ordered by day number.
const day = (n) => new Date(Date.UTC(2026, 0, n)).toISOString();

const human = { login: 'konard', type: 'User' };
const bot = { login: 'github-actions[bot]', type: 'Bot' };

describe('AI solve workflow template: issue events', () => {
  it('solves an issue opened by a maintainer', async () => {
    const targets = await decide({
      eventName: 'issues',
      payload: {
        action: 'opened',
        sender: human,
        issue: { number: 3, author_association: 'OWNER', labels: [] },
      },
    });
    expect(targets).toEqual([
      {
        key: 'issue-3',
        kind: 'issue',
        number: 3,
        url: 'https://github.com/links-games/memory-pairs/issues/3',
        comment_id: '',
      },
    ]);
  });

  it('ignores issues opened by strangers until a maintainer labels them', async () => {
    const issue = { number: 4, author_association: 'NONE', labels: [] };
    const opened = await decide({
      eventName: 'issues',
      payload: { action: 'opened', sender: human, issue },
    });
    expect(opened).toEqual([]);

    const labeled = await decide({
      eventName: 'issues',
      payload: {
        action: 'labeled',
        label: { name: 'ai-solve' },
        sender: human,
        issue,
      },
    });
    expect(labeled.map((t) => t.key)).toEqual(['issue-4']);
  });

  it('respects the opt-out label', async () => {
    const targets = await decide({
      eventName: 'issues',
      payload: {
        action: 'opened',
        sender: human,
        issue: {
          number: 5,
          author_association: 'OWNER',
          labels: [{ name: 'no-ai' }],
        },
      },
    });
    expect(targets).toEqual([]);
  });
});

describe('AI solve workflow template: restarts', () => {
  it('restarts the same pull request on a /retry comment', async () => {
    const targets = await decide({
      eventName: 'issue_comment',
      payload: {
        comment: {
          id: 99,
          body: '/retry please',
          author_association: 'MEMBER',
          user: human,
        },
        issue: { number: 7, pull_request: {}, labels: [] },
      },
    });
    expect(targets).toEqual([
      {
        key: 'pr-7',
        kind: 'pr',
        number: 7,
        url: 'https://github.com/links-games/memory-pairs/pull/7',
        comment_id: '99',
      },
    ]);
  });

  it('ignores commands from bots and untrusted users', async () => {
    const fromBot = await decide({
      eventName: 'issue_comment',
      payload: {
        comment: {
          id: 1,
          body: '/solve',
          author_association: 'MEMBER',
          user: bot,
        },
        issue: { number: 8, labels: [] },
      },
    });
    const fromStranger = await decide({
      eventName: 'issue_comment',
      payload: {
        comment: {
          id: 2,
          body: '/solve',
          author_association: 'NONE',
          user: human,
        },
        issue: { number: 8, labels: [] },
      },
    });
    expect(fromBot).toEqual([]);
    expect(fromStranger).toEqual([]);
  });

  it('restarts on a changes-requested review of an issue branch', async () => {
    const targets = await decide({
      eventName: 'pull_request_review',
      payload: {
        review: {
          state: 'changes_requested',
          author_association: 'OWNER',
          user: human,
        },
        pull_request: {
          number: 9,
          head: { ref: 'issue-3-abc123' },
          labels: [],
        },
      },
    });
    expect(targets.map((t) => t.url)).toEqual([
      'https://github.com/links-games/memory-pairs/pull/9',
    ]);
  });

  it('resolves a manual dispatch number to an issue or a pull request', async () => {
    const pr = await decide({
      eventName: 'workflow_dispatch',
      payload: { dispatchTarget: '7' },
    });
    const issue = await decide({
      eventName: 'workflow_dispatch',
      payload: { dispatchTarget: '3' },
    });
    expect(pr.map((t) => t.key)).toEqual(['pr-7']);
    expect(issue.map((t) => t.key)).toEqual(['issue-3']);
  });

  it('sweeps only AI pull requests with new human feedback and attempts left', async () => {
    const marker = (at) => ({
      user: bot,
      body: '<!-- ai-solve-attempt --> done',
      created_at: at,
    });
    const feedback = (at) => ({
      user: human,
      body: 'Not cute',
      created_at: at,
    });
    const pulls = [
      { number: 10, created_at: day(1), labels: [{ name: 'ai-draft' }] },
      { number: 11, created_at: day(1), labels: [{ name: 'ai-draft' }] },
      { number: 12, created_at: day(1), labels: [{ name: 'ai-draft' }] },
      { number: 13, created_at: day(1), labels: [] },
    ];
    const comments = {
      10: [marker(day(2)), feedback(day(3))],
      11: [feedback(day(2)), marker(day(3))],
      12: [1, 2, 3, 4, 5].map((d) => marker(day(d))).concat(feedback(day(9))),
      13: [feedback(day(2))],
    };
    const targets = await decide({
      eventName: 'schedule',
      payload: {},
      pulls,
      comments,
    });
    expect(targets.map((t) => t.key)).toEqual(['pr-10']);
  });
});

describe('AI solve workflow template: solve job', () => {
  it('runs the latest formal-ai through hive-mind solve', () => {
    expect(reusable).toContain(
      'default: ghcr.io/link-assistant/formal-ai:latest'
    );
    expect(reusable).toContain('default: konard/hive-mind:latest');
    expect(reusable).toContain('docker cp "$id:/usr/local/bin/formal-ai"');
    expect(reusable).toContain(
      '-v "$RUNNER_TEMP/formal-ai:/usr/local/bin/formal-ai:ro"'
    );
    expect(reusable).toContain('solve "$TARGET_URL"');
    expect(reusable).toContain('--attribution formal-ai');
  });

  it('continues the existing pull request of the issue', () => {
    expect(reusable).toContain('--auto-continue');
    expect(reusable).toContain('HIVE_MIND_AUTO_CONTINUE_AGE_HOURS=0');
  });

  it('queues every attempt on the same target', () => {
    expect(reusable).toContain(
      'group: ai-solve-${{ github.repository }}-${{ matrix.target.key }}'
    );
    expect(reusable).toContain('cancel-in-progress: false');
    expect(reusable).toContain('queue: max');
  });

  it('never merges or closes pull requests on its own', () => {
    expect(reusable).not.toContain('--auto-merge');
    expect(reusable).not.toContain('--auto-close-pull-request-on-fail');
  });

  it('forwards secrets by name, never as values in the docker argv', () => {
    const dockerRun = reusable.slice(
      reusable.indexOf('docker run --rm'),
      reusable.indexOf('--no-auto-restart-on-uncommitted-changes')
    );
    expect(dockerRun).not.toContain('${{ secrets.');
    expect(dockerRun).toContain('-e GH_TOKEN');
  });

  it('starts with no permissions and sets them per job', () => {
    expect(reusable).toContain('permissions: {}');
    expect(reusable).toContain('timeout-minutes: 90');
  });
});

describe('AI solve workflow template: caller', () => {
  it('listens to every restart trigger and calls the shared workflow', () => {
    for (const trigger of [
      'issues:',
      'issue_comment:',
      'pull_request_review:',
      'schedule:',
      'workflow_dispatch:',
    ]) {
      expect(caller).toContain(trigger);
    }
    expect(caller).toContain(
      'uses: links-games/.github/.github/workflows/ai-solve.yml@main'
    );
    expect(caller).toContain('secrets: inherit');
  });
});
