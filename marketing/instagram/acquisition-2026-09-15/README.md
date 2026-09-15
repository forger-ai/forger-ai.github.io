# Instagram acquisition: first app

Operational snapshot: **2026-09-15**. Status: **blocked; no advertising spend incurred by this task**.

## Goal and scope

Help people who already use AI create their first private or shareable app with Forger. The initial audience uses English and a Mac with Apple silicon. Instagram followers are a secondary outcome.

This folder contains the operating plan (`README.md`), the proposed campaign configuration and readiness gates (`campaign.json`), and an empty evidence log (`results.csv`). It does not create a Meta campaign, publish assets, deploy the site, schedule an automation, or authorize payment.

The Pages repository owns the landing and campaign material. Desktop owns the released installer and application behavior. Backend owns authentication and product records. Campaign claims depend on the behavior of the released product, not an unreleased local change.

## Current evidence and blockers

These observations are supplied by the coordinating task on 2026-09-15. Recheck each external state before launch and attach fresh evidence to `campaign.json`.

| Area | Current observation | Required resolution |
| --- | --- | --- |
| Landing | `https://forger.cloud/instagram` returns HTTP 404. [Pages PR #15](https://github.com/forger-ai/forger-ai.github.io/pull/15) requires one GitHub review. | Complete the required review and deployment, then verify the public URL. |
| Mobile handoff | Implemented locally in commit `2d248f2`: share/copy, cancellation and manual-copy fallback, safe campaign links, and device-aware downloads. All 34 focused tests, the 38-page production build and 12 emulated Chrome journeys pass. | Test the deployed flow from Instagram's mobile browser to a compatible Mac. Emulated devices do not establish physical-device validation. |
| Authentication | `https://platform.forger.cloud` returns Cloudflare DNS error 1016. The published Desktop version uses this destination. | Restore and verify the destination used by the published installer. Complete a real sign-in from that installer. |
| Creative | Two English paid variants and four organic pieces are prepared in commit `8431c6c`. The paid end cards and covers state Mac Apple silicon. These are sequences of real screenshots; no continuous app-creation recording is claimed. Meta asset IDs remain unset. | Verify the advertised journey in the public release, then upload the reviewed assets to the correct account. |
| Meta account | The Forger portfolio has no ad account. The form for **Forger Cloud — Instagram** is prepared with USD and America/Santiago. User authorization to accept legal terms is pending. | Complete creation after that authorization and verify the resulting account and connected Instagram identity. |
| Payment | No spend is incurred by this task. Tax rate and additional charges are unverified. | Verify actual charges and present the all-in trial amount for user approval. |
| Measurement | Backend has installation, creation and opening aggregates without campaign linkage. The landing does not send central analytics data. | Preserve these limits in reporting. Verify each available measurement before using it. |

**Do not activate paid delivery while the landing or released Desktop sign-in fails.** A working local preview or an unreleased fix does not clear either gate.

## Proposed experiment

- Use one initial audience in the United States and two English videos. The United States is a market hypothesis, not a demonstrated best-performing market. Do not promise a result from this budget.
- Address people who already use AI and are starting to automate or program. Show a concrete app they can create using the current product.
- State **“For Mac with Apple silicon”** in the creative and landing. Do not assume Meta can target Apple silicon hardware or every AI tool by interest. Verify the targeting options actually available in the account.
- Send both videos to the English `/instagram` landing with distinct `utm_content` values. The plan assigns `reel_01` and `reel_02`; these identify the proposed variants, not uploaded assets.
- Keep the same offer and destination across both variants. Meta may distribute delivery unevenly. Treat the initial comparison as exploratory rather than a controlled experiment.
- Prepare a Traffic campaign with link-click optimization if available. Product conversion events are not currently connected. This trial measures response to the message; it cannot establish cost per first app.
- Do not divide this trial across more markets, contests, follower campaigns or additional paid services.

The proposed links are:

- Reel 01: `https://forger.cloud/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_2026_09&utm_content=reel_01`
- Reel 02: `https://forger.cloud/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_2026_09&utm_content=reel_02`

UTM parameters identify the route through which a visit arrives. Preserving them in a shared link does not establish an attributed installation, sign-in or first app creation.

Prepared assets and channel-specific captions are in [the follow-up manifest](../followup-2026-09-24/manifest.json). The two paid masters are [Free. Private. Local.](../followup-2026-09-24/exports/paid-reel-free-private-local.mp4) and [Open. Focus. Complete.](../followup-2026-09-24/exports/paid-reel-daily-compass.mp4), each 13 seconds at 1080 × 1920. Both are silent masters. No music has been licensed or added by this task. The organic material remains unscheduled while the public landing and sign-in are blocked; the existing September 17 and September 20 schedule is unchanged.

## Budget and approval

| Control | Amount (USD) | Meaning |
| --- | ---: | --- |
| Monthly all-in ceiling | 100.00 | Total campaign-related charges in a calendar month, including media, taxes, fees and any approved paid service. |
| Proposed initial trial, all-in | 30.00 | Maximum total for the first experiment, subject to explicit user approval before payment or activation. It is part of the monthly ceiling. |
| Media allowance | Unknown | Calculate from the actual billing treatment. Do not enter USD 30 as media spend and add taxes afterward. |
| Further monthly spending | Not approved | The difference between the ceiling and the trial is not automatically authorized. |

Before approval, record the verified tax treatment, fees, any other campaign costs, the resulting media allowance, and the method used to bound delivery. Use a total/lifetime delivery limit and an end date if supported by the account. A daily budget alone is not evidence that the all-in total is capped. Verify the available controls and their semantics before using them.

The launch date and end date remain unset until the dependencies are ready and the user approves the concrete charge. Stop at the approved trial limit. Present actual evidence before requesting any additional spend. A monthly ceiling does not create a recurring purchase authorization.

## Six launch acceptance checks

1. **Public route works.** Both campaign links return the intended English landing over HTTPS in a fresh mobile browser and desktop browser. Required GitHub review/deployment is complete. The landing clearly states the hardware requirement and provides the correct stable installer.
2. **Mobile handoff works.** A real share/copy action preserves the campaign parameters. Opening the resulting link on a Mac provides the download route. Cancellation, unavailable sharing and clipboard failure have usable fallbacks. A copied/shared link is not reported as a delivered email or completed install.
3. **The released product works.** Download the public installer on a supported Mac, complete sign-in through its configured destination, and create and open the simple app shown in the ad. Check any account or tool prerequisites before promising the outcome. Record the version and evidence of the completed flow.
4. **Identity and creative are verified.** The Forger ad account exists with the intended currency/timezone and the correct connected Instagram identity. Required terms are accepted by the user. Both reviewed English videos and final copy have real asset references, a clear Mac Apple silicon requirement and correct tagged destinations.
5. **Spending is bounded and approved.** All campaign costs fit within the USD 30 trial and USD 100 monthly ceiling. Actual billing treatment is documented. The user approves the concrete trial total. Delivery limits and dates are configured and verified before activation.
6. **Reporting tells the truth.** Meta outbound clicks and media spend can be exported for the campaign/ad and exact reporting period. Source definitions for any backend aggregates are checked. The report distinguishes unavailable central landing data and unavailable product attribution, preserves 30-day counter and 90-day funnel windows, and contains no invented cost per acquired user or app.

All six checks must pass before paid activation. Full campaign-to-product attribution is currently unavailable and must remain disclosed; this trial cannot establish an attributed cost per first app from the existing aggregates. Installing new attribution requires a separately verified implementation in the owning systems.

## Evidence log and metric definitions

`results.csv` starts with headers only. Add one row per metric, source, entity, reporting window and extraction. Keep the original source export or evidence reference. Do not populate example performance, replace missing data with zero, or backfill unobserved conversion events.

| Field | Format or meaning |
| --- | --- |
| `recorded_at_utc`, `source_extracted_at_utc` | ISO 8601 UTC timestamps. Recording time and source extraction time are distinct. |
| `period_start_utc`, `period_end_utc` | Exact interval, inclusive start and exclusive end. Record the source timezone as well. |
| `window_kind`, `window_days` | `fixed_interval` or `rolling`; days covered by that source window. Preserve 30-day counters and 90-day funnels in separate rows. |
| `source_system`, `source_reference`, `source_timezone` | Provider/report, real export or evidence reference, and report timezone. Do not include credentials or private raw user data. |
| `entity_scope` | `ad`, `adset`, `campaign` or `product_aggregate`, according to the source. Do not sum overlapping scopes. |
| `meta_campaign_id`, `meta_adset_id`, `meta_ad_id` | Real Meta identifiers, stored as text. Empty until assigned and verified. |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` | Actual campaign tags when supported by the row's source. Leave empty for unlinked product aggregates. |
| `metric_name`, `metric_value`, `metric_unit` | Metric definition below, raw numeric value and explicit unit. No currency symbols in numeric cells. |
| `attribution_scope` | `meta_ad_delivery`, `unattributed_product_aggregate`, `unattributed_site_aggregate` or `unavailable`. Use only a supported scope. |
| `data_status` | `observed` or `unavailable`. Use an empty value or `NA` for unavailable values. Use numeric zero only for an observed zero. |
| `notes` | Source definition, deduplication rule, exclusions or a specific missing-data reason. |

| Metric name | Unit | Current interpretation |
| --- | --- | --- |
| `meta_outbound_clicks` | `count` | Meta-reported outbound clicks. Not all link clicks, unique users, landing loads or downloads. |
| `meta_media_spend` | `USD` | Ad delivery spend from Meta. Does not establish the invoice's all-in total. |
| `billed_taxes` | `USD` | Verified campaign taxes for the documented billing period. Unavailable until billing evidence exists. |
| `billed_fees` | `USD` | Verified campaign fees for the documented billing period. Keep separate from media spend. |
| `other_campaign_costs` | `USD` | Any separately approved campaign costs for the documented billing period. |
| `backend_installation_count` | `count` | Source-defined installation aggregate. Confirm its exact event and deduplication semantics before entering a value. Unattributed to this campaign. |
| `backend_app_creation_count` | `count` | Source-defined creation aggregate. Do not assume it counts first apps or unique users. Unattributed to this campaign. |
| `backend_app_opening_count` | `count` | Source-defined opening aggregate. Do not relabel it as sign-in, activation or retention. Unattributed to this campaign. |

For an available backend funnel, preserve the exact source step and cohort definition in `metric_name` and `notes`; do not manufacture a funnel from unrelated counters. Campaign-attributed installations, successful sign-ins, first app creations and central landing visits are unavailable in this snapshot. Do not add values for those outcomes without a real source.

Calculate cost per outbound click only from media spend and outbound clicks with the same period and scope. Leave it unavailable if clicks are missing or zero. Do not divide campaign spend by unlinked product aggregates to produce an acquisition cost. Do not sum overlapping rolling windows, combine 30-day counters with 90-day funnels, or interpret changes in overall product activity as caused by these ads.

## Operating sequence

1. Complete the landing, hosting/authentication repairs and final video production in their owning tasks.
2. Verify the public mobile-to-Mac journey and the released product flow. Record evidence and update the readiness gates.
3. Complete account setup, legal acceptance and actual cost verification. Prepare paused ads with real identity and asset references.
4. Present the final assets, destination, targeting, dates and all-in trial total for the user's payment approval. Leave delivery paused until approval is recorded and every gate passes.
5. After authorized activation, review spend and destination/sign-in health daily during the trial. Pause immediately for a broken landing, installer or sign-in, incorrect identity/creative, or a risk of exceeding the approved total.
6. At the trial limit, stop and review the available evidence. Report the attribution limits and small sample honestly. Further spending requires a new approval.

This document specifies the procedure. It does not itself enable monitoring, collect analytics or enforce Meta spending limits.
