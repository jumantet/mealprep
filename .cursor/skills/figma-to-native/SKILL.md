---
name: figma-to-native
description: >-
  Implement Figma mockups in this React Native app via the Figma MCP. Use when
  the user pastes a Figma URL, frame, or mockup, or asks to match a design.
---

# Figma → React Native

This app is mobile-only Expo. Implement screens in `src/containers/` with `StyleSheet` and `@theme` tokens.

## Workflow

1. Call the Figma MCP with the URL/node the user gave (`get_design_context` / screenshot). Do not guess the layout.
2. Extract color, type, spacing, radius. Update `src/theme` if the design introduces tokens; reuse existing ones when they match.
3. Build the screen in a container. Keep `app/` as a one-line re-export.
4. Assets: if the MCP returns a localhost source for an image or SVG, use that URL directly. Do not swap in a placeholder, Lucide/Expo icon, or invented graphic.
5. Fonts are Promo in `assets/fonts/`, mapped in `src/theme/fonts.ts`. Do not substitute Inter unless the files are Inter.

## Constraints

- No web-only CSS. No `div`/`span`. Use `View`/`Text`/`Pressable`/`FlatList`/`expo-image`.
- Match the mockup; do not "improve" spacing or type.
- If a screen folder already exists, implement there instead of creating a parallel tree.
