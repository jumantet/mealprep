import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, { useReducedMotion } from 'react-native-reanimated';

const BAG_SIZE = 200;
const EMOJI_FONT = 40;
const EMOJI_BOX = 56;
const EDGE_INSET = 8;
const ORBIT_MS = 24000;

const shoppingBag = require('../../../../assets/images/lander/shopping_bag.png');

/** Offsets from the bag's top-left, used only to derive orbit angles. */
const EMOJIS = [
  { glyph: '🍎', x: -25, y: -40 },
  { glyph: '🥩', x: 141, y: -57 },
  { glyph: '🥕', x: 219, y: 47 },
  { glyph: '🫒', x: 211, y: 198 },
  { glyph: '🍆', x: 101, y: 255 },
  { glyph: '🌽', x: -20, y: 218 },
  { glyph: '🧀', x: -68, y: 80 },
] as const;

const BAG_CENTER = BAG_SIZE / 2;
const FIGMA_EMOJI_CENTER = 20;

const ORBIT_ANGLES = EMOJIS.map(item =>
  Math.atan2(
    item.y + FIGMA_EMOJI_CENTER - BAG_CENTER,
    item.x + FIGMA_EMOJI_CENTER - BAG_CENTER
  )
);

const spin = {
  from: { transform: [{ rotate: '0deg' }] },
  to: { transform: [{ rotate: '360deg' }] },
};

const unspin = {
  from: { transform: [{ rotate: '0deg' }] },
  to: { transform: [{ rotate: '-360deg' }] },
};

const loop = {
  animationDuration: ORBIT_MS,
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
  transformOrigin: '50% 50%',
} as const;

const Hero = () => {
  const reducedMotion = useReducedMotion();
  const [slot, setSlot] = useState({ width: 0, height: 0 });

  const onSlotLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSlot(current =>
      current.width === width && current.height === height
        ? current
        : { width, height }
    );
  };

  const size = Math.min(slot.width, slot.height);
  const radius = Math.max(0, size / 2 - EMOJI_BOX / 2 - EDGE_INSET);
  const center = size / 2;
  const bagOffset = (size - BAG_SIZE) / 2;
  const orbitMotion = reducedMotion ? null : { animationName: spin, ...loop };
  const emojiMotion = reducedMotion ? null : { animationName: unspin, ...loop };

  return (
    <View style={styles.slot} onLayout={onSlotLayout}>
      {size > 0 ? (
        <View style={[styles.cluster, { width: size, height: size }]}>
          <Image
            source={shoppingBag}
            accessibilityLabel="Shopping bag"
            contentFit="contain"
            style={[styles.bagImage, { left: bagOffset, top: bagOffset }]}
          />
          <Animated.View style={[styles.orbit, { width: size, height: size }, orbitMotion]}>
            {EMOJIS.map((item, index) => {
              const angle = ORBIT_ANGLES[index];
              return (
                <Animated.View
                  key={item.glyph}
                  style={[
                    styles.emojiSlot,
                    {
                      left: center + radius * Math.cos(angle) - EMOJI_BOX / 2,
                      top: center + radius * Math.sin(angle) - EMOJI_BOX / 2,
                    },
                    emojiMotion,
                  ]}
                >
                  <Text style={styles.emoji}>{item.glyph}</Text>
                </Animated.View>
              );
            })}
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
};

export default Hero;

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  cluster: {
    overflow: 'visible',
  },
  bagImage: {
    position: 'absolute',
    width: BAG_SIZE,
    height: BAG_SIZE,
  },
  orbit: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'visible',
  },
  emojiSlot: {
    position: 'absolute',
    width: EMOJI_BOX,
    height: EMOJI_BOX,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  emoji: {
    fontSize: EMOJI_FONT,
    lineHeight: EMOJI_BOX,
    includeFontPadding: false,
  },
});
