# Espace boutique: admin V0

This spec merges three proposals: the Creative Director's (UX and French copy), the Mobile & Responsive Lead's
(phone use) and the QA & Front-end Engineer's (data, rules, sync, security). The CEO decided where they
differed, as noted below.

## Who it is for
The two owners. They work in French, often on a phone, between customers. The admin is a back room inside
the shop: same colors, typefaces and theme toggle as the storefront. It is not a generic dashboard.

## How it links to the website
- The site is published as a Claude artifact with a shared database (the capabilities are below). Owners (the
  artifact owner, or members invited as Editor) open `#admin`.
- Everything they change (pieces, prices, sold out, coups de cœur, photos, WhatsApp number, announcement)
  is written to the database. The storefront subscribes to the same data, so every visitor sees the change
  immediately.
- Cart orders and custom-piece requests are saved to the database, then opened in WhatsApp as before.
- If the runtime is missing (GitHub Pages copy, signed-out visitor), the storefront shows its built-in
  catalogue. "Exporter le catalogue" in the admin produces the JSON to bake into the file when you republish.

## Structure: 3 tabs
A bottom tab bar on phones; tabs at the top on desktop. There's also a "Voir le site ↗" link.
1. **Commandes** (with a badge for new ones). Cart orders and custom requests share one list.
   - Filter chips: Nouvelles · En cours · Terminées · Toutes.
   - Each card: type, name, phone, relative time, summary, city.
   - Buttons: "Répondre sur WhatsApp" (prefilled message; moves the order to "En cours"), "Appeler", and
     the status steps Nouveau → En cours → Terminé.
2. **Pièces**
   - Search, category chips, a "Masquées" chip, and "+ Ajouter une pièce".
   - Each row has two switches, "Vendu" and "★ Coup de cœur" (3 at most, the home grid's size), each with
     a 6 s "Annuler" toast.
3. **Boutique**: the WhatsApp number, Facebook page, and announcement bar (with an on/off switch).
   - Also: "Télécharger les commandes", "Exporter le catalogue", and a one-time "Importer le catalogue de
     base" that moves the 7 built-in pieces into the database.

**Fiche pièce** (add or edit):
- A live preview card that looks exactly like the shop's.
- Photo: camera or gallery, compressed on the phone. Tap the photo to set the crop.
- Required: photo, Nom, Prix, Catégorie. Under "Plus de détails": description, up to 3 key points, size set.
- A sticky "Enregistrer" bar. "Retirer du site" hides the piece; it never deletes.

## Data (QA design, adopted)
| Path | Written by | Contents |
|---|---|---|
| `shop/settings` | owners | `catalog:"builtin"\|"db"`, `wa`, `fb`, `ann`, `annOn`, `at` |
| `catalog/<id>` | owners | `n c p d sp s k? img? o so ft hid rank at` (one doc per piece, so two owners don't collide) |
| `requests/<uid>` | the customer | `items:[{id:"r<ms>", kind:"custom"\|"order", ts, name, phone, det \| lines, total, city}]` |
| `status/<uid>` | owners | `s:{<itemId>:{v, at}}` (kept apart from customers' docs, so status changes never overwrite a new request) |

Capabilities to declare when publishing:
```json
{"user":{},"assets":{},"downloads":true,"db":{"rules":[
  {"path":"","read":"view","write":"admin"},
  {"path":"requests","read":"admin","write":"admin"},
  {"path":"requests/{self}","read":"interact","write":"interact"},
  {"path":"status","read":"admin","write":"admin"}]}}
```

## Security
- Every value an owner or customer types is escaped before it is shown.
- The announcement is set as plain text.
- Links are checked: WhatsApp takes digits only; Facebook must be an https Facebook domain.
- A photo id must be 32 hex characters and is only ever used as an image.
- Malformed requests are skipped, so they can't take down the inbox.
- Hiding the admin in the page is cosmetic: the database rules are what enforce access.

## CEO decisions where the specs differed
- Names and statuses: the Creative Director's ("Pièces", "Boutique", Nouveau → En cours → Terminé). Sizes,
  inputs, photo compression and the tab bar: the Mobile Lead's.
- Status changes: the three-step control rather than a `<select>`. It's one tap and every step is visible.

## Not in V0
- Stock quantities: the pieces are unique, so "Vendu" covers it.
- Several photos per piece.
- Editing categories or the configurator options.
- Hard delete.
- Online payment and customer accounts.
- Statistics.
- Push notifications.
- An offline photo queue.
- Drag-to-reorder: new pieces go first.
- The concurrent-edit prompt: last save wins.
