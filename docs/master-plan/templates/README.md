# Templates for Every links-games Repository

Ready-to-copy files. They live under `docs/` so they do not run inside this
planning repository.

| Template                                                           | Copy to                                                         | Purpose                                                 |
| ------------------------------------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------- |
| [workflows/ai-solve-reusable.yml](workflows/ai-solve-reusable.yml) | `links-games/.github` → `.github/workflows/ai-solve.yml` (once) | Shared AI pipeline logic ([design](../ai-pipeline.md)). |
| [workflows/ai-solve.yml](workflows/ai-solve.yml)                   | each repository → `.github/workflows/ai-solve.yml`              | Thin caller with all restart triggers.                  |
| [pull_request_template.md](pull_request_template.md)               | each repository → `.github/pull_request_template.md`            | Adorability, learning objective and legal checks.       |
| [ISSUE_TEMPLATE/game-idea.md](ISSUE_TEMPLATE/game-idea.md)         | each repository → `.github/ISSUE_TEMPLATE/`                     | Propose a new game in the AI-friendly format.           |
| [ISSUE_TEMPLATE/not-adorable.md](ISSUE_TEMPLATE/not-adorable.md)   | each repository → `.github/ISSUE_TEMPLATE/`                     | Report an "adorability bug" (R14).                      |

The game template repositories (`game-template-pixi-react` and friends, see
[infrastructure](../infrastructure.md#4-template-repositories)) include all of
these files from day one, so a new game repository created from a template
needs no manual setup.
