export const Fonts = {
  ultraLight: 'Promo-UltraLight',
  thin: 'Promo-Thin',
  extraLight: 'Promo-ExtraLight',
  light: 'Promo-Light',
  regular: 'Promo-Regular',
  normal: 'Promo-Normal',
  medium: 'Promo-Medium',
  semiBold: 'Promo-SemiBold',
  bold: 'Promo-Bold',
} as const;

/**
 * Runtime map for Expo Go (`useFonts`). Native builds also embed these via the
 * expo-font config plugin. Use `fontFamily: Fonts.regular` — do not combine
 * these family names with `fontWeight` or iOS will look up a different face.
 */
export const fontSources = {
  [Fonts.ultraLight]: require('../../assets/fonts/Promo-UltraLight.ttf'),
  [Fonts.thin]: require('../../assets/fonts/Promo-Thin.ttf'),
  [Fonts.extraLight]: require('../../assets/fonts/Promo-ExtraLight.ttf'),
  [Fonts.light]: require('../../assets/fonts/Promo-Light.ttf'),
  [Fonts.regular]: require('../../assets/fonts/Promo-Regular.ttf'),
  [Fonts.normal]: require('../../assets/fonts/Promo-Normal.ttf'),
  [Fonts.medium]: require('../../assets/fonts/Promo-Medium.ttf'),
  [Fonts.semiBold]: require('../../assets/fonts/Promo-SemiBold.ttf'),
  [Fonts.bold]: require('../../assets/fonts/Promo-Bold.ttf'),
} as const;
