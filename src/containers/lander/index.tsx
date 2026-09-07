import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import Button from '@components/button';
import ScreenWrapper from '@components/screen_wrapper';
import { Colors, Fonts, Spacings, Text as TextTokens } from '@theme';

import Hero from './components/hero';

const LanderScreen = () => {
  return (
    <ScreenWrapper style={styles.screen} safeAreaEdges={['top', 'bottom']}>
      <View style={styles.body}>
        <Text style={styles.title}>MealPrep</Text>
        <Hero />
        <View style={styles.cta}>
          <Button
            title="Create your meal plan"
            onPress={() => router.push('/budget-selection')}
            style={styles.button}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LanderScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.Backgrounds.screen,
  },
  body: {
    flex: 1,
    overflow: 'visible',
  },
  title: {
    marginTop: Spacings['2xl'],
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.h1,
    lineHeight: 67,
    color: TextTokens.Colors.primary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  button: {
    height: 72,
  },
  cta: {
    paddingHorizontal: Spacings['2xl'],
    paddingBottom: Spacings['3xl'],
  },
});
