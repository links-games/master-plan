# Issue #1 — Full Requirements List

Source: [links-games/master-plan#1](https://github.com/links-games/master-plan/issues/1)
(raw copy: [`data/issue-1.json`](data/issue-1.json)).

Every sentence of the issue was split into atomic, checkable requirements.
Each requirement has a stable ID (`R1`…`R35`) that is referenced from the
[solution plans](solution-plans.md) and the [roadmap](../../master-plan/roadmap.md).

Legend for the **Kind** column: `P` = product, `T` = technology,
`L` = lore/brand, `B` = business, `C` = community, `D` = deliverable of this
pull request.

| ID  | Requirement (paraphrased from the issue)                                                                                                | Kind | Quote from the issue                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------- |
| R1  | Produce **lots** of **mobile-first** mini games.                                                                                        | P    | "We should produce lots of mobile first mini game."                                                     |
| R2  | Every game must be redistributable as a web app, mobile app, Telegram bot (mini) app, VK Mini App "and so on" (any further platform).   | T    | "redistribute as web apps, mobile apps, telegram bot apps, vk-mini apps and so on"                      |
| R3  | Build a shared **game-core library**.                                                                                                   | T    | "We sure will need some game-core library"                                                              |
| R4  | Build **game template repositories**.                                                                                                   | T    | "and game template repositories"                                                                        |
| R5  | Start with **React.js + JavaScript + Capacitor + Electron** "and so on".                                                                | T    | "We should be able to start with React.js + JavaScript + Capacitor + Electron and so on."               |
| R6  | Use **link-assistant/formal-ai**, which holds the associative tech stack description.                                                   | T    | "We should use github.com/link-assistant/formal-ai (there we have associative tech stack description…"  |
| R7  | Every repository gets CI/CD: when an issue arrives, run the **latest formal-ai** and publish the result on a pull request.              | T    | "once issue arrives we try to execute latest formal-ai to produce results on pull request"              |
| R8  | The pull request must be **created automatically**, the same way **link-assistant/hive-mind** does it.                                  | T    | "pull request must be created automatically using what we do in github.com/link-assistant/hive-mind"    |
| R9  | The CI/CD workflow must be **restartable automatically** and runnable on the **same pull request as many times as needed**.             | T    | "CI/CD workflow should also be restartable automatically…"                                              |
| R10 | Write a **detailed plan for core infrastructure** so production-ready games are easy to produce.                                        | D    | "Here we need to make a detailed plan for core infrastructure…"                                         |
| R11 | Research the **most popular and successful game ideas** that can be **legally reimplemented in our own style**.                         | D    | "research for the most popular and successful games ideas, which can be legally reimplement…"           |
| R12 | Check **github.com/linksplatform** and produce a **lore core** where **links are characters**.                                          | L    | "check github.com/linksplatform and produce some lore core, where we try to use links as characters"    |
| R13 | Characters must be **cute, funny and likable by toddlers, children and adults**.                                                        | L    | "they should cute, funny and likable by toddlers, children and adults"                                  |
| R14 | **"If something is not adorable it is a bug"** — adorability is a quality gate.                                                         | L    | "If something is not adorable it is a bug."                                                             |
| R15 | All games and apps are connected into a **single ecosystem/universe** with a **common lore**.                                           | L    | "All games and apps should be somehow connected into single ecosystem/universe"                         |
| R16 | The lore contains **lots of wisdom and useful lessons**.                                                                                | L    | "common lore, which in itself contains lots of wisdom and useful lessons"                               |
| R17 | Position the games as **cool, high-quality games with educational elements** — every player gets dopamine **and** learns something new. | P    | "so each person that plays our games not only gets dopamine, but also learns something new"             |
| R18 | **Start with the simplest possible games** to implement.                                                                                | P    | "We should start by producing the simplest possible to implement games"                                 |
| R19 | Games are **fully open-source and public domain**.                                                                                      | B    | "fully open-source and public domain"                                                                   |
| R20 | **Do not advertise** the open-source nature much (keep chances for profit/donations).                                                   | B    | "yet we don't advertise what games are open-source much"                                                |
| R21 | All games are **free to play** with **custom subscriptions**.                                                                           | B    | "All games must be free to play with some custom subscriptions"                                         |
| R22 | Games **start ads-free**.                                                                                                               | B    | "we start them ads free"                                                                                |
| R23 | Ads (and subscriptions) may be used **as a way to get an advantage** in games (opt-in rewarded ads).                                    | B    | "allow to use adds as ability to get some advantage in games as well as subscriptions"                  |
| R24 | By default be **more generous than all competitors**; ask for subscription/ads **later** than they do.                                  | B    | "be more generous than all other competitor games, and don't ask for subscription or ads longer"        |
| R25 | **All monetization/engagement mechanics in place** so we can **experiment** with them.                                                  | T    | "We should have all mechanics in place so we can experiment with them."                                 |
| R26 | Plan to build a **big global community** and encourage contributions out of good will.                                                  | C    | "plan to build big global community, so we encourage taking part in development… out of good will"      |
| R27 | **Hire developers/designers** when the budget allows.                                                                                   | C    | "if we have enough budget we will get some developers/designers hired"                                  |
| R28 | The community is a source of **additional revenue**: donations, merchandise and so on.                                                  | B    | "big community can be source of additional revenue streams as donations, merchandize and so on"         |
| R29 | Be **profitable** and able to **attract capital** to reinvest into quality and quantity growth.                                         | B    | "We should be profitable and be able to attract more and more capital to reinvest…"                     |
| R30 | Besides meta-links-theory characters, develop **own anime characters** in multiple styles (**chibi**, **normal 3D**, …).                | L    | "we can develop our own anime characters in multiple styles, like chibi and normal 3D and so on"        |
| R31 | **Collect data** related to the issue into `./docs/case-studies/issue-{id}`.                                                            | D    | "make sure we compile that data to `./docs/case-studies/issue-{id}` folder"                             |
| R32 | Do a **deep case-study analysis**, including **online search** for additional facts and data.                                           | D    | "use it to do deep case study analysis (also make sure to search online for additional facts and data)" |
| R33 | **List each and all requirements** from the issue.                                                                                      | D    | "list of each and all requirements from the issue"                                                      |
| R34 | **Propose possible solutions and solution plans for each requirement**, checking **known existing components/libraries**.               | D    | "propose possible solutions and solution plans for each requirement (we should also check known…)"      |
| R35 | Plan and execute everything **in this single pull request**, until every requirement is fully addressed.                                | D    | "Please plan and execute everything in this single pull request…"                                       |

## Implicit requirements (derived, not literally stated)

| ID  | Derived requirement                                                                                                                                                   | Derived from  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| D1  | Kid-facing products must comply with child-privacy and store policies (COPPA, GDPR-K, Google Play Families, Apple Kids Category) — this constrains ads and analytics. | R13, R22, R23 |
| D2  | "Legally reimplement" implies a written legal checklist (no copied names, art, sounds, trade dress, trademarks; awareness of mechanic patents).                       | R11           |
| D3  | "Lots of games" + "single universe" implies shared identity, save profile, cross-promotion, and a shared asset/character library.                                     | R1, R15       |
| D4  | Public-domain code means competitors can clone us; the moat must be brand, characters, community, speed and quality — not code secrecy.                               | R19, R29      |
| D5  | Running AI on every issue costs money and can be abused; the workflow needs permission gating (who may trigger), budgets and secret management.                       | R7, R9        |
| D6  | Monetization experiments require analytics, remote config and A/B testing that are themselves privacy-safe for children.                                              | R25, D1       |
| D7  | Educational claims need a learning-design framework (one explicit learning objective per game, measured).                                                             | R17           |
