import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius, Spacings, Text as TextTokens } from '@theme';

import type { WeekDayId } from 'types/meal_plan';
import { WEEK_DAYS } from 'types/meal_plan';

type DaySelectorProps = {
  selectedDay: WeekDayId;
  onSelectDay: (day: WeekDayId) => void;
};

const DaySelector = ({ selectedDay, onSelectDay }: DaySelectorProps) => {
  return (
    <View style={styles.row}>
      {WEEK_DAYS.map(day => {
        const selected = day.id === selectedDay;

        return (
          <Pressable
            key={day.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelectDay(day.id)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {day.short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default DaySelector;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacings.xs,
  },
  chip: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
    backgroundColor: Colors.Backgrounds.primary,
  },
  chipSelected: {
    backgroundColor: Colors.Labels.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: TextTokens.Sizes.p3,
    color: TextTokens.Colors.primary,
  },
  labelSelected: {
    color: TextTokens.Colors.onAccent,
  },
});
