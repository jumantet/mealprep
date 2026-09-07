import { StyleSheet, Text } from 'react-native';

import ScreenWrapper from '@components/screen_wrapper';
import { Colors, Fonts, Text as TextTokens } from '@theme';

const HomeScreen = () => {
  return (
    <ScreenWrapper style={styles.screen} safeAreaEdges={['top']}>
      <Text style={styles.title}>Hello World</Text>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.Backgrounds.screen,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.h1,
    color: TextTokens.Colors.primary,
  },
});
