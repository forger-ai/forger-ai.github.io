# Campaign measurement readiness

Initial audit date: September 15, 2026, America/Santiago. On September 16 the user authorizes all four steps: voluntary measurement, a separate free PostHog destination, implementation/testing, and publication after verification. The dedicated organization and project are created; implementation is in progress. No product release or website telemetry deployment is complete. See `posthog-setup-2026-09-16.md` for the verified destination.

## Current evidence

- Pages records download intent only in browser session storage and a local custom event. There is no central collector. A click does not establish a completed download.
- The campaign handoff preserves allowlisted UTM labels when the visitor copies or shares the link. The live language toggle drops those labels. A local fix preserves safe labels across English/Spanish without adding collection, while keeping the HTML fallback and SEO links unchanged. Its 36 focused tests pass. After aligning stale organic-post tests with the already verified scheduling record, the full suite passes 66/66 and the 38-page build succeeds. The fix is not deployed.
- Public Desktop v0.5.17 has usage events but no campaign-attribution ingress or stored campaign labels. Its configured old platform destination is not evidence of a live service. The user confirms no current Heroku deployment and no operational Teams service.
- Existing Desktop analytics defaults to enabled, and the first-run event bypasses the disabled preference. Do not reactivate that collector as a shortcut: a voluntary-only design must change these semantics first.
- The existing first-run event is marked sent before delivery success and has no reliable retry. Historical first opens cannot be reconstructed by restoring a receiver.
- The initial audit does not identify a Forger project. On September 16 a new Forger organization and project 612473 are created without mixing Eigen data. No unrelated individual event data is queried.
- GitHub's cumulative Apple silicon DMG download baseline is 74 for asset 510802155. See `github-download-baseline.json`. It is not a count of campaign users or installations.

## Proposed user-visible outcome

A small dashboard separates campaign traffic, download clicks, consented first opens and consented first app creations. Only the latter two require a new Desktop version. The dashboard never labels clicks as installations or installation profiles as verified unique people.

Use the dedicated Forger analytics destination without mixing other businesses' data. The Free plan is selected without adding a billing method. Its displayed allowance includes 1M analytics events per month; no additional paid project or service is authorized. References: https://posthog.com/pricing and https://posthog.com/docs/privacy/data-collection.

## Authorized implementation plan

1. Keep paid advertising budget unchanged. Scope and destination are approved; Desktop and Pages publication are authorized only after the checks below pass. The separate organization is created through the user's logged-in PostHog session.
2. Define BDD flows before implementation: default-denied consent; refusal leaves download/app fully usable; withdrawal stops collection and clears queued events; no sensitive fields; safe campaign transfer; deduplication and bounded retries; collector failure never blocks Forger.
3. Pages: explicitly scoped campaign events and consent explanation, safe UTM labels, no arbitrary URL/referrer capture, no fingerprinting, automatic click capture, recordings or Meta pixel. Test test/production separation and URL-to-dashboard delivery before deployment.
4. Desktop: explicit campaign link/code ingress through the existing safe main/preload boundary; no deferred-attribution claim from DMG URLs alone. Show an optional consent choice naming the destination and data. Do not reuse historical opt-out preferences as approval for a new recipient.
5. Emit only consented `first_open` and optionally `first_app_created`, campaign label, random profile identifier, version/platform and necessary deduplication fields. No app names/IDs, file paths, chat content, prompts, email or hardware fingerprint. Do not send refusal events. Define what reconnect, reinstall and profile reset mean.
6. QA: fresh supported-Mac profile; origin transferred explicitly; consent accepted/refused/revoked; offline/restart/retry; no duplicates; first newly created app versus preexisting apps; provider errors; receipt visible in a separately labeled test dashboard. Publish only after standard build/notarization checks and campaign-specific integration checks pass.
7. Reporting: consented profiles are an incomplete, self-selected sample. Report unmeasured outcomes as unavailable, not zero. Attribute only when a campaign label is actually received. Do not divide ad spend by aggregate GitHub downloads to claim acquisition cost.

This plan does not activate an automated monitor or authorize new expenditure.

## Behavior-first implementation boundaries

