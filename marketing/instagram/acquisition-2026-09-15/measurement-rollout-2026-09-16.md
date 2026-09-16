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

At this checkpoint, final Desktop CI is running on the candidate above. Neither the Desktop release nor the website measurement deployment is published. The current public installer remains available. Publication requires green checks, the existing signed/notarized release workflow, final artifact/checksum verification, then the Pages merge/deploy and live verification.

No new advertising spend, paid analytics, recurring monitor, public dashboard sharing, or unrelated backend activation is performed.
