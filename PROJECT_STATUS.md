# Project status — Bijouterie Zied & Nihel Zayeti website

Living board for the autonomous agency session that started 2026-11-02. The Coordinator keeps it current.

## Objective
Make the demo site feel like a premium jewelry house's site while keeping it simple to run:
one static `index.html` (French), GitHub Pages hosting, orders and custom requests sent through WhatsApp,
and a 3D "Sur mesure" configurator using Three.js r128 from a CDN.

Hard constraints
- One file, no build step. External scripts come only from the jsDelivr CDN at pinned versions.
- Keep the Playwright tests in `tests/form.spec.js` passing: their selectors, labels, and the keyboard order
  "Gravure → Budget select" must not change.
- Work on branch `design/restyle-home`: commit locally, never push or merge to `main` without the owner.
- Prices, photos and the WhatsApp number are placeholders; never invent real business facts.

## Organisation
| Agent | Role | Writes code? |
|---|---|---|
| CEO (main session) | Vision, final decisions, quality gate | Yes (only writer to `index.html`) |
| Coordinator (main session) | Board, sequencing, verification | Keeps this file |
| Creative Director | Storefront design audit and direction | Audit only |
| Jewelry / 3D Art Director | Configurator realism and presentation audit | Audit only |
| QA & Front-end Engineer | Bugs, accessibility, performance, responsive audit | Audit only |

Why only one writer: the whole site is a single file, so parallel edits would conflict. Specialists audit in
parallel; the CEO merges their recommendations into one prioritized plan and implements it, verifying each
change in the browser.

The original brief was cut off partway through Agent 4. Roles after that (front-end, QA, and so on) were
inferred and combined into the QA & Front-end Engineer.

## Done before this session
- Restyled the home page and the site-wide design (commit c642ad3).
- Rebuilt the Sur mesure configurator: a separate model per piece, filters that match the design, engraving drawn
  on the piece, a display bust for necklaces, and a view toolbar (commit 82c96a1, pushed).

## Completed this session (2026-11-02)
- [x] Creative Director, 3D Art Director and QA audits, run in parallel
- [x] CEO decisions (below)
- [x] Security and checkout fixes (QA P0)
- [x] Accessibility and SEO fixes (QA P1)
- [x] Storefront redesign (Creative Director P0 and P1)
- [x] 3D realism (3D Art Director P0, most of P1 and P2)
- [x] Browser verification: desktop at 1440 px, mobile at 375 px, dark and light themes, every route,
      the form flows the tests cover, and no console errors
- [x] Local commit on `design/restyle-home` (not pushed)

## Decisions (CEO)
**Accepted, storefront**
- Cormorant Garamond serif for headings, with a gold italic accent word.
- The contact block (`.ctb`) moves to a dark surface; gold stays an accent.
- Prices in ink rather than gold, except on the product page.
- No repeated photos on the home page.
- Asymmetric collection tiles; a 3-column "Coups de cœur" section.
- Two-column cart with a recap panel.
- Product page: portrait image, category label, hairline specs list.
- Text-tab shop filters with an item count.
- The mobile hero fits on the first screen; the nav row fades at its edge to show it scrolls.
- "Prendre rendez-vous" now opens WhatsApp.

**Accepted, 3D**
- Mirror-like stones lit by their own black-and-white facet environment, with saturated colored stones.
- True princess and emerald step cuts, with matching bezels.
- Oval and emerald solitaires sit north-south.
- Long engravings wrap onto several lines.
- Finer brossé lines, round martelé dents (millimetre UVs), and less blown-out white gold.
- Finer pendant chains and a near-black velvet bust.
- Heart bail moved into the notch; beads hold the créole stones.
- Two rows of pavé on 6 mm bands.

**Accepted, QA**
- Cart keys from storage are checked against the catalogue (closes the XSS and the crash).
- Admin buttons no longer put record ids inside inline JS.
- Checkout validation, a confirmation screen, and line subtotals.
- A "Bijou introuvable" page for unknown products.
- Focus is restored after re-renders; labelled groups, `aria-pressed`, a skip link and `aria-current`.
- Input borders and placeholders meet the contrast minimums.
- A page title per route and a favicon.
- The theme choice is saved and the first visit follows the OS setting.
- Three.js loads only on the configurator.

**Rejected or deferred**
- Hiding the nav on the mobile configurator: it costs navigation.
- Cathedral shoulders and render-on-demand: low visible gain for the effort.
- Moving the photos out to separate image files: a real performance win, but it changes how the site is
  deployed and maintained. That is the owner's call.
- Restoring scroll position on back/forward navigation: P2.

## Problems found and fixed
- Step-cut stones were rendering inside-out, which caused a winding bug in the new loft geometry.
- A syntax slip in `engravePlane` was caught by the render sweep.

## Blockers
- Node.js isn't installed on this machine, so the Playwright suite can't run here. Its flows were replayed
  manually in the browser and pass.

## Next actions (need the owner)
- Run `npm install && npm run test:install && npm test` on a machine with Node.
- Decide whether to move the seven photos to `img/*.webp` files.
- Review, then push the branch and merge it to `main` for GitHub Pages.
