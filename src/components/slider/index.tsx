import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Colors, Radius } from '@theme';

const THUMB_SIZE = 32;
const TRACK_HEIGHT = 6;
const HIT_HEIGHT = 44;

type SliderProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
};

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(max, Math.max(min, value));
};

const Slider = ({ min, max, step = 1, value, onValueChange }: SliderProps) => {
  const maxX = useSharedValue(0);
  const translateX = useSharedValue(0);
  const amount = useSharedValue(value);

  const valueFromX = (x: number) => {
    'worklet';
    const span = maxX.get();
    if (span <= 0) {
      return min;
    }
    const raw = min + (x / span) * (max - min);
    const snapped = Math.round(raw / step) * step;
    return clamp(snapped, min, max);
  };

  const xFromValue = (next: number) => {
    'worklet';
    const span = maxX.get();
    if (span <= 0) {
      return 0;
    }
    return ((next - min) / (max - min)) * span;
  };

  const applyX = (x: number, settle: boolean) => {
    'worklet';
    const next = valueFromX(x);
    amount.set(next);
    const snappedX = xFromValue(next);
    translateX.set(settle ? withSpring(snappedX, { duration: 400, dampingRatio: 1 }) : x);
  };

  useAnimatedReaction(
    () => amount.get(),
    (current, previous) => {
      if (previous == null || current === previous) {
        return;
      }
      scheduleOnRN(onValueChange, current);
    }
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(event => {
          applyX(clamp(event.x - THUMB_SIZE / 2, 0, maxX.get()), false);
        })
        .onUpdate(event => {
          applyX(clamp(event.x - THUMB_SIZE / 2, 0, maxX.get()), false);
        })
        .onEnd(event => {
          applyX(clamp(event.x - THUMB_SIZE / 2, 0, maxX.get()), true);
        }),
    [max, min, step]
  );

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.get() }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View
        accessibilityRole="adjustable"
        accessibilityLabel="Weekly budget"
        accessibilityValue={{ min, max, now: value }}
        style={styles.hit}
        onLayout={event => {
          const span = Math.max(event.nativeEvent.layout.width - THUMB_SIZE, 0);
          maxX.set(span);
          const current = amount.get();
          translateX.set(((current - min) / (max - min)) * span);
        }}
      >
        <View style={styles.track} />
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </View>
    </GestureDetector>
  );
};

export default Slider;

const styles = StyleSheet.create({
  hit: {
    height: HIT_HEIGHT,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: Radius.full,
    backgroundColor: Colors.Backgrounds.secondary,
  },
  thumb: {
    position: 'absolute',
    top: (HIT_HEIGHT - THUMB_SIZE) / 2,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.Backgrounds.primary,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.16)',
  },
});
