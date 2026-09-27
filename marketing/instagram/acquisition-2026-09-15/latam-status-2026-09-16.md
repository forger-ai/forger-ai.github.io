# LATAM — estado operativo del 16 de septiembre de 2026

**CONFIGURACIÓN Y QA COMPLETADAS — BORRADOR SIN PUBLICAR. La campaña LATAM existe en Meta, pero no está publicada ni activa para entrega.** La configuración y revisión visual están verificadas; el saldo, la prueba de instalación independiente y la actualización de fechas siguen siendo condiciones para activar. Este registro no confirma lanzamiento, entrega ni resultados. No se realiza commit ni publicación de este documento.

## Resumen funcional

- La campaña actual de Estados Unidos permanece sin cambios. La lista final de Meta muestra Estados Unidos como Programado, con interruptor encendido, y LATAM como Borrador, también con interruptor encendido. El interruptor del borrador no significa publicación ni entrega.
- La nueva campaña LATAM usa textos en español y las gráficas existentes en inglés. Reutiliza las versiones ya exportadas que no contienen etiquetas de Mac; no se generan imágenes de producto nuevas.
- El piloto configurado incluye Chile y México, Instagram Stories y Reels, con 20.000 CLP totales compartidos entre dos anuncios durante cinco días. No es un presupuesto diario ni por anuncio.
- La página de destino y la medición web específica de LATAM están publicadas. Eso no significa que los anuncios estén publicados.
- El saldo disponible observado es 30.000 CLP, con recarga automática desactivada. Los topes de Estados Unidos y LATAM suman 40.000 CLP: cubrir ambos requiere al menos 10.000 CLP adicionales disponibles, sujeto a impuestos y a una nueva comprobación de saldo/gasto. No se realizan cargas, cambios de facturación ni otras operaciones financieras.
- La pregunta al usuario sobre cargar saldo o conservar el borrador está enviada; no hay respuesta registrada en este corte.

## Identidad y objetos de Meta

Ad account: Forger Cloud — Instagram, `2930959493947722`, currency CLP. Identity: Facebook Forger Cloud (`1266716363194616`), Instagram @forger.cloud (`17841438498094949`).

| Object | Name | ID | Observed state |
| --- | --- | --- | --- |
| LATAM campaign | Forger \| Crea tu primera app \| LATAM ES \| Sep 2026 | `120258199443400197` | Draft; not published or activated |
| LATAM ad set | IG \| Español \| Chile + México \| Piloto 5 días | `120258199443430197` | Draft; configuration and QA verified |
| LATAM ad 01 | 01 \| Gratis y local \| LATAM ES | `120258199443420197` | Draft; configuration and QA verified |
| LATAM ad 02 | 02 \| Daily Compass \| LATAM ES | `120258199443410197` | Draft; configuration and QA verified |

Existing US campaign `120258182946860197` remains unchanged. Do not overwrite its targeting, budget, dates, assets, captions or destinations while completing LATAM.

## Audience, placements and budget

- Countries: Chile and Mexico. This is a two-country LATAM pilot, not all Latin America.
- Age: 18–65+; all genders.
- Language: Spanish (all).
- Interests: broad, with no specific interest restrictions.
- Devices: all devices; no Mac-only audience restriction.
- Placements: Instagram Stories and Instagram Reels only. Spending in excluded placements is off.
- Lifetime media budget: 20,000 CLP shared by both LATAM ads.
- Copied preliminary dates: September 16, 2026 at 17:55 through September 21 at 17:55, GMT−3 / America/Santiago. These dates require refresh before activation if they no longer provide the approved full five-day pilot.
- The observed media budget is not a verified tax-inclusive invoice total. Additional account funding is distinct from authorizing any higher media cap.

## Existing creative reused without regeneration

All paths below are relative to this Pages repository. Both videos are silent 13-second masters, 1080 × 1920, 30 fps. They use genuine product screenshots and the established Forger design. Source manifest: `marketing/instagram/followup-2026-09-24/manifest.json`.

### Ad 01 — Gratis y local

- Video: `marketing/instagram/followup-2026-09-24/exports/reel-2026-09-24-free-private-local.mp4`.
- Cover: `marketing/instagram/followup-2026-09-24/exports/reel-2026-09-24-free-private-local-cover.png`.
- English visual wording: “FREE. PRIVATE. LOCAL.”, “DOWNLOAD FREE”, “Turn your idea into an app you actually use.”
- Spanish primary text: “Forger es gratuito para las personas. Convierte tu idea en una app para tu día a día usando una cuenta de IA compatible que ya tienes. Tus apps guardan sus datos localmente. Se aplican los términos y límites de tu proveedor.”
- Headline: “Gratis para las personas.” CTA: Descargar.
- Destination: `https://forger.cloud/es/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_latam_2026_09&utm_content=reel_01`.

