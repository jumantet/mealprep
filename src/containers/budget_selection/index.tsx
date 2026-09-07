import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import Button from '@components/button';
import Slider from '@components/slider';
import SlidingText from '@components/sliding_text';
import { useStepper } from '@context/stepper.context';
import { Fonts, Spacings, Text as TextTokens } from '@theme';

const MIN_BUDGET = 25;
const MAX_BUDGET = 150;
const BUDGET_STEP = 1;

const BudgetSelectionScreen = () => {
  const { budget, setBudget } = useStepper();

  return (
    <View style={styles.body}>
      <View style={styles.amountBlock}>
        <SlidingText amount={budget} />
        <Text style={styles.period}>per week</Text>
        <View style={styles.slider}>
          <Slider
            min={MIN_BUDGET}
            max={MAX_BUDGET}
            step={BUDGET_STEP}
            value={budget}
            onValueChange={setBudget}
          />
        </View>
      </View>
      <View style={styles.cta}>
        <Button
          title="Continue"
          style={styles.button}
          onPress={() => router.push('/dietary-needs-selection')}
        />
      </View>
    </View>
  );
};

export default BudgetSelectionScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  amountBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacings.sm,
  },
  period: {
    fontFamily: Fonts.medium,
    fontSize: TextTokens.Sizes.h5,
    color: TextTokens.Colors.secondary,
    includeFontPadding: false,
  },
  slider: {
    alignSelf: 'stretch',
    marginTop: Spacings['3xl'],
    paddingHorizontal: Spacings['2xl'],
  },
  cta: {
    paddingHorizontal: Spacings['2xl'],
    paddingBottom: Spacings['3xl'],
  },
  button: {
    height: 72,
  },
});
