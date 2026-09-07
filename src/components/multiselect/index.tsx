import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius, Spacings, Text as TextTokens } from '@theme';

export type MultiselectOption<T extends string = string> = {
  value: T;
  label: string;
  emoji?: string;
};

type MultiselectProps<T extends string> = {
  options: readonly MultiselectOption<T>[];
  value: readonly T[];
  onChange: (value: T[]) => void;
  exclusiveValues?: readonly T[];
};

const toggleValue = <T extends string>(
  selected: readonly T[],
  next: T,
  exclusiveValues: readonly T[]
) => {
  const isSelected = selected.includes(next);
  const isExclusive = exclusiveValues.includes(next);

  if (isExclusive) {
    return isSelected ? [] : [next];
  }

  const withoutExclusive = selected.filter(item => !exclusiveValues.includes(item));
  if (isSelected) {
    return withoutExclusive.filter(item => item !== next);
  }

  return [...withoutExclusive, next];
};

const Multiselect = <T extends string>({
  options,
  value,
  onChange,
  exclusiveValues = [],
}: MultiselectProps<T>) => {
  return (
    <View style={styles.grid}>
      {options.map(option => {
        const selected = value.includes(option.value);

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(toggleValue(value, option.value, exclusiveValues))}
            style={({ pressed }) => [
              styles.tile,
              selected && styles.tileSelected,
              pressed && styles.pressed,
            ]}
          >
            {option.emoji ? <Text style={styles.emoji}>{option.emoji}</Text> : null}
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default Multiselect;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacings.lg,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '45%',
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacings.sm,
    paddingVertical: Spacings['3xl'],
    paddingHorizontal: Spacings.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    backgroundColor: Colors.Backgrounds.secondary,
  },
  tileSelected: {
    backgroundColor: Colors.Accents.green,
  },
  pressed: {
    opacity: 0.7,
  },
  emoji: {
    fontSize: 32,
    lineHeight: 40,
    includeFontPadding: false,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: TextTokens.Sizes.p1,
    color: TextTokens.Colors.primary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  labelSelected: {
    color: Colors.Labels.onAccent,
  },
});
