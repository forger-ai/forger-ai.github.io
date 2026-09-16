# Forger PostHog setup — September 16, 2026

The user explicitly requests a new organization after authorizing all four voluntary-measurement implementation and publication steps.

- Organization: **Forger** (`01a0aa1f-7aa4-0000-11de-542bf1a21c0d`).
- Project: **Forger — Acquisition** (`612473`).
- Region: US Cloud.
- Project URL: https://us.posthog.com/project/612473/settings/project-details.
- Plan: **Free**, selected through the onboarding screen. No payment method is added and no paid plan is selected.
- Existing Eigen organizations are unchanged and their event data is not queried.

## Privacy configuration verified in the UI

- Discard client IP data: enabled for this project and as the organization default for new projects. Network requests still necessarily reach PostHog; discarding IP storage does not itself prevent transient processing or GeoIP enrichment, so the implementation also disables GeoIP explicitly.
- Web autocapture and dead-click autocapture: disabled. Web vitals autocapture is already disabled.
- Session recording: disabled. Its dependent console/network recording controls are inactive; no recording SDK is installed.
- Third-party AI features and internal AI training: disabled. PostHog Desktop beta terms remain unaccepted.
- Exception autocapture: disabled.
- Heatmaps: disabled.
- Reporting timezone: America/Santiago, confirmed in the timezone-change dialog.

The UI confirms the new project has no events before integration. Creating this workspace does not itself instrument the Forger website or Desktop. No automated installation wizard, GitHub/Slack connection, AI scout, or telemetry deployment is enabled.

The project token is a write-only public ingest token verified against this project. It is used only in scoped integration configuration; no personal API credential is embedded in product code.

## Reporting workspaces

- Production: https://us.posthog.com/project/612473/dashboard/2102685 — Forger — Campaign acquisition.
- Synthetic QA: https://us.posthog.com/project/612473/dashboard/2102686 — Forger — Integration QA (synthetic only).

Both dashboards are private to the project. They are created empty with explicit caveats; chart definitions are added only after event schema and synthetic receipt validation. No subscription, public share link, or recurring outbound report is created.

## Synthetic web receipt verification

At 12:29 UTC on September 16, the real Pages capture module is exercised from Node with an in-memory preference store, a newly generated synthetic UUID, the public paid-01 campaign URL and an explicit `environment: test` configuration. This is a transport test, not a real visitor, downloaded installer, browser UI flow or installation.

- A capture before consent makes zero requests and creates no stored identifier.
- Explicit consent is followed by one test event for each of the five allowed web event names. All five requests receive HTTP 200 with `status: Ok` from the configured US capture endpoint.
- Capture after withdrawal makes no additional request.
- PostHog Activity shows exactly five synthetic web events. The inspected landing event contains only campaign code, test environment, web surface, schema version, the two privacy flags and an ingestion timestamp. No IP, location, URL, referrer, account, file or chat property appears.
- A schema lookup confirms `environment: test`; a tested Trends query returns one receipt per event. The matching production-only query returns no stored production events. This is not evidence of zero actual campaign outcomes because the integration is not yet deployed.
- Saved QA insight: `11939006` / `63VQmtz5`, https://us.posthog.com/project/612473/insights/63VQmtz5. Its execution returns the expected five receipts.
- Saved production web insight: `11939021` / `W15n0sfv`, https://us.posthog.com/project/612473/insights/W15n0sfv. It filters `environment: production` and `surface: web`, distinguishes clicks from installations, and currently explains the pre-deployment status.

The Pages implementation passes 88 behavioral tests and its 38-page build. Local browser preview verifies readable desktop/mobile layouts, preserved attribution across the EN/ES switch, and phone-specific copy/share emphasis with no Desktop protocol link on the simulated phone. The production-host guard correctly keeps analytics unavailable in localhost previews. Desktop integration and release gates remain pending.

An additional isolated browser fixture exercises the real rendered consent controls and UI module with memory-only storage and a mocked network. Rejection leaves zero requests and no identifier; acceptance makes one mocked landing request and creates the identifier; withdrawal removes it without another request. The fixture is removed by reloading the page, and all temporary viewport/user-agent overrides are reset. It does not send external telemetry or alter the production-host guard.

## Synthetic Desktop receipt verification

At 12:41 UTC, the compiled Desktop measurement service and its real transport are exercised with a newly created temporary profile, explicit test configuration and the known paid-01 code. The test calls the first-app milestone directly; it does not claim that a real person installed Forger or created a real app through the interface.

- Before consent: zero requests and no identifier.
- After explicit consent: exactly one `forger_campaign_first_open` and one `forger_campaign_first_app_created` reach the dedicated capture endpoint with HTTP 200 / `status: Ok`.
- Both use the same synthetic profile ID, distinct event UUIDs and `environment: test`; payload properties are strictly limited to code, surface, schema, environment, version/platform and privacy flags.
- A repeated first-app signal adds no request.
- Withdrawal clears the identifier and outbox and disqualifies the temporary profile from acquisition. All temporary test-state files are removed afterward; no installed Forger profile is used.

PostHog Activity subsequently shows all seven expected synthetic events. The inspected Desktop first-open event contains only the expected code, version/platform, surface, environment, schema and privacy flags plus its timestamp, with no IP, location, URL, account, file or chat property. Verified queries return one synthetic profile per Desktop milestone and no production profile. Saved QA insight `11939182` / `vUMPZB2C` executes with the expected result; production insight `11939212` / `u0yu07F7` filters production only and labels the figures as consenting local profiles rather than people or total installations. Full regression checks, feature-specific isolated real Electron smoke and the signed/notarized release remain separate gates.

References: https://posthog.com/docs/settings/organizations, https://posthog.com/docs/settings/projects, https://posthog.com/docs/privacy/data-collection, https://posthog.com/docs/api/capture.
