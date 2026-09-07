import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Radius, Spacings, Text as TextTokens } from '@theme';
import { formatEuro } from '@utils/format';

import type { DayMeal } from 'types/meal_plan';
import { WEEK_DAYS } from 'types/meal_plan';

const ICON_SIZE = 16;

type MealCardProps = {
  meal: DayMeal;
};

const MetaIcon = ({ name }: { name: string }) => {
  if (process.env.EXPO_OS !== 'ios') {
    return null;
  }

  return (
    <Image
      source={`sf:${name}`}
      tintColor={Colors.Labels.secondary}
      style={styles.icon}
    />
  );
};

const MealCard = ({ meal }: MealCardProps) => {
  const dayLabel = WEEK_DAYS.find(day => day.id === meal.day)?.label ?? meal.day;

  return (
    <View style={styles.card}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.day}>{dayLabel}</Text>
        <Text style={styles.mealName}>{meal.mealName}</Text>
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <MetaIcon name="clock" />
            <Text style={styles.metaLabel}>{meal.prepTimeMinutes} min</Text>
          </View>
          <View style={styles.meta}>
            <MetaIcon name="person.2" />
            <Text style={styles.metaLabel}>
              {meal.servings} serving{meal.servings === 1 ? '' : 's'}
            </Text>
          </View>
          <View style={styles.meta}>
            <MetaIcon name="banknote" />
            <Text style={styles.metaLabel}>
              {formatEuro(meal.pricePerServing)} / serving
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {meal.ingredients.map((ingredient, index) => (
          <Text key={`${ingredient.name}-${index}`} style={styles.bodyText}>
            {ingredient.quantity
              ? `${ingredient.quantity} ${ingredient.name}`
              : ingredient.name}
          </Text>
        ))}
        <Text style={styles.sectionTitle}>Recipe</Text>
        {meal.recipe.map((step, index) => (
          <View key={`${index}-${step}`} style={styles.step}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MealCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: Radius.lg,
    borderCurve: 'continuous',
    backgroundColor: Colors.Backgrounds.primary,
  },
  content: {
    padding: Spacings['3xl'],
    paddingBottom: Spacings['5xl'],
    gap: Spacings.sm,
  },
  day: {
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.h3,
    color: TextTokens.Colors.primary,
    marginBottom: Spacings.xl,
  },
  mealName: {
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.p1,
    color: TextTokens.Colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacings.lg,
    marginTop: Spacings.xs,
    marginBottom: Spacings.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacings.xs,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  metaLabel: {
    fontFamily: Fonts.regular,
    fontSize: TextTokens.Sizes.p3,
    color: TextTokens.Colors.secondary,
  },
  sectionTitle: {
    marginTop: Spacings.lg,
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.p2,
    color: TextTokens.Colors.primary,
  },
  bodyText: {
    fontFamily: Fonts.regular,
    fontSize: TextTokens.Sizes.p2,
    lineHeight: 22,
    color: TextTokens.Colors.secondary,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacings.md,
    marginTop: Spacings.sm,
  },
  stepBadge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    backgroundColor: Colors.Accents.green,
  },
  stepNumber: {
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.p3,
    color: TextTokens.Colors.onAccent,
    includeFontPadding: false,
  },
  stepText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: TextTokens.Sizes.p2,
    lineHeight: 22,
    color: TextTokens.Colors.secondary,
  },
});
