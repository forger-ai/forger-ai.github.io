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

The Desktop release gate requires green checks, all platform installers, signed/notarized Mac builds and independent artifact/checksum verification. Those checks complete successfully for 0.5.19. The companion website deployment and its final live verification record are tracked in [Pages PR 17](https://github.com/forger-ai/forger-ai.github.io/pull/17).

One initial PR CI Linux full-test job (`104844106183`) fails the existing MCP annotation-title success test because its real loopback request exceeds the fixture's 25 ms timeout. The same source passes the push CI full Linux job, both strict-main runs and three local repetitions of the complete 12-test MCP client file. A single exact-job rerun passes and completes PR CI attempt 2 successfully. No source or timeout change is made for this incident. This intermittent test limit remains a separate test-maintenance concern; the initial failed check is retained in the audit trail.

PR 162 merges at `4d0513ff911d72ba89a056787d817207669aba9a` on September 16 at 14:59 UTC, with a tree identical to the tested candidate. The release notes are prepared in a draft before pushing the annotated `forger-desktop/v0.5.19` tag; the entry is published without making it latest until all artifacts are uploaded. Release workflow `35112413345` completes successfully in all five jobs and publishes all four installers plus checksum sidecars. GitHub identifies 0.5.19 as the latest stable release.

The release-triggered Pages metadata deployment `35117087305` succeeds. Live `https://forger.cloud/desktop-versions/latest.json` serves 0.5.19 with a meaningful summary, six changes, the four correct GitHub URLs, matching sizes/checksums and the existing experimental flags. This metadata refresh precedes the separate campaign-consent website merge; it is not itself evidence that the new consent UI is deployed.

## Artifact verification

Completed workflow artifacts are downloaded into an isolated temporary directory for inspection, not installed over a real Forger profile. These downloads use workflow artifacts rather than public installer links, so the checks do not inflate public installer download counts. Each local file's SHA-256 matches its generated sidecar:

- Linux x64: `c372dbbcc566499d783db9a5bacbb8ac07c643dedf996c47cdc43354c70195ee` (448,052,236 bytes).
- Windows x64: `c98af70e8ed4b004edf1955a0248ee842b4bf28a449bf37432e6f1b1d091f545` (462,943,584 bytes).
- Mac Apple silicon: `c07f8dd3c554ab2b025ab6863b09bff8af30035545922dd5a06291abc3997ce2` (482,922,337 bytes).
- Mac Intel: `cf3de961edfb4cb0d7f138856b13589d50d3ecc579e72c1d78256d3495ec5907` (490,843,130 bytes).

All four inspected files also match their final public GitHub asset digests and sizes. Apple accepts the ARM64 submission at 15:32 UTC and the Intel submission at 15:37 UTC; stapling and validation succeed for both. Independent local Gatekeeper assessments of both downloaded DMGs exit successfully with `accepted` and `source=Notarized Developer ID`. No installer is opened or applied to a real profile.

No new advertising spend, paid analytics, recurring monitor, public dashboard sharing, or unrelated backend activation is performed.
