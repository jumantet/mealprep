import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius, Spacings, Text as TextTokens } from '@theme';

type PreparingOverlayProps = {
  visible: boolean;
  error: string | null;
  onRetry: () => void;
};

const PreparingOverlay = ({ visible, error, onRetry }: PreparingOverlayProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} accessibilityViewIsModal pointerEvents="auto">
      <View style={styles.scrim} />
      {error ? (
        <View style={styles.card}>
          <Text style={styles.title}>We couldn’t prepare your meal plan</Text>
          <Text style={styles.body}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
          >
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <ActivityIndicator color={Colors.Accents.green} size="large" />
          <Text style={styles.title}>We are preparing the meal plan for you</Text>
        </View>
      )}
    </View>
  );
};

export default PreparingOverlay;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacings['4xl'],
  },
  scrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.Accents.green,
    opacity: 0.55,
  },
  card: {
    alignItems: 'center',
    gap: Spacings['2xl'],
    maxWidth: 280,
    paddingHorizontal: Spacings['3xl'],
    paddingVertical: Spacings['3xl'],
    borderRadius: Radius.lg,
    borderCurve: 'continuous',
    backgroundColor: Colors.Backgrounds.primary,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.h5,
    lineHeight: TextTokens.Sizes.h5 + 8,
    color: TextTokens.Colors.primary,
    textAlign: 'center',
  },
  body: {
    fontFamily: Fonts.medium,
    fontSize: TextTokens.Sizes.p1,
    color: TextTokens.Colors.secondary,
    textAlign: 'center',
  },
  retry: {
    marginTop: Spacings.sm,
    paddingHorizontal: Spacings['4xl'],
    paddingVertical: Spacings.lg,
    borderRadius: Radius.full,
    backgroundColor: Colors.Accents.green,
  },
  retryLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.h5,
    color: TextTokens.Colors.onAccent,
  },
  pressed: {
    opacity: 0.7,
  },
});
