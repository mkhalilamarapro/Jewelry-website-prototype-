# Bijouterie Zied & Nihel Zayeti – demo site

Single-file jewelry store (French): home, shop, product pages, cart, WhatsApp checkout,
and a "Sur mesure" custom-piece form with a live 3D preview (Three.js, loaded from a CDN).
Each piece has its own models and filters (bague: alliance/solitaire/trilogie; bracelet: jonc,
manchette, gourmette, tennis; boucles: clous, créoles, pendantes; collier: pendentif, médaillon,
prénom, chaîne seule on a display bust so the length shows). Filters that do not apply to the
chosen model are hidden, and the engraving is drawn on the piece.

## Deploy on GitHub Pages
1. Push this folder to a repository (`index.html` at the root).
2. Settings → Pages → "Deploy from a branch" → `main` / `/ (root)`.

## What to edit (all inside `index.html`)
- `const WA="21600000000"` → the shop's WhatsApp number (country code, no `+`).
- `const P=[...]` → products. `const IM={...}` → photos as base64 (current ones are Pexels stock photos).
- `const FB=` → Facebook page link.

## Tests (Playwright – Chromium, Firefox, WebKit)
```
npm install
npm run test:install     # downloads the three browsers
npm test                 # runs tests/form.spec.js in all three
```
Covers: empty submit, whitespace-only input, invalid phone (the form has no email field),
valid submit, double submit, 10k-character input in every field, and keyboard-only completion.
Status when last run: **Chromium 16/16 passing. Firefox and WebKit were not run** (browsers
could not be downloaded in the environment where the tests were written) – run them locally.

## Espace boutique (admin)
Owners manage the shop at `#admin`. There are three tabs:
- **Commandes:** cart orders and custom requests, a WhatsApp reply, and statuses.
- **Pièces:** add, edit, sold, coup de cœur, photo, hide.
- **Boutique:** WhatsApp number, Facebook page, announcement bar, exports.

Every change goes to the site's shared database and shows live for visitors. The spec is in `ADMIN_V0.md`.

It needs the site to be published as a Claude artifact with these capabilities:
```json
{"user":{},"assets":{},"downloads":true,"db":{"rules":[
  {"path":"","read":"view","write":"admin"},
  {"path":"requests","read":"admin","write":"admin"},
  {"path":"requests/{self}","read":"interact","write":"interact"},
  {"path":"status","read":"admin","write":"admin"}]}}
```
- Owners must be the artifact's owner or members invited as Editor. Editors invited by email from outside
  the organisation lose that right while the artifact is also shared by public link.
- The first time, open Pièces and press "Activer le catalogue modifiable". This copies the 7 built-in pieces
  into the database.
- Signed-out visitors and outside visitors can't write, so their orders and requests go to WhatsApp only.

## Limits on GitHub Pages
There's no runtime there: the site shows the built-in catalogue, and orders and requests go to WhatsApp only.
To bring the GitHub copy up to date, use "Exporter le catalogue" in the admin and paste the result into `P`.
Prices, specs and photos are placeholders.
