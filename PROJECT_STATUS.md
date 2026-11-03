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
| AI Product Photographer | Art direction, prompts and quality control for generated product photos | Audit only |

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

## Loader, boutique icons, AI photos, price on the photo (requested 2026-11-03): signed off
Reviewed in 3 capture rounds (r6–r8). Signed off by the Creative Director, the Motion Director, the AI Product
Photographer and QA/Mobile.

**New team member: AI Product Photographer.** Generated jewellery only looks right when every image is
art-directed and checked (warped rings, duplicated stones, mismatched light).

**What's in**
- **Loader « le sceau »** (first visit, home only):
  - The ring emblem and the name start pale and blurred, then fill with gold from the bottom and come into focus.
    After that the seal fades and the page opens on bare ground.
  - It paints at about 0.3 s on desktop and 0.45 s on a throttled phone, because the first page build is deferred
    by one frame.
  - Only transform and opacity move.
  - It stays at least 1.6 s (fill 1.6 s, then the finished seal holds about 0.7 s), lengthened at the client's
    request on 2026-11-03. The page opens at about 2.5 s on a first visit.
  - It never catches a tap, and it doesn't show on deep links (so the tests' `#custom` path is unchanged).
  - Reduced motion shows no loader. If JS fails, CSS lets go at 3.2 s.
- **Product photos:**
  - 5 photos were generated with Higgsfield (Nano Banana via kie.ai, about 20 credits) in one house style: taupe
    limestone, window light, empty lower third. The 5 are rings, the rose ring, pearls, the ras-du-cou collar and
    the hoops.
  - `bust` (the home hero) and `bangles` were kept.
  - Retouched locally: the rose ring was graded to rose gold, and the right hoop's white stripe was recoloured
    to gold.
  - The hoops are a placeholder: the pair still doesn't match exactly. Swap it for a real photo when one exists.
- **Photo data** now lives in `<script type="application/json" id="im">`, not in the main script. The file is
  about 500 KB, down from 934 KB.
- **Cards:**
  - The price sits on the photo as a frosted chip (backdrop blur, with a solid fallback), with only the name
    underneath.
  - Each card link is labelled "name, price" for screen readers.
- **Shop:**
  - A trust row with line icons, using only claims already on the site: pieces, "Or, perles et pierres",
    "Sur mesure", "Commande confirmée par WhatsApp".
  - A WhatsApp glyph on the 3 WhatsApp buttons.
  - New rhythm: title to tabs 32/20 px, tabs to grid 40/24, photo to name 12/10, rows 32/24, gutter 20/12
    (desktop/phone). The filtered `.few` grid keeps the card size.
- **Tests:**
  - The suite now runs locally (Node is installed): 16/16 pass in Chromium, using the installed Chrome via
    `CHROMIUM_PATH`.
  - The tab-order test was updated: it now stops its expected list at the submit button. The footer links added
    on 2026-11-02 made it fail on the previous commit too.
  - Firefox and WebKit were not run: the browser download didn't finish.
- **Credits:** about 1.2 left on kie.ai, so a re-roll needs a top-up.

## Device theme, light hero, GSAP 3 « le fil d'or » (requested 2026-11-03): signed off
Reviewed in 2 capture rounds (r11–r12). Signed off by the Motion Director, the Creative Director and QA/Mobile.
Each of their conditions was checked by measurement.

**Theme follows the device**
- The site opens in the phone's or computer's light/dark setting from the first frame, including the status-bar
  colour, and switches live if the device switches.
- The ◐ toggle now lasts for the visit only (`sessionStorage`). The old saved choice in `localStorage` is
  cleared, so it can't override the device any more.

**Light-mode hero**
- No black photo in light mode. The hero and the « Colliers » tile show the generated collar-on-bust photo
  (`herol`), with its stone regraded to the site's cream. Dark mode keeps the black `bust` photo.
- Photos marked `img[data-k]` swap with the theme and wait for their decode (capped at 200 ms), so a switch
  never shows a blank frame.
- The overlay light pass is off in light mode.

**GSAP 3.13 « le fil d'or »**
- Loaded from jsDelivr, pinned to 3.13.0: gsap, ScrollTrigger and SplitText. It's a progressive enhancement:
  - the site is complete without it (CDN blocked: identical to before, no errors);
  - reduced motion never downloads it;
  - the tests block it, so runs don't depend on the network.
- What it does:
  - Headings rise line by line from a hairline mask: the hero title (two static masked lines, nothing to split),
    section titles on scroll, and the product title.
  - A subtle desktop-only hero parallax, for fine pointers at 821 px and up.
  - Photos keep « le voile ».
- Performance: an A/B on a 4× throttled phone shows 0 long frames on route changes, the same as with GSAP
  blocked. Three things got it there:
  - scroll titles are set up 450 ms after a route change;
  - the cleanup doesn't revert a DOM that is about to be replaced;
  - setup runs once per page.
