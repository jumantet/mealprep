import { ScrollView, StyleSheet, View } from 'react-native';

import Button from '@components/button';
import Multiselect from '@components/multiselect';
import { useStepper } from '@context/stepper.context';
import { NUTRITIONAL_GOAL_OPTIONS } from '@data/nutritional_goals';
import { Spacings } from '@theme';

const NUTRITIONAL_OPTIONS = NUTRITIONAL_GOAL_OPTIONS.map(({ id, label, emoji }) => ({
  value: id,
  label,
  emoji,
}));

const NutritionalGoalsSelectionScreen = () => {
  const { nutritionalGoals, setNutritionalGoals } = useStepper();

  return (
    <View style={styles.body}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        <Multiselect
          options={NUTRITIONAL_OPTIONS}
          value={nutritionalGoals}
          onChange={setNutritionalGoals}
          exclusiveValues={['none']}
        />
      </ScrollView>
      <View style={styles.cta}>
        <Button
          title="Continue"
          disabled={nutritionalGoals.length === 0}
          style={styles.button}
        />
      </View>
    </View>
  );
};

export default NutritionalGoalsSelectionScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  grid: {
    flexGrow: 1,
    justifyContent: 'center',
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
