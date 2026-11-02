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
| Mobile & Responsive Lead | Phone and tablet experience on every route: layout, touch, gestures, forms, 3D on touch | Audit only |
| Motion Director | Motion design: choreography, curves, timing, both themes | Audit only |

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

## Responsive pass (requested 2026-11-02): done
- [x] Mobile & Responsive Lead audit: 320–430 px phones, 768/1024 tablets, phone landscape
- [x] CEO decisions (below)
- [x] Implementation, checked at 320×640, 390×844, 375×812, 812×375, 768×1024 and desktop
- [x] Local commit

**Accepted**
- At 320 px the logo wraps, so the header and cart button no longer overflow (page width 358 → 320).
- On touch screens, one finger scrolls the page over the 3D preview and two fingers turn and zoom it, with a hint.
- Phones get the 3D controls back: Porté or Gravure on the left of the canvas, zoom and rotate on the right.
  They use the empty space beside the canvas, so they add no height and keep the tested tab order.
- The sticky preview sits flush under the header (no strip of form showing). It shrinks while you type an
  engraving and steps aside for the name and phone fields.
- Landscape phones: the header scrolls away and the nav sits inline (header 110 → 60 px). The hero is side by
  side, and the configurator's preview, toolbar and summary fit in a 375 px-high screen.
- The product page's add-to-cart button stays on screen on phones. The portrait hero is capped at 52svh.
- The filter-tab style was losing to older rules at every width (a gold block); fixed, and the row scrolls
  sideways on phones.
- Tap targets of 44 px (nav, theme toggle, cart quantities, toolbar on touch).
- Notch safe areas.
- Keyboard hints on form fields (`enterkeyhint`, `autocapitalize`, no autocorrect on the engraving).
- The checkout error scrolls into view.
- Hover zoom only on devices with hover, and no tap flash.
- Pixel ratio 1.5 on phones, no canvas resize on address-bar changes, and `--hh` recomputed on rotation.
- The cart stays two-column down to 760 px.

**Rejected or deferred**
- Render-on-demand for the 3D view (same reason as before).
- Real-device gesture testing: the touch handling follows the r128 OrbitControls source, but it still needs a
  check on a real iPhone and Android phone.

## Motion v2 « Le voile » (requested 2026-11-02): signed off by all four reviewers
The client rejected v1 « L'éclat » as not smooth or good enough in both themes. v2 is a redesign, built through
a review loop: capture → all agents review → CEO merges and fixes → recapture, 5 rounds (r0–r5), until the
Motion Director, Creative Director, Mobile Lead and QA all signed off.

**How it was checked.** A capture rig (Playwright for Python driving the installed Chrome) records real frames
of every motion moment in dark and light, on desktop (1440×900) and on a phone (390×844, CPU throttled 4×). It
logs frame timing with long-animation-frame attribution, then checks that nothing is left faded, running or
overflowing. It isn't in the repo (it lives in the session scratchpad).

**What a visitor sees**
- Theme: right from the first frame. It is applied in `<head>`, so light visitors never see a dark page.
- First visit: only the ground shows until the page can paint (fonts and the hero photo decoded, capped at 450 ms).
  Then the header fades in, the hero photo opens from the centre while the headline rises, and one soft light
  passes over the gold (overlay blend, so it lifts only the metal).
- Page changes: the old page fades out in 60 ms, then the text rises in and each photo opens from the centre at
  full colour. There is no whole-page fade (milky on cream) and no View Transition: taps are dropped during a
  View Transition, while this stays clickable throughout.
- Shop and filters: cards open from the centre in a short stagger, captions follow.
- Product: photo first, then title and price, then details and buy button.
- Add to cart: the button keeps its width, the label and the cart number cross-fade (never blank), and a 1 px
  gold line draws under « Panier ».
- Theme toggle: one 400 ms cross-fade of every surface at once (a View Transition).
- Sur mesure: the 2D preview fades out, then the 3D piece fades in (never two rings).
- Scroll: text rises 14 px, photos open from the centre.
- Reduced motion: no animation at all and nothing hidden (verified in both themes).

**Performance fix found by the rig.** Opening a product froze for about 400 ms because the full-size base64
photo was decoded synchronously. Photos are now turned into decoded blob URLs at idle after the first paint,
and that work is gone from page changes.

**Removed from v1.** The gold sweep on buttons, cards and the cart pill, the 1.3× badge pop, the logo wipe,
and the header hairline sweep.

**Still open.** None of these block, and all of them are load-side:
- the first-load blank (parse of the 1 MB file);
- 50–80 ms page-change frames on a throttled phone, from re-rendering with full-size photos;
- the fix for both is phone-sized photo files (`img/*.webp`), a pending owner decision.
- Not run here: `npm test` (no Node on this machine). Taps during page changes, reduced motion and every route
  were verified with Playwright for Python instead.

## Next actions (need the owner)
- Run `npm install && npm run test:install && npm test` on a machine with Node.
- Decide whether to move the seven photos to `img/*.webp` files.
- Review, then push the branch and merge it to `main` for GitHub Pages.
