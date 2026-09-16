# Voluntary measurement rollout — September 16, 2026

## Scope and destination

The user authorizes separate voluntary measurement, a dedicated free PostHog destination, implementation/testing, and publication after verification. Organization **Forger**, project **Forger — Acquisition** (`612473`) are configured without a paid plan or billing method. Eigen data and campaign budgets are unchanged.

- Production dashboard: https://us.posthog.com/project/612473/dashboard/2102685.
- Synthetic QA dashboard: https://us.posthog.com/project/612473/dashboard/2102686.
- Setup and receiver evidence: `posthog-setup-2026-09-16.md`.
- Consent, event semantics and limitations: `measurement-readiness.md`.

## Implementation and local verification

- Desktop PR: https://github.com/forger-ai/forger-desktop/pull/161.
- Desktop candidate: `84579fbbe6d9210391a617e0c54d1a94610955a4`, version `0.5.18`.
- Companion Pages PR: https://github.com/forger-ai/forger-ai.github.io/pull/17.
- Desktop main: 2,036 passing; 100% statements, branches, functions and lines in the strict suite.
- Desktop renderer: 808 passing across 91 files; 100% in all four strict coverage metrics. The final later change is only in a main-process test and does not change renderer or product code.
- Desktop lint, typecheck and full build pass. Python resource checks: 5 passing. Isolated real Electron smoke: 2 passing, without using an installed profile or sending real telemetry.
- Pages: 89 passing behavioral checks. The 38-page build and responsive EN/ES browser preview pass. Both pull-request CI and deployment require the full Pages test suite before building.
- Synthetic receiver verification confirms the five web and two Desktop event types in `environment: test`, default silence before consent and no additional requests after withdrawal. Production reports exclude these events.

Independent privacy and UX review findings are addressed. Tests cover default-denied consent, refusal, withdrawal/storage failure, strict IPC callers and deep links, new-profile eligibility, stable retry payloads, first-app cohort consistency, language preservation and phone-to-desktop handoff.

Two classes of pre-existing main-process test races are corrected without changing product behavior or time limits. OAuth rejection assertions attach before yielding; automation fixtures wait for persistence/terminal notification/timer completion before assertions or cleanup, including failed runs and provider-setup errors. The final complete 41-test automation file passes three consecutive runs with natural exit, without force-exit. The complete strict Electron suite also passes after those changes. Earlier failed or canceled CI runs are not counted as successful verification.

## Publication status

The final Desktop push CI (`35106290745`) and pull-request CI (`35106295271`) both pass on the candidate above, including all 14 jobs across those two runs. PR 161 merges at `c4689cd6215ef067813d4e2298114622d5ce9906` on September 16 at 14:18 UTC; its tree matches the tested candidate exactly.

The annotated tag `forger-desktop/v0.5.18` and release entry target that merge. Release workflow `35107718802` passes validation and every platform's tests, but macOS packaging fails during temporary signing-keychain setup. Linux and Windows builds succeed; the aggregate publisher correctly skips publication. No installers are uploaded to that release. Its entry is marked pre-release with an explicit unavailability notice; the original tag is preserved and 0.5.17 remains the stable public download.

The cause matches the upstream electron-builder keychain-password defect fixed in [electron-builder PR 10172](https://github.com/electron-userland/electron-builder/pull/10172). The old packager uses the certificate import password where macOS requires the temporary keychain's own generated password. The scoped correction in [Desktop PR 162](https://github.com/forger-ai/forger-desktop/pull/162), candidate `9950dadbb8e496a82f2f27e7bfa497330c61f49b`, pins electron-builder 26.16.1 and prepares Desktop 0.5.19. The lockfile changes only development dependencies; runtime dependencies, consent code, signing credentials and release checks are unchanged. Fresh install, lint, typecheck, full build, 44 focused release/security contracts, the full strict main-process suite and two isolated real Electron tests pass. Push CI `35110877987` and PR CI `35110926289` both finish successfully; all 14 checks are green before merge.

Publication completion still requires green checks, all platform installers and signed/notarized Mac builds, final artifact/checksum verification, then the Pages merge/deploy and live verification. Website measurement remains undeployed until those checks complete.

One initial PR CI Linux full-test job (`104844106183`) fails the existing MCP annotation-title success test because its real loopback request exceeds the fixture's 25 ms timeout. The same source passes the push CI full Linux job, both strict-main runs and three local repetitions of the complete 12-test MCP client file. A single exact-job rerun passes and completes PR CI attempt 2 successfully. No source or timeout change is made for this incident. This intermittent test limit remains a separate test-maintenance concern; the initial failed check is retained in the audit trail.

PR 162 merges at `4d0513ff911d72ba89a056787d817207669aba9a` on September 16 at 14:59 UTC, with a tree identical to the tested candidate. The release notes are prepared in a draft before pushing the annotated `forger-desktop/v0.5.19` tag; the entry is then published without making it latest. Release workflow `35112413345` is running at this checkpoint. No v0.5.19 installers are published yet.

No new advertising spend, paid analytics, recurring monitor, public dashboard sharing, or unrelated backend activation is performed.