- Checked:
  - Splits revert after playing, with no layout jump.
  - Resizing doesn't replay a title.
  - GSAP arriving 3 s late hides nothing already seen.
  - 320, 390, 820 px, 844×390 landscape and 1440 px: no overflow, no leftovers.
- Tests: 16/16 in Chromium.

**Known, not blocking**
- The intro still ends at about 2.5 s on a first visit. That is the longer loader the client asked for.
- One 8 ms frame of fallback italic when you first land on home from another page (the italic font loads on
  first use). This predates GSAP.

## 3D cover « le relief » (requested 2026-11-03): built, reviewed
The client asked for "3D mock-ups with smooth animation, no static background" in the cover.

**Reviews:**
- The Motion Director and the 3D Art Director approved the design. Their last conditions were met: the build is
  now sliced, and the cream look was fixed.
- QA/Mobile approved once the context-loss fix landed. It is in.
- iOS Safari still needs a check on a real device.

**What a visitor sees:**
- Three pieces of one parure float on the page's own ground: a solitaire ring, a pavé créole and a sapphire
  pendant. The canvas is transparent, so they sit on cream in light mode and on black in dark mode.
- They are built live with the configurator's own 3D engine.
- Lighting is tuned per theme: on cream, a warm ivory studio with a white diamond, soft gold and one tight
  contact shadow; on black, rim lights so the gold glows.
- Motion: a slow float and sway per piece. On desktop with a mouse, a damped tilt toward the cursor. A drift as
  the hero scrolls away. After the loader, the pieces rise into place together with the masked title.

**Fallback:** the photo stays underneath as the fallback. It is used when:
- reduced motion is on;
- Save-Data is on;
- there is no WebGL or only a software GPU;
- the CDN fails;
- frames are too slow (the 3D fades back to the photo for the rest of the visit).

**Performance:**
- Three.js loads behind the loader on a first visit, otherwise at idle after load.
- The build runs in idle slices: first lights, then each piece, then one shader per slice.
- One slice remains at about 370 ms on desktop: a single shader compile that the graphics driver can't split.
  It runs once per visit, while the page stays scrollable.
- The page renders only while the hero is visible and the tab is open, at half rate on phones.
- Leaving home disposes the scene (at once when going to the configurator). Two WebGL contexts at most.
- Measured: 7 ms frames idle and while scrolling, on desktop and on a 4× CPU phone (real GPU). Tests: 16/16.

## Lower home redesign and « Pièces phares » (requested 2026-11-04): built, reviewed
These are the client's complaints and what was done about each.

**Text in the cover shifts between dark and light mode.**
- Fixed: the cover photo box now has its own size. The photos and the 3D canvas no longer set it, so the text sits identically in both themes.

**Bugs in « Une pièce qui vous ressemble » and « Notre engagement »; everything below looks unprofessional.**
- On desktop, the titles « Notre engagement » and « Parlons de votre projet » never appeared. GSAP's ScrollTrigger computed its positions before the page had finished growing. Titles now reveal through an IntersectionObserver, which always matches the real layout.
- « Une pièce qui vous ressemble »: a fixed 5:4 crop that keeps the solitaire whole, hairline framing, and numbered steps (01 Gravure, 02 Taille, 03 Finition).
- « Notre engagement »: the title gets its own row, followed by four numbered columns separated by hairlines (2×2 on tablet, a list on phone).
- Contact block: it now sits on the page ground, aligned to the centre, with no stray line.
- Footer:
  - the wordmark is set like the header logo, instead of a giant title;
  - the legal line sits under its own hairline;
  - « photos et prix indicatifs » stays until go-live.

**Cover images as 3D; the client's first image without its background.**
- Recommendation, from NN/g research on auto-rotating hero carousels and current luxury sites: one cover, followed by a curated selection. So the 3D parure stays as the only cover, and « Pièces phares » replaces « Coups de cœur ».
- The lead piece of « Pièces phares » is the client's medallion necklace and bangles from the first photo. Its background was removed locally with rembg (isnet), and the mirror reflections were trimmed off.
- The three featured pieces are cut out the same way. One bust's neck was refilled from the original photo.
- The 3D effect is done in CSS: a tilt toward the pointer (≤6°, mouse only), a slow float on the compositor that pauses off-screen, a drop shadow and a ground pool. It is static under reduced motion.
- « Pièces phares » rather than « Meilleures ventes », because there is no sales data to back the claim.

**Checks:** tests 16/16, no overflow at 320/390/820/1440 px, reduced motion clean, cover still at 7 ms frames. The Creative Director signed off on all of it except the « Pièces phares » and story fixes; those were applied afterwards and checked in screenshots by the CEO.

**Needs the owner:** confirm the lead piece's name, « Collier médaillon et joncs ».

## Next actions (need the owner)
- Run `npm install && npm run test:install && npm test` on a machine with Node.
- Decide whether to move the seven photos to `img/*.webp` files.
- Review, then push the branch and merge it to `main` for GitHub Pages.
