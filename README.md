# mealprep

Mobile Expo SDK 57 app (iOS / Android). No web.

## Setup

Node 22 (`nvm use` — see `.nvmrc`).

```bash
npm install
npm start
```

Then press `i` for the iOS simulator. The App Store Expo Go build may still be on an older SDK; prefer the simulator.

## Structure

- `app/` — Expo Router routes
- `src/containers/` — screens
- `src/components/` — shared UI
- `src/data/product_catalog_en.json` — product catalog
- `assets/fonts/` — Promo typeface (`.ttf` files are loaded by the app)

Figma MCP: enable the **figma** server in Cursor Settings → MCP, then connect.
