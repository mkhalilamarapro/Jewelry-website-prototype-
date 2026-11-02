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
- `const P=[...]` → products. Photos are base64 in `<script type="application/json" id="im">`. Five were
  generated with Higgsfield (rings, rose, pearls, pot, hoops); `bust` and `bangles` are Pexels stock photos.
- `const FB=` → Facebook page link.

## Tests (Playwright – Chromium, Firefox, WebKit)
```
npm install
npm run test:install     # downloads the three browsers
npm test                 # runs tests/form.spec.js in all three
```
Covers: empty submit, whitespace-only input, invalid phone (the form has no email field),
valid submit, double submit, 10k-character input in every field, and keyboard-only completion.
Status when last run (2026-11-03): **Chromium 16/16 passing** (with the installed Chrome:
`CHROMIUM_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe" npx playwright test --project=chromium`).
Firefox and WebKit were not run.

## Limits on GitHub Pages
Custom-piece requests are not saved there (admin dashboard exists only on the Claude-hosted demo);
the customer gets a WhatsApp button instead. Prices, specs and photos are placeholders.
