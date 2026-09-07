import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Colors, Radius } from '@theme';

const pulse = {
  from: { opacity: 0.45 },
  to: { opacity: 1 },
};

const pulseMotion = {
  animationName: pulse,
  animationDuration: 900,
  animationDirection: 'alternate',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
} as const;

type SkeletonBoneProps = {
  style?: ViewStyle | ViewStyle[];
};

const SkeletonBone = ({ style }: SkeletonBoneProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View
      style={[
        styles.bone,
        style,
        reducedMotion ? styles.static : pulseMotion,
      ]}
    />
  );
};

export default SkeletonBone;

const styles = StyleSheet.create({
  bone: {
    backgroundColor: Colors.Backgrounds.secondary,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
  },
  static: {
    opacity: 0.7,
  },
});
