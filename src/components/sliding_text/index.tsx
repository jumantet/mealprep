import { useEffect } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Fonts, Text as TextTokens } from '@theme';

const SLIDE_MS = 2200;

const PRICE_GRADIENT = `linear-gradient(to right, ${Colors.Labels.vibrantPrimary} 0%, ${Colors.Accents.green} 50%, ${Colors.Labels.vibrantPrimary} 100%)`;

type SlidingTextProps = {
  amount: number;
  prefix?: string;
};

const SlidingText = ({ amount, prefix = '€' }: SlidingTextProps) => {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const label = `${prefix}${amount}`;

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(progress);
      progress.set(0);
      return;
    }

    progress.set(0);
    progress.set(
      withRepeat(withTiming(1, { duration: SLIDE_MS, easing: Easing.linear }), -1, false)
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [progress, reducedMotion]);

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${-50 + 50 * progress.get()}%` }],
  }));

  return (
    <View style={styles.viewport}>
      <View>
        <Text style={[styles.price, styles.sizer]}>{label}</Text>
        <MaskedView
          style={styles.overlay}
          maskElement={
            <View style={styles.mask}>
              <Text style={styles.price}>{label}</Text>
            </View>
          }
        >
          <Animated.View style={[styles.fill, fillStyle]}>
            <View
              style={[
                styles.gradient,
                { experimental_backgroundImage: PRICE_GRADIENT } as ViewStyle,
              ]}
            />
          </Animated.View>
        </MaskedView>
      </View>
    </View>
  );
};

export default SlidingText;

const styles = StyleSheet.create({
  viewport: {
    height: TextTokens.Sizes.display,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mask: {
    backgroundColor: 'transparent',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  fill: {
    width: '200%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  price: {
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.display,
    lineHeight: TextTokens.Sizes.display,
    color: Colors.Labels.primary,
    includeFontPadding: false,
  },
  sizer: {
    opacity: 0,
  },
});
