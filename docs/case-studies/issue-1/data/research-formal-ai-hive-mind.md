# Research: Formal AI + Hive Mind for issue-driven CI/CD in `links-games`

Research date: 2026-10-15. Context: [links-games/master-plan#1](https://github.com/links-games/master-plan/issues/1).

Goal under study: for every game repository in the `links-games` org, when an issue is
opened (or labeled / commented with a command), a GitHub Actions workflow runs the
**latest** [`link-assistant/formal-ai`](https://github.com/link-assistant/formal-ai) to
produce results, and a pull request is created automatically the way
[`link-assistant/hive-mind`](https://github.com/link-assistant/hive-mind) does it. The
workflow must be restartable repeatedly on the same PR.

Snapshots inspected (shallow clones, read-only):

| Repository | Commit | Date |
|---|---|---|
| link-assistant/formal-ai | `8d2430d5` | 2026-10-13 |
| link-assistant/hive-mind | `e5c7266e` | 2026-10-14 |
| anthropics/claude-code-action | `a26b07d8` | 2026-10-14 |
| link-foundation/.github | `b55a5bf3` | 2026-10-07 |

---

## 1. Formal AI (`link-assistant/formal-ai`)

### 1.1 What it is

- Repository description: "Symbolic first, formal, logical, and data driven associative
  language processor". Source: https://github.com/link-assistant/formal-ai
- README: "Formal AI is a Rust implementation of a symbolic, deterministic assistant that
  exposes OpenAI-shaped interfaces without neural-network inference."
  Source: https://github.com/link-assistant/formal-ai/blob/main/README.md
- It serves OpenAI-, Anthropic- and Gemini-compatible HTTP APIs. The OpenAI endpoint is
  `/api/openai/v1/chat/completions` with model id `formal-ai`. Knowledge is stored as
  Links Notation (`.lino`) and in a doublets links store.
- Language and version: Rust crate `formal-ai`, `version = "0.353.2"` in
  [`rust/Cargo.toml`](https://github.com/link-assistant/formal-ai/blob/main/rust/Cargo.toml).
  Key Rust dependencies: `links-notation 0.23`, `lino-objects-codec 0.8`,
  `lino-arguments 0.4`, `link-calculator 0.22`, `meta-language 1.0` (optional),
  `command-stream 1.5`, `clap 4.6`.
- The web UI (`package.json`) uses React 19.3, `@chakra-ui/react` 3, `lino-i18n`,
  `mermaid` and `marked`. The desktop shell (`desktop/package.json`) uses Electron 44 and
  electron-builder 26. This is a useful precedent for the React + Electron part of the
  links-games stack. Capacitor is not used by formal-ai; it appears only as a how-to
  example in `docs/case-studies/issue-991`.

### 1.2 Release channels: how to get the latest version

| Channel | Latest seen | Notes | Source |
|---|---|---|---|
| crates.io `formal-ai` | 0.353.2 (2026-10-13), 8,394 downloads | `cargo install formal-ai` builds from source. It is slow (several minutes) and needs a recent Rust toolchain. | https://crates.io/crates/formal-ai |
| GHCR `ghcr.io/link-assistant/formal-ai` | tags `latest`, `slim`, `0.353.2`, `0.353.2-slim` (168 tags in total) | Public. An anonymous registry token works. The binary is at `/usr/local/bin/formal-ai`. Built by `.github/workflows/release.yml` (`GHCR_IMAGE: ghcr.io/${{ github.repository }}`) and `docker-slim.yml`. | https://github.com/link-assistant/formal-ai/pkgs/container/formal-ai |
| GitHub Releases | v0.352.1 (2026-09-27) | Assets are desktop only (AppImage, deb, dmg, exe), a `.vsix`, `SHA256SUMS.txt` and `BUILD-PROVENANCE.txt`. There is **no standalone CLI archive**. | https://github.com/link-assistant/formal-ai/releases |
| Install script | n/a | `curl -fsSL https://raw.githubusercontent.com/link-assistant/formal-ai/main/scripts/install.sh \| sh -s -- cli`. With no CLI release asset, it falls back to `cargo install formal-ai`. | README |
| Baked into hive-mind images | 0.353.2 (**pinned**) | `ARG FORMAL_AI_VERSION=0.353.2` in hive-mind `Dockerfile` / `Dockerfile.dind`. | https://github.com/link-assistant/hive-mind/blob/main/Dockerfile |

README: "Prepared Docker-in-Docker Telegram bot image published as
`ghcr.io/link-assistant/formal-ai:latest` and based on `konard/box-dind:2.10.2`".

**Fastest way to get the LATEST CLI in CI.** Pull the GHCR image and copy the binary out.
This is what formal-ai's own composite action does in
[`scripts/extract-formal-ai-binary.sh`](https://github.com/link-assistant/formal-ai/tree/main/.github/actions/author-with-formal-ai):

```sh
docker pull --quiet "$image"
container=$(docker create "$image")
docker cp "$container:/usr/local/bin/formal-ai" target/release/formal-ai
```

Two caveats:

- The crates.io version (0.353.2) can run ahead of the GitHub Release tag (v0.352.1). GHCR
  tags track crates.io.
- To pin reproducibly, record the image digest, or record the output of
  `formal-ai --version`.

### 1.3 CLI surface

The CLI subcommands come from the `Command` enum in
[`rust/src/main.rs`](https://github.com/link-assistant/formal-ai/blob/main/rust/src/main.rs).
They include `chat`, `dataset`, `translate`, `coding`, `context`, `report`, `serve`,
`connect`, `proxy`, `memory`, `bundle`, `clients`, `benchmark`, `solve`, `with`, `agent`,
`telegram`, `improve`, `learn` and `explain`.

README quick start:

```sh
cargo run --manifest-path rust/Cargo.toml -- chat --prompt "Hi"
formal-ai serve --host 127.0.0.1 --port 8080        # HTTP API
formal-ai serve --ws                                # WebSocket
formal-ai connect --transport websocket --prompt 'Hi'
```

`formal-ai serve --agent-mode` is the mode hive-mind uses as an LLM backend.
`formal-ai with --global --no-start-server --base-url <url> <tool>` writes the
configuration for a coding-agent tool so that it points at the local server.

`formal-ai solve`, from
[`rust/src/cli_solve.rs`](https://github.com/link-assistant/formal-ai/blob/main/rust/src/cli_solve.rs),
is documented as "one repository task, end to end, refusing to commit by default". Its
flags are an issue URL, `--commit`, `--produces/--into/--seed/--contains`,
`--pull-request` and `--message`. The source says "Wave T lands the shapes only", so this
native `solve` is **partially implemented**. Today, issue-to-PR flows go through
hive-mind (section 2) or through the composite action (1.5).

### 1.4 The "associative tech stack" document

Source: [`docs/associative-tech-stack.md`](https://github.com/link-assistant/formal-ai/blob/main/docs/associative-tech-stack.md), 232 lines.

Quote: "Formal AI stores inspectable knowledge as a links network with Links Notation as
its portable text representation."

- **Direct runtime components:**
  - link-cli (feature `doublets-native`, `rust/src/link_store.rs`), with doublets-rs as a
    transitive dependency
  - links-notation
  - lino-objects-codec
  - meta-language (CST/AST engine, `rust/src/coding/cst.rs`)
  - link-calculator
  - lino-arguments
  - lino-i18n
  - doublets-web (browser store)
- **Architecture-only (not yet linked in):** relative-meta-logic, meta-theory, transformer.
- **Development-time:** Agent CLI (`link-assistant/agent`) and Hive Mind, which are used
  to develop formal-ai itself.

The document does not prescribe a game or UI stack. React, Capacitor and Electron are not
part of it, although formal-ai itself ships a React web UI and an Electron desktop app.

### 1.5 Ready-made composite GitHub Action: `author-with-formal-ai`

Documentation:
[`docs/github-action.md`](https://github.com/link-assistant/formal-ai/blob/main/docs/github-action.md).
Action:
[`.github/actions/author-with-formal-ai/action.yml`](https://github.com/link-assistant/formal-ai/blob/main/.github/actions/author-with-formal-ai/action.yml),
224 lines.

Documented install (abridged):

```yaml
on:
  issues:
    types: [opened]
permissions: {}
concurrency:
  group: formal-ai-draft-${{ github.event.issue.number }}
  cancel-in-progress: false
jobs:
  draft:
    runs-on: ubuntu-latest
    permissions: { contents: write, pull-requests: write, issues: write }
    env:
      GH_TOKEN: ${{ secrets.FORMAL_AI_BOT_TOKEN || github.token }}
    steps:
      - uses: actions/checkout@v7
        with: { fetch-depth: 0 }
      - uses: link-assistant/formal-ai/.github/actions/author-with-formal-ai@main
        with:
          require-contract: 'false'
```

Inputs, with their defaults:

| Input | Default |
|---|---|
| `issue` | (none) |
| `label` | `formal-ai-solve` |
| `require-contract` | `true` |
| `formal-ai-source` | `container` (alternative: `source`) |
| `formal-ai-image` | `ghcr.io/link-assistant/formal-ai:latest` |
| `formal-ai-ref` | `main` |
| `agent-version` | `0.26.0` |
| `base-branch` | (none) |
| `starting-ref` | (none) |
| `port` | `8931` |
| `evidence-root` | `dev/log/self-authored` |

Outputs: `pull-request`, `issue`, `authored`.

Task contract lines in the issue body: `task:`, `seed:`, `produces:`, `into:`,
`contains:`, `message:`.

Steps:

1. Stage the scripts, fetched from raw.githubusercontent at `formal-ai-ref`.
2. Resolve the task.
3. Run `oven-sh/setup-bun@v2`, then `bun add -g @link-assistant/agent@<agent-version>`.
4. Extract the binary from the container.
5. Open a draft PR.
6. Author the change.
7. Push.
8. Return to the starting branch.
9. Comment on failure.
10. Upload the evidence artifact.

PR mechanics, from `scripts/open-formal-ai-pull-request.sh`:

- It reuses an existing open PR whose head starts with `formal-ai/issue-$NUMBER-`, and
  *merges* (does not rebase) the base branch into it.
- Otherwise it creates branch `formal-ai/issue-$NUMBER-$GITHUB_RUN_ID`, writes an evidence
  README, commits it, and runs `gh pr create --draft`.

Restart safety. Quote: "A re-run does not author the task twice: the guard counts commits
on the pull request that carry its own trailer".

Token caveat. Quote: "A push or pull request made with `GITHUB_TOKEN` starts no workflow
run… Provide `FORMAL_AI_BOT_TOKEN`". In addition, `author-formal-ai-change.sh` refuses to
target `.github/workflows/*` without that token, because `GITHUB_TOKEN` has no
`workflows` scope.

The doc lists open known defects
[#1095](https://github.com/link-assistant/formal-ai/issues/1095),
[#1096](https://github.com/link-assistant/formal-ai/issues/1096) and
[#1099](https://github.com/link-assistant/formal-ai/issues/1099).

formal-ai's own usage is in
[`.github/workflows/self-authored-pull-request.yml`](https://github.com/link-assistant/formal-ai/blob/main/.github/workflows/self-authored-pull-request.yml):

- Triggers: `release: published`, `workflow_call`, `workflow_dispatch` (issue input),
  `issues: labeled` (`formal-ai-solve`), `pull_request` (paths) and `schedule`.
- `timeout-minutes: 30`.
- Job-level `concurrency: { group: formal-ai-repository-writes, queue: max }`.

### 1.6 Maturity, an honest assessment

[`ROADMAP.md`](https://github.com/link-assistant/formal-ai/blob/main/ROADMAP.md) benchmark
table:

| Benchmark | Score |
|---|---|
| HumanEval | 21/164 |
| MBPP | 68/500 |
| GSM8K | 2/20 |
| MATH | 0/20 |
| SWE-bench Lite | 0/1 |

There are about 72 open issues. Formal AI is deterministic and free to run (no API key),
but it is **not yet capable of solving general game-development issues**. In practice the
pipeline will mostly produce draft PRs with evidence and logs, plus small templated
changes. Plan the workflow so the tool is pluggable: formal-ai by default, with stronger
agents opt-in.

---

## 2. Hive Mind (`link-assistant/hive-mind`)

### 2.1 Distribution

- npm: [`@link-assistant/hive-mind`](https://www.npmjs.com/package/@link-assistant/hive-mind)
  v2.36.0 (2026-10-14).
  - Bins: `hive`, `solve`, `task`, `fix`, `review`, `hive-cleanup`, `configure-claude`,
    `start-screen`, `hive-screens`, `hive-models`, `hive-telegram-bot`.
  - Install with `bun install -g @link-assistant/hive-mind` (or `npm install -g`).
- Docker Hub: [`konard/hive-mind`](https://hub.docker.com/r/konard/hive-mind) with tags
  `latest` and `2.36.0`; Docker-in-Docker variant `konard/hive-mind-dind`.
  - The images bake formal-ai at a **pinned** version:
    `ARG FORMAL_AI_VERSION=0.353.2`, then
    `cargo install formal-ai --version ${FORMAL_AI_VERSION} --locked`, then copy to
    `/usr/local/bin/formal-ai`.
  - `Dockerfile.formal-ai` runs
    `CMD ["formal-ai","serve","--agent-mode","--host","0.0.0.0","--port","8080"]`.

### 2.2 `solve` options relevant to CI

Source: [`src/solve.config.lib.mjs`](https://github.com/link-assistant/hive-mind/blob/main/src/solve.config.lib.mjs).

| Option | Default | Description / note |
|---|---|---|
| `--tool` | `claude` | Choices: `claude`, `opencode`, `codex`, `agent`, `qwen`, `gemini` |
| `--model` | per tool | `--tool agent --model formal-ai` uses the local Formal AI server |
| `--attribution` | `auto` | Choices: `auto`, `formal-ai`, `none` |
| `--auto-pull-request-creation` | true | Creates the draft PR before the AI runs |
| `--gitkeep-file` / `--auto-gitkeep-file` | true / true | `--claude-file` defaults to false |
| `--fork` / `--auto-fork` | false / true | Fork automatically when there is no write access |
| `--base-branch` | repo default | |
| `--auto-continue` | **true** | "Continue with existing PR when issue URL is provided" |
| `--auto-continue-only-on-new-comments` | false | |
| `--continue-only-on-feedback` | false | |
| `--auto-restart-until-mergeable` | **true** | "Auto-restart until PR becomes mergeable (no iteration limit). Restarts on new comments from non-bot users, CI failures, merge conflicts, or other issues. Does NOT auto-merge." |
| `--auto-restart-until-mergeable-timeout-hours` | 24 | Must be at most about 5 on GitHub-hosted runners (6 h job limit) |
| `--auto-merge` | false | Implies `--auto-restart-until-mergeable` |
| `--auto-restart-on-uncommitted-changes` | true | |
| `--auto-restart-max-iterations` | 5 | |
| `--auto-resume-on-limit-reset` / `--auto-restart-on-limit-reset` | true / false | |
| `--auto-resume-on-errors` | false | |
| `--auto-resume-max-iterations` | 5 | |
| `--auto-commit-uncommitted-changes` | false | |
| `--auto-restart-on-non-updated-pull-request-description` | false | |
| `--auto-input-until-mergeable` | false | Experimental |
| `--auto-close-pull-request-on-fail` | false | |
| `--auto-delete-branch-on-merge` | false | |
| `--watch` / `-w` | false | "Monitor continuously for feedback and auto-restart when detected (stops when PR is merged)" |
| `--watch-interval` | 60 | Seconds |
| `--resume` | (none) | Resume a previous session id |
| `--attach-logs` | (none) | Uploads the session log to the PR |
| `--development-log` | (none) | |
| `--verbose` | (none) | |
| `--log-dir` | (none) | |
| `--min-disk-space` | 10240 | MB |

Other `solve` behaviour:

- **Repository mode:** `solve https://github.com/owner/repo` works without an issue.
- **Exit codes:** 0 when the run made progress; **5** when nothing changed.
  `HIVE_MIND_SOLVE_NO_CHANGES_EXIT_CODE=0` restores the old behaviour. Treat 5 as "neutral"
  in CI.

### 2.3 Branch and draft PR mechanics

- **Branch:** `issue-${issueNumber}-${crypto.randomBytes(6).toString('hex')}`, so 12 hex
  characters. The matcher also accepts 8. Source:
  [`src/solve.branch.lib.mjs`](https://github.com/link-assistant/hive-mind/blob/main/src/solve.branch.lib.mjs)
  L325-326. This repository's current branch `issue-1-fb26bf6c9ffd` follows the pattern.
- **Initial commit** in
  [`src/solve.auto-pr.lib.mjs`](https://github.com/link-assistant/hive-mind/blob/main/src/solve.auto-pr.lib.mjs)
  (~L280). The message is:

  ```
  Initial commit with task details

  Adding ${fileDesc}.
  This file will be removed when the task is complete.

  Issue: ${issueUrl}
  ```

  The `.gitkeep` content is
  `# .gitkeep file auto-generated at ${timestamp} for PR creation at branch ${branchName} for issue ${issueUrl}`.
- **Draft PR** (same file, ~L743-800):
  - The title is `[WIP] ${issueTitle}`.
  - The body starts with "AI-Powered Solution Draft … Fixes ${issueRef} … Work in Progress".
  - The command is
    `gh pr create --draft --title "$(cat titlefile)" --body-file … --base ${targetBranch} --head ${branchName} --repo ${owner}/${repo}`,
    with `--head forkUser:branch` for forks and an optional `--assignee`.
- **AI instructions:** the prompts tell the agent to work on that branch, push, update the
  PR title and description, and "When you finish implementation, use gh pr ready
  ${prNumber}".
- **Finalisation**, in
  [`src/solve.results.lib.mjs`](https://github.com/link-assistant/hive-mind/blob/main/src/solve.results.lib.mjs):
  1. Revert the `.gitkeep`/`CLAUDE.md` commit ("Revert: Remove ${fileName} changes from
     initial commit").
  2. Strip `[WIP]` with `gh pr edit --title` (issue #1162).
  3. Update the body with `gh pr edit --body-file`.
  4. Call `ensurePullRequestIsReady(..., reason: 'solution draft verified', requireChanges: true)`
     from `src/pr-draft-state.lib.mjs` (issues #2123 and #2182).
- **Re-run on the same issue:** with `--auto-continue` (the default), `solve <issue-url>`
  finds the existing open PR on an `issue-N-*` branch and continues it instead of opening
  a new one. `solve <pr-url>` continues a specific PR directly. This is the core restart
  primitive.

### 2.4 `hive` mode (organisation and repository watcher)

Source: [`src/hive.config.lib.mjs`](https://github.com/link-assistant/hive-mind/blob/main/src/hive.config.lib.mjs).

Options:

- `--monitor-tag/-t` (default `"help wanted"`)
- `--all-issues/-a`
- `--skip-issues-with-prs/-s`
- `--concurrency/-c` (2)
- `--interval/-i` (300 s)
- `--max-issues`
- `--once`
- `--project-number`
- YouTrack options

Example: `hive https://github.com/owner/repo --monitor-tag "help wanted" --concurrency 3`.

`hive` is a long-running poller suited to a server or the Telegram bot, not to an
Actions job. `hive ... --once` could serve as a scheduled sweep.

### 2.5 Formal AI integration inside hive-mind

Source: [`src/formal-ai-runtime.lib.mjs`](https://github.com/link-assistant/hive-mind/blob/main/src/formal-ai-runtime.lib.mjs).

- It starts `formal-ai serve --agent-mode` with cwd set to the clone.
- It runs `formal-ai with --global --no-start-server --base-url <url> <tool>` to write the
  tool config.
- `FORMAL_AI_DEFAULT_API_KEY = 'formal-ai'`, so **no paid API key is needed**.
- `FORMAL_AI_MINIMUM_VERSION = '0.336.0'`.
- The sidecar image comes from `HIVE_MIND_FORMAL_AI_IMAGE`. Otherwise it falls back to
  the formal-ai binary baked into the image.
- Only `GH_TOKEN`/`GITHUB_TOKEN` is required for formal-ai runs. Claude, Codex and the
  other tools need their own credentials.

### 2.6 Key precedent: `formal-ai-draft.yml` in hive-mind

Sources:

- Workflow: [`.github/workflows/formal-ai-draft.yml`](https://github.com/link-assistant/hive-mind/blob/main/.github/workflows/formal-ai-draft.yml)
- Script: [`scripts/formal-ai-draft.mjs`](https://github.com/link-assistant/hive-mind/blob/main/scripts/formal-ai-draft.mjs)
  and `scripts/formal-ai-draft.lib.mjs`
- Documentation: [`docs/FORMAL-AI-DRAFTS.md`](https://github.com/link-assistant/hive-mind/blob/main/docs/FORMAL-AI-DRAFTS.md)
- Origin: [issue #2233](https://github.com/link-assistant/hive-mind/issues/2233) (closed,
  implemented)

**Triggers:**

- `issues: [opened]`
- `schedule: '17 8 * * *'` (health check)
- `workflow_dispatch` (input `issue_number`)
- `workflow_call`, with:
  - inputs `issue_number`, `image`, `formal_ai_binary_artifact`, `hive_mind_repository`
    and `hive_mind_ref`
  - secrets `AUTOMATION_APP_PRIVATE_KEY` and `AUTOMATION_TOKEN`

Because of `workflow_call`, **other repositories can call it**:
`uses: link-assistant/hive-mind/.github/workflows/formal-ai-draft.yml@main`.

**Job settings:**

- `runs-on: ubuntu-24.04`
- `timeout-minutes: 90`
- permissions: contents, issues, pull-requests and actions all `write`
- concurrency:

  ```yaml
  concurrency:
    group: formal-ai-draft-${{ github.repository }}-${{ github.event.issue.number || inputs.issue_number || github.event.inputs.issue_number }}
    cancel-in-progress: false
  ```

**Steps:**

1. checkout
2. setup-node 24
3. `npm ci`
4. `./.github/actions/resolve-github-token`
5. `node scripts/formal-ai-draft.mjs --decide`
6. free disk space
7. optionally download a formal-ai binary artifact and mount it read-only over
   `/usr/local/bin/formal-ai`
8. `node scripts/formal-ai-draft.mjs`
9. `dispatch-checks`
10. upload the session log

A `report-checks` job posts commit statuses on the draft head.

**The exact solve command** (from the docs):

```sh
solve <issue-url> --tool agent --model formal-ai --attach-logs --development-log --verbose \
  --attribution formal-ai --no-auto-restart-until-mergeable \
  --no-auto-restart-on-uncommitted-changes --log-dir /home/box/logs
```

It runs as `docker run --rm --user box … konard/hive-mind:<package.json version> solve …`,
falling back to `:latest`, with `GH_TOKEN` forwarded (`buildDockerArgv`).
`FORBIDDEN_DRAFT_SOLVE_FLAGS = ['--auto-merge', '--auto-close-pull-request-on-fail']`.

**Behaviour:**

- After solve, the workflow re-drafts the PR (`gh pr ready N --undo`) and adds the label
  `formal-ai-draft`.
- The opt-out label is `no-formal-ai-draft`. Bot-opened issues are skipped.
- "To re-attempt an issue, run the workflow manually … with the issue number."
- Commit trailers: `Formal-AI-Session`, `Formal-AI-Model`, `Formal-AI-Evidence`,
  `Formal-AI-Pull-Request`.
- The git identity is `github-actions[bot]`, set via `GIT_CONFIG_COUNT`.

**Health:** [hive-mind#3249](https://github.com/link-assistant/hive-mind/issues/3249) is
OPEN (2026-10-14): "Formal AI Draft workflow fails on every new issue (53/60 runs since
2026-10-07)". Several formal-ai draft PRs (for example #3295, #3290 and #3285) remain open
as drafts. Treat this workflow as the template, and expect to harden it.

---

## 3. Existing AI-on-issues workflows and alternatives

### 3.1 link-foundation shared credential actions

[link-foundation/.github#1](https://github.com/link-foundation/.github/issues/1) is
closed: "Shared actions for optional, layered GitHub credentials: resolve-github-token
(GitHub App, one AUTOMATION_TOKEN, default GITHUB_TOKEN) and dispatch-checks".

**`link-foundation/.github/actions/resolve-github-token`:**

- Inputs: `app-id` (from `vars.AUTOMATION_APP_ID`), `app-private-key`, `token`,
  `default-token`.
- Outputs: `token`, `layer`, `triggers-workflows`, `can-create-repositories`.

**`link-foundation/.github/actions/dispatch-checks`:** when the token cannot trigger
workflows, it fires `workflow_dispatch` for the checks on the PR head.

**`workflow-templates/automation-pr.yml`:** runs resolve-github-token, then
`peter-evans/create-pull-request@v8`, then dispatch-checks.

Source: https://github.com/link-foundation/.github

### 3.2 `anthropics/claude-code-action@v1`

Source: https://github.com/anthropics/claude-code-action (`action.yml`,
`docs/capabilities-and-limitations.md`).

- Triggers: `issue_comment`, `pull_request_review_comment`,
  `issues: [opened, assigned, labeled]`, `pull_request_review`.
- Inputs: `trigger_phrase` (`@claude`), `assignee_trigger`, `label_trigger` (`claude`),
  `branch_prefix` (`claude/`), `branch_name_template`, `anthropic_api_key` /
  `claude_code_oauth_token`, `github_token`, `use_commit_signing`, `allowed_bots`.
- It "Creates commits on a branch and links back to a prefilled PR creation page". It
  does not open the PR itself by default and cannot merge or rebase.
- It needs a paid Anthropic key or OAuth token.

### 3.3 `openai/codex-action@v1`

Source: https://github.com/openai/codex-action

- It needs the `openai-api-key` secret.
- The example is a reviewer on `pull_request: opened`.
- It runs Codex with `permission-profile` and a `safety-strategy` (default `drop-sudo`).
- It does not create PRs itself; you would combine it with
  `peter-evans/create-pull-request`.

### 3.4 GitHub Copilot coding agent

- Assign an issue to Copilot, and it creates a `copilot/` branch and a draft PR. It works
  in a GitHub Actions-powered ephemeral environment that can be customised with
  `.github/workflows/copilot-setup-steps.yml`.
- Its PRs need a human to approve before CI workflows run.
- Sessions are time-capped (setup steps are limited to 59 minutes).
- It requires a paid Copilot plan.

Sources:

- https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent
- https://docs.github.com/en/copilot/using-github-copilot/coding-agent/using-copilot-to-work-on-an-issue
- https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/

### 3.5 Comparison

| | formal-ai via hive-mind `solve` | `author-with-formal-ai` action | claude-code-action | codex-action | Copilot agent |
|---|---|---|---|---|---|
| Cost / secret | free, `GH_TOKEN` only | free, `GH_TOKEN` (+ bot token) | Anthropic key | OpenAI key | Copilot plan |
| Opens the PR itself | yes (draft, `[WIP]`) | yes (draft) | no (link) | no | yes (draft) |
| Same-PR continuation | `--auto-continue` | reuses the `formal-ai/issue-N-*` PR | comment `@claude` on the PR | manual | comment on the PR |
| Uses latest formal-ai | needs a binary override (image pins 0.353.2) | yes (`:latest` image) | n/a | n/a | n/a |
| Tool pluggable | yes (`--tool`) | no | no | no | no |

---

## 4. GitHub Actions facts that matter for restartability

| Fact | Quote / detail | Source |
|---|---|---|
| GITHUB_TOKEN does not chain workflows | "events triggered by the `GITHUB_TOKEN` will not create a new workflow run", except that "`workflow_dispatch` and `repository_dispatch` events always create workflow runs". PR events by GITHUB_TOKEN are put in an approval-required state. | https://docs.github.com/en/actions/concepts/security/github_token |
| `issue_comment` | Fires for comments on issues **and** PRs. It runs only from the workflow file on the default branch. | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#issue_comment |
| `issues` activity types | Include `opened`, `edited`, `labeled`, `reopened`, `assigned` and others. | same page, `#issues` |
| `workflow_dispatch` | Up to 25 inputs and a 65,535-character payload. `gh workflow run` / the API can dispatch it. | same page, `#workflow_dispatch` |
| `repository_dispatch` | Default branch only; `client_payload` has at most 10 top-level properties and 65,535 characters. | same page, `#repository_dispatch` |
| Job / run timeouts | 6 h per job on GitHub-hosted runners, 5 days per job on self-hosted runners, 35 days per workflow run. | https://docs.github.com/en/actions/reference/limits |
| Concurrency and queues | 20 concurrent jobs (Free), 40 (Pro), 60 (Team), 500 (Enterprise). 500 queued runs per 10 s. GITHUB_TOKEN API limit is 1,000 requests per hour per repository. | same |
| Concurrency groups | At most one running and one pending run per group. The default (`queue: single`) cancels an existing pending run. `queue: max` allows up to 100 pending runs and cannot be combined with `cancel-in-progress: true`. | https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency |
| Re-run limits | A run can be re-run up to 30 days after the initial run, and at most 50 times. A re-run uses the same `GITHUB_SHA` and `GITHUB_REF`. "Re-runs use the privileges of the actor who initially triggered the workflow". CLI: `gh run rerun RUN_ID [--failed] [--job JOB_ID] [--debug]`. | https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs |

Implications:

- `gh run rerun` is not a good restart primitive. It is capped at 50 re-runs within 30
  days, it reuses the original commit, and it reuses the original event payload. Restart
  through **new events** instead: a comment command, a label toggle,
  `workflow_dispatch`, or a schedule. Each new event is a fresh run that reads the current
  PR state.
- PR pushes made with `GITHUB_TOKEN` will not trigger the game's CI. Use a GitHub App
  token, via `resolve-github-token`, or call `dispatch-checks` and post commit statuses.
- A single long `--auto-restart-until-mergeable` loop must fit in 6 h on hosted runners.
  Prefer short runs (for example `timeout-minutes: 90`) and event-driven restarts.

---

## 5. Recommended design for `links-games` repositories

### 5.1 Shape

- **Central reusable workflow.** Put it in `links-games/.github`, for example
  `.github/workflows/formal-ai-solve.yml` with `on: workflow_call`, modelled on
  hive-mind's `formal-ai-draft.yml`.
- **Thin caller.** Each game repository has a short `.github/workflows/ai-solve.yml` that
  only declares triggers and calls the central workflow. It can be distributed as an org
  workflow template.

### 5.2 Triggers (caller)

```yaml
on:
  issues:
    types: [opened, labeled, reopened]
  issue_comment:
    types: [created]                 # commands: /solve, /retry, /continue
  pull_request_review:
    types: [submitted]               # changes requested => continue the same PR
  workflow_dispatch:
    inputs:
      issue_number: { required: true }
      tool: { default: agent }       # agent (formal-ai) | claude | codex
      model: { default: formal-ai }
  schedule:
    - cron: '23 */6 * * *'           # optional sweep: retry stalled formal-ai PRs
```

Gating in an `if:` or a decide step:

- Skip bot authors and the `no-ai` label.
- Accept comment commands only from users with `author_association` OWNER, MEMBER or
  COLLABORATOR.
- For PR-scoped events, map the PR back to its issue through the `issue-N-*` branch name
  or `Fixes #N`.

### 5.3 Steps (central reusable workflow)

1. **Concurrency.** Serialise runs per issue and never cancel a running solve:

   ```yaml
   concurrency:
     group: ai-solve-${{ github.repository }}-${{ <issue number> }}
     cancel-in-progress: false
   ```

   Add `queue: max` so that rapid comments are queued rather than dropped.
2. **Token.** Run `link-foundation/.github/actions/resolve-github-token@main`, with an
   org GitHub App (`vars.AUTOMATION_APP_ID`, `secrets.AUTOMATION_APP_PRIVATE_KEY`) and a
   fallback to `github.token`.
3. **Acknowledge.** React with "eyes" on the comment, or post a status comment that links
   to the run.
4. **Latest formal-ai.** Pull the image, copy the binary out, and record the version:

   ```sh
   docker pull ghcr.io/link-assistant/formal-ai:latest
   cid=$(docker create ghcr.io/link-assistant/formal-ai:latest)
   docker cp "$cid:/usr/local/bin/formal-ai" "$RUNNER_TEMP/formal-ai"
   "$RUNNER_TEMP/formal-ai" --version >> "$GITHUB_STEP_SUMMARY"
   ```

5. **Solve.** Run hive-mind `solve` in its image, with the latest binary mounted over the
   pinned one:

   ```sh
   docker run --rm --user box -e GH_TOKEN="$TOKEN" \
     -v "$RUNNER_TEMP/formal-ai:/usr/local/bin/formal-ai:ro" \
     -v "$RUNNER_TEMP/logs:/home/box/logs" \
     konard/hive-mind:latest \
     solve "https://github.com/$REPO/issues/$N" \
       --tool "${TOOL:-agent}" --model "${MODEL:-formal-ai}" \
       --attribution formal-ai --attach-logs --verbose --log-dir /home/box/logs \
       --auto-continue \
       --no-auto-restart-until-mergeable \
       --auto-restart-max-iterations 3
   ```

   - Treat exit code 5 ("no changes") as neutral.
   - Never pass `--auto-merge` or `--auto-close-pull-request-on-fail`.
   - For claude or codex runs, pass the matching secret only when it is present.
6. **CI kick.** If `triggers-workflows` is false, run
   `link-foundation/.github/actions/dispatch-checks` on the PR head, so the game's
   build/test/lint workflows run on the bot's push.
7. **Report.** Upload the logs as an artifact, comment the run summary on the PR, and
   apply the `ai-draft` label. Re-draft the PR (`gh pr ready --undo`) if the tool was
   formal-ai and the checks failed.

### 5.4 PR creation (inherited from hive-mind)

1. Create branch `issue-<N>-<12 hex>`.
2. Make the initial `.gitkeep` commit.
3. Run `gh pr create --draft` with the title `[WIP] <issue title>` and a body containing
   `Fixes #N`.
4. The AI commits on the branch.
5. Finalise: revert `.gitkeep`, strip `[WIP]`, update the body, and mark the PR ready
   only if there are real changes.

### 5.5 Restart (same PR, unlimited)

- **Every restart is a new event, not a `gh run rerun`.** Options:
  - a `/solve` or `/retry` comment on the issue or PR
  - re-adding the `ai-solve` label
  - a "changes requested" review
  - `workflow_dispatch`, from the UI or `gh workflow run ai-solve.yml -f issue_number=N`
  - the scheduled sweep
- `solve <issue-url>` with `--auto-continue` finds the open `issue-N-*` PR and continues
  it. Alternatively, pass the PR URL directly. The result is the same branch and the same
  PR, with a new commit and a new log comment.
- Per-issue concurrency with `cancel-in-progress: false` guarantees that two restarts
  never write to the branch at once.
- Idempotence: hive-mind leaves feedback detection to the AI. Counting commits that carry
  the `Formal-AI-Session` trailer (as `author-with-formal-ai` does) lets a sweep decide
  whether another attempt is useful. Cap automated sweeps (for example at 5 attempts per
  PR, using a label counter). Leave human-triggered restarts uncapped.
- Each run stays short (`timeout-minutes: 90` or less), well under the 6 h hosted-runner
  limit. Self-hosted runners (up to 5 days per job) would allow
  `--auto-restart-until-mergeable` or `--watch` loops, if desired.

### 5.6 Risks

- **Formal AI maturity.** SWE-bench Lite is 0/1, and
  [hive-mind#3249](https://github.com/link-assistant/hive-mind/issues/3249) reports 53/60
  draft runs failing. Expect mostly drafts and evidence. Keep `--tool` switchable, so that
  claude or codex can run on the same PR through the same restart command.
- **The pinned binary in the hive-mind image.** The "latest" requirement needs the
  override in step 4. Verify `formal-ai --version` is at least `FORMAL_AI_MINIMUM_VERSION`
  (0.336.0) and log it.
- **Workflow-file edits.** Edits to `.github/workflows/*` need a token with the
  `workflows` permission (an App token), not `GITHUB_TOKEN`.
- **Bot loops.** The bot's own comments must not trigger `issue_comment` runs. Filter on
  `github.actor` / `comment.user.type == 'Bot'`.
