import { StyleSheet, View } from 'react-native';

import { Colors, Radius, Spacings } from '@theme';

type LoadingBarProps = {
  step: number;
  steps: number;
};

const LOADING_BAR_HEIGHT = 20;
const HIGHLIGHT_HEIGHT = 6;

const LoadingBar = ({ step, steps }: LoadingBarProps) => {
  const progress = Math.min(Math.max(step / steps, 0), 1);

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress * 100}%` }]}>
        <View style={styles.highlight} />
      </View>
    </View>
  );
};

export default LoadingBar;

const styles = StyleSheet.create({
  track: {
    height: LOADING_BAR_HEIGHT,
    overflow: 'hidden',
    borderRadius: Radius.full,
    backgroundColor: Colors.Backgrounds.secondary,
  },
  fill: {
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    paddingTop: Spacings.xs,
    paddingHorizontal: Spacings.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.Accents.green,
  },
  highlight: {
    height: HIGHLIGHT_HEIGHT,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});
