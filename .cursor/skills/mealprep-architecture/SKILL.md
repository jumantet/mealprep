---
name: mealprep-architecture
description: >-
  Mealprep app architecture based on regroop/hub. Use when adding screens,
  components, routes, theme tokens, product data, or organizing folders in this
  Expo React Native app.
---

# Mealprep architecture

Same layout as hub, stripped down: Expo Router + TypeScript, mobile only, local JSON instead of an API.

## Folders

```
app/                    # routes only — import a container, render it
src/containers/         # screens (`home`, …)
src/components/         # shared UI (`screen_wrapper`, …)
src/hooks/              # `useProducts`, later screen hooks
src/services/           # read JSON (`products.ts`)
src/data/               # `product_catalog_en.json`
src/theme/              # Colors, Spacings, Radius, Text, Fonts
src/types/              # `product.ts`
assets/fonts/           # Promo `.ttf` files (ignore woff/eot/css in RN)
```

- Folder names: `snake_case`. Route segments: kebab-case (`product/[id]`).
- New screen = container in `src/containers/<name>/index.tsx` + thin file in `app/`.
- Screen-specific UI goes in `src/containers/<name>/components/`.

## Aliases

`@components/*` `@containers/*` `@hooks/*` `@services/*` `@theme` `@data/*` `@utils/*` `types/*`

Do not use `@/` from the Expo template.

## Patterns

- `StyleSheet.create` + tokens from `@theme`. No NativeWind, no CSS modules, no `Platform.OS === 'web'`.
- `expo-image` for images. `ScreenWrapper` for safe area. `fontFamily: Fonts.regular` (do not pair Promo family names with `fontWeight`).
- Import `router` from `expo-router`, not `useRouter`.
- Products: `src/data/product_catalog_en.json` → `src/services/products.ts` → `useProducts` / `useProduct`. Adapt the `Product` type if the JSON schema changes; do not add a network client.
- Fonts: `.ttf` files in `assets/fonts/`, listed in the `expo-font` plugin in `app.json`, loaded with `useFonts(fontSources)` in `app/_layout.tsx`, names in `src/theme/fonts.ts`.

## Figma

If a Figma URL is provided, follow the `figma-to-native` skill and the Figma MCP before inventing layout.