- Pages owns the optional English/Spanish consent panel, strict campaign mapping, minimal manual web capture, safe after-install handoff, and privacy disclosures. Downloads remain usable without consent, JavaScript, storage, or collector availability.
- Desktop owns explicit campaign ingress, a main-process consent/outbox service, thin typed IPC/preload wiring, optional MUI consent controls, and decommissioning the legacy usage receiver path. No backend/Heroku/Teams changes are involved.
- The root agent owns PostHog setup, cross-repo contract verification, staged synthetic receipt tests, dashboard definitions, and release coordination. Independent UX review checks the cross-device consent flow.
- Both workers write failing behavioral tests before implementation. Main reviews the changes before accepting them. Existing unrelated Desktop work remains untouched in its original branch; measurement starts at release/main commit `7d51da58f241aac0abb56029734845605885c978` in a separate worktree. Pages starts at current main `583c840995858fed9c5b59b34344c0356268f289`, preserving the earlier scheduling records and tested UTM fix.

### Event and attribution contract

- Web events: `forger_campaign_landing_view`, `forger_campaign_download_click`, `forger_campaign_handoff_copy`, `forger_campaign_handoff_share`, `forger_campaign_desktop_handoff`. The last event describes an attempt, never proof of installation.
- Desktop events: `forger_campaign_first_open`, `forger_campaign_first_app_created`. Only conservatively identified fresh local profiles qualify. First-open consent must happen in the initial session; pre-consent app creation is not backfilled or replaced by a later creation. Existing profiles are not counted as acquisition.
- Known campaign codes: `ig_202609_paid_01`, `ig_202609_paid_02`, `ig_202609_org_01` through `ig_202609_org_04`, and `fb_202609_org_01` through `fb_202609_org_04`. Organic ordering is free/private/local, existing provider, Daily Compass, local data/sharing. Unknown or ambiguous origin is `unattributed`.
- Browser handoff uses only `forger://campaign?code=<known-code>`, with a manual code fallback. It does not transmit a browser identity, auto-consent, or claim deferred attribution from a DMG URL. The Desktop origin and entire event payload are immutable before the first send attempt: a timed-out request may already have reached the collector. Retries preserve the event UUID, timestamp and all properties.
- Transport is manual POST to the dedicated US PostHog capture endpoint, with a public write-only project token. Properties are allowlisted; person-profile processing and GeoIP enrichment are disabled. No SDK, replay, automatic event capture, identity merge, arbitrary UTM strings, full URL/referrer, email, app identifier, file path, prompt, chat, or hardware fingerprint is included.
- Consent is separate on web and Desktop, default off, and is not inferred from legacy preferences. New random identifiers exist only after consent. Rejection sends nothing. Withdrawal stops future/pending sending and erases the local random identifier and queue; it does not promise deletion of previously received events. Desktop retains only non-identifying lifecycle flags and permanently disqualifies that profile's acquisition milestones, including after re-enabling consent, rather than splitting a first-open/first-app cohort across identifiers. If withdrawal cannot be persisted, sending stays paused in the current process and the interface explicitly reports that the choice was not saved.
- Synthetic verification uses `environment: test`; reports filter `environment: production`. Web and Desktop random identifiers are separate, so a cross-device person-level funnel is not claimed. Report consenting first opens and first app creations as a limited sample, never total installations or unique people.

### Required gates

1. No network/identifier before consent; no legacy bypass; rejection/revocation/storage failure; safe code parsing and untrusted IPC callers.
2. Genuine creation versus startup detection; fresh/existing/profile reset behavior; concurrent send, restart, offline, timeout, bounded retry, stable event UUID/timestamp and duplicate handling.
3. EN/ES mobile-to-Mac handoff, unknown code fallback, cancellation, navigation, language preservation and accessibility; no fake install success.
4. Pages full tests/build and browser preview. Desktop lint/typecheck/build, main and renderer tests, cross-platform CI and real Electron smoke; no weakened privacy or coverage gates.
5. Only labeled synthetic events reach the new project during QA. Verify received properties and absence of unnecessary enrichment before enabling production.
6. Review/merge the scoped PRs under delegated approval, release with meaningful notes, require successful signing/notarization, verify artifact metadata/checksums and live web behavior.