### Ad 02 — Daily Compass

- Video: `marketing/instagram/followup-2026-09-24/exports/reel-2026-10-01-daily-compass.mp4`.
- Cover: `marketing/instagram/followup-2026-09-24/exports/reel-2026-10-01-daily-compass-cover.png`.
- English visual wording: “Open. Focus. Complete.”, “DOWNLOAD FREE”, “Turn your idea into an app you actually use.”
- Spanish primary text: “Crea una app que realmente uses. Daily Compass es un ejemplo creado con Forger: organiza tareas, enfócate y completa tu trabajo. Crea tu propia herramienta, a tu manera. Forger es gratuito para las personas. Se aplican los términos y límites de tu proveedor.”
- Headline: “Tu idea, convertida en una app.” CTA: Descargar.
- Destination: `https://forger.cloud/es/instagram?utm_source=instagram&utm_medium=paid_social&utm_campaign=first_app_latam_2026_09&utm_content=reel_02`.

Both selected organic MP4 files and their corresponding manual covers are uploaded to the new ads. Meta confirms the original 1080 × 1920, 13-second media and manual covers. Both actual Instagram Stories/Reels previews show the correct genuine app graphics. Spanish primary text, headlines, Download CTA, Spanish destinations and the @forger.cloud / Forger Cloud identity are verified. Neither new copy nor selected creative contains a Mac label. Both review pages explicitly show Advantage+ creative and multi-advertiser ads off; relevant comments are also off and generated images count is zero.

The final ad-set review confirms Chile and Mexico, ages 18–65+, all genders, Español (todos), Instagram Stories/Reels only, 20,000 CLP lifetime budget and the preliminary September 16 at 17:55–September 21 at 17:55 Santiago dates. The editor is closed using Cerrar, not Publicar. Meta confirms exactly four pending draft items: the campaign, ad set and two ads. The campaign list shows US Programado/on and LATAM Borrador/on. The LATAM draft switch does not establish delivery or publication.

The Revisar y publicar (4) preview is inspected across all three tabs: one new campaign, one new ad set and two new ads, all belonging only to LATAM. Every Errores cell shows “—”. The dialog is canceled without publishing. This is a draft-validation observation, not Meta ad-review approval. The saved browser handoff remains on the campaign table with US Programado and LATAM Borrador.

The corresponding `paid-reel-*.mp4` files and paid covers are deliberately not reused: they contain “FOR MAC WITH APPLE SILICON” and a Mac label on their end cards. The selected organic masters use the same first four scenes, screenshots and design without that platform-specific final card. Their old manifest captions mention Mac and are not the source for the new Spanish captions. The existing US campaign and organic schedule are not changed by this selection.

## Website deployment and measurement boundaries

- Pages [PR #18](https://github.com/forger-ai/forger-ai.github.io/pull/18) is merged at `b9d0ab639f804f22e9c406a33e6eb467afd799d3`.
- [Deployment run 35131821505](https://github.com/forger-ai/forger-ai.github.io/actions/runs/35131821505) succeeds.
- LATAM uses fixed, separate web campaign codes with `desktopEligible: false`. The ten existing US/organic mappings remain unchanged.
- LATAM web measurement does not establish Desktop campaign attribution or a person-level web-to-install funnel. Do not present these codes as eligible Desktop handoff codes.
- No production test events are sent. Synthetic checks are not campaign users.
- Download-button clicks do not prove completed downloads, installations, retained users or first-app creation. An empty consenting sample does not prove zero users.
- Consent and privacy boundaries remain unchanged: measurement is optional and off by default; no files or chat contents are collected. Local app data does not imply that AI provider processing is offline.

## Outstanding launch checks

1. Resolve the account funding decision with the user, recheck available balance and accumulated spend, and keep automatic recharge off. No reply or additional funding is recorded at this cut.
2. Refresh start/end dates before activation so the lifetime cap and full pilot duration remain explicit.
3. Complete an actual clean-install end-to-end test on a separate OS profile, VM or second computer. The user's existing profile is not a clean-install test environment; no complete fresh-user installation/provider-authentication/first-app flow is verified by this record.
4. Publish or activate only after the applicable launch checks and user direction are resolved. Record Meta's actual resulting state separately from this draft configuration.

This record does not certify ad delivery, Meta review approval, installation counts or campaign performance.
