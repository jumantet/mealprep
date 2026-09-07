import { ScrollView, StyleSheet, View } from 'react-native';

import Button from '@components/button';
import Multiselect from '@components/multiselect';
import { useStepper } from '@context/stepper.context';
import { DIETARY_NEED_OPTIONS } from '@data/dietary_needs';
import { Spacings } from '@theme';

const DIETARY_OPTIONS = DIETARY_NEED_OPTIONS.map(({ id, label, emoji }) => ({
  value: id,
  label,
  emoji,
}));

const DietaryNeedsSelectionScreen = () => {
  const { dietaryNeeds, setDietaryNeeds } = useStepper();

  return (
    <View style={styles.body}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        <Multiselect
          options={DIETARY_OPTIONS}
          value={dietaryNeeds}
          onChange={setDietaryNeeds}
          exclusiveValues={['none']}
        />
      </ScrollView>
      <View style={styles.cta}>
        <Button
          title="Continue"
          disabled={dietaryNeeds.length === 0}
          style={styles.button}
        />
      </View>
    </View>
  );
};

export default DietaryNeedsSelectionScreen;

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
