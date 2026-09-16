# Launch status — September 15, 2026

This record supersedes the historical prelaunch status in `campaign.json` and `README.md`. It records observations from the live Meta interface, not inferred delivery or conversions.

## Paid pilot

- Ad account: Forger Cloud — Instagram, `2930959493947722`, currency CLP.
- Identity: Facebook Forger Cloud (`1266716363194616`), Instagram @forger.cloud (`17841438498094949`).
- Campaign: `120258182946860197`, “Forger | Create your first app | IG | Test Sep 2026”. Published; activation switch verified on.
- Ad set: `120258182946880197`, “IG | English | Mac creators | Pilot”. Published; after a fresh browser reload its activation switch is on and delivery is **Programado**.
- Lifetime media budget: **20,000 CLP shared by both ads**, not per ad and not daily. Start September 16, 2026 at 17:55; end September 21 at 17:55, America/Santiago.
- Audience: United States, English (all), adults; broad audience. Apple silicon hardware targeting is not verified. The Mac requirement appears in the creative and copy.
- Placements: Instagram Stories and Reels only. Limited spending in excluded placements is off.
- Objective: Traffic; maximize landing-page views. No product conversion pixel or new tracking SDK was installed.
- The user authorized execution and funded Meta. Observed prepaid balance before launch: 30,000 CLP; auto top-up off. The 20,000 CLP is a media cap, not a verified tax-inclusive invoice amount. No further campaign or recurring spending is authorized by this record.

Meta confirmed publication of the campaign, ad set and both ads. Last observed ad-level state:

| Ad | ID | Activation | Meta delivery state |
| --- | --- | --- | --- |
| 01 — Free Private Local | `120258182946870197` | On | Programado |
| 02 — Daily Compass | `120258185951210197` | On | Programado |

Meta currently shows both ads as scheduled; this is not evidence that delivery has started or a separate explicit approval confirmation. With the reporting filter set to **Today, September 15, 2026**, each ad displays **0 CLP** spent. The single ad set is on, shows **Programado**, retains its **20,000 CLP lifetime budget**, and also displays **0 CLP** spent today. This current-day observation supersedes the earlier zero-spend reading from a historical reporting window. No performance or installation result is recorded.

Both ads use the real-screenshot 13-second paid masters and corresponding manual covers in `../followup-2026-09-24/exports/`. CTA: Download. Display link: forger.cloud. Multi-advertiser ads, site links, generative video/text changes, relevant comments, CTA improvements, highlights and video effects are off. Core “optimize text per person” remains shown as on; it is not claimed to be disabled.

Ad 01 primary text:

> Using Forger on your computer is free. Create your first app with a supported provider account you already have. For Mac with Apple silicon. Provider terms and costs may apply.

Headline: **Free. Private. Local.** Destination: `https://forger.cloud/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_2026_09&utm_content=reel_01`.

Ad 02 primary text:

> Turn your idea into an app you actually use. Daily Compass is an example app created with Forger: open, focus, and complete a real workflow. Create your own first app on a Mac with Apple silicon. Free for people. Provider terms and costs may apply.

Headline: **Open. Focus. Complete.** Destination: `https://forger.cloud/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_2026_09&utm_content=reel_02`.

## Public landing and product limits

- PR #16 is merged; merge commit `583c840995858fed9c5b59b34344c0356268f289`; deployment run `35023960888` succeeded.
- `/instagram/` and `/es/instagram/` returned HTTP 200 after deployment. Campaign navigation excludes Teams/cloud catalog links; the main website navigation is unchanged.
- Campaign copy excludes Forger Teams, Hivemnd and shared-folder/cloud-service promises. The user confirmed Teams is not operational and there is no current Forger deployment on Heroku. Legacy source/DNS references do not establish a live deployment.
- The public desktop installer download works. The released v0.5.17 source audit supports local creation without a Forger account or cloud catalog. Provider authentication and dependency downloads are still prerequisites. A clean-install end-to-end creation test has not been completed.
- Privacy copy distinguishes local app data from information sent to the selected AI provider under its terms. It does not claim all AI processing is offline.
- Website verification: 58 tests passed; production build generated 38 routes; English/Spanish campaign output checks passed.

## Organic calendar

Existing September 17 (13:00) and September 20 (11:00) posts were previously verified scheduled. Do not duplicate them.

The four follow-up assets are approved under the user's delegated creative approval and **scheduled on both Instagram and Facebook**:

| Date, America/Santiago | Format | Theme | Verified scheduling |
| --- | --- | --- | --- |
| September 24, 13:00 | Reel | Free. Private. Local. | Instagram and Facebook |
| September 27, 11:00 | Four-image carousel | Existing provider accounts | Instagram and Facebook |
| October 1, 13:00 | Reel | Daily Compass as an example app | Instagram and Facebook |
| October 4, 11:00 | Four-image carousel | Local data and explicit file sharing | Instagram and Facebook |

The Business Suite browser connection previously stopped returning a usable window while opening the organic planner; no organic submission was attempted during that interruption. The Chrome connection was recovered and scheduling is complete. Meta confirmed both reels with the “Reel programado” modal and confirmed the carousel submissions. The monthly calendar corroborated all four dates and times in both accounts. These confirmations establish scheduling, not publication.

Both reels use the exact organic MP4 masters and corresponding covers recorded in the follow-up manifest, not the paid variants. They remain silent, with no added music. Each carousel contains its four real-screenshot images in the recorded 1–4 order. Separate Instagram and Facebook captions were applied, including the Facebook UTM links and the updated Daily Compass example-app wording; no functioning public catalog is promised. Promotion is off and no additional paid spend was added.

## Measurement and next check

No attributed installation, first-app creation, retained-user count or acquisition cost is available. Future delivery remains pending; both ads are currently scheduled. A recurring campaign monitor is not configured by this execution. Before reporting spend, select a reporting window that includes the actual delivery dates. Review the pilot before authorizing any additional spend.
