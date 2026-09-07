import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ScreenWrapper from '@components/screen_wrapper';
import { useStepper } from '@context/stepper.context';
import { Colors, Fonts, Radius, Spacings, Text as TextTokens } from '@theme';
import { formatEuro } from '@utils/format';

import type { WeekDayId } from 'types/meal_plan';

import DayCarousel from './components/day_carousel';
import DaySelector from './components/day_selector';
import MealCardSkeleton from './components/meal_card_skeleton';
import PreparingOverlay from './components/preparing_overlay';
import SkeletonBone from './components/skeleton_bone';

const WeeklyMealPlanScreen = () => {
  const { budget, mealPlan, isGeneratingMealPlan, mealPlanError, generateMealPlan } =
    useStepper();
  const [selectedDay, setSelectedDay] = useState<WeekDayId>('monday');
  const estimatedCost = mealPlan?.estimatedWeeklyCost ?? budget;
  const showOverlay = isGeneratingMealPlan || Boolean(mealPlanError) || !mealPlan;

  useEffect(() => {
    if (mealPlan || isGeneratingMealPlan || mealPlanError) {
      return;
    }
    void generateMealPlan();
  }, [generateMealPlan, isGeneratingMealPlan, mealPlan, mealPlanError]);

  return (
    <ScreenWrapper style={styles.screen} safeAreaEdges={['top', 'bottom']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Bon appetit!</Text>
        <View style={styles.costCard}>
          <Text style={styles.costLabel}>Est. cost</Text>
          {mealPlan ? (
            <Text style={styles.costValue}>
              {formatEuro(estimatedCost)} <Text style={styles.costValueWeek}>/ week</Text>
            </Text>
          ) : (
            <SkeletonBone style={styles.costSkeleton} />
          )}
        </View>
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </View>
      <View style={styles.carousel} pointerEvents={showOverlay ? 'none' : 'auto'}>
        {mealPlan ? (
          <DayCarousel
            days={mealPlan.days}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        ) : (
          <MealCardSkeleton />
        )}
      </View>
      <PreparingOverlay
        visible={showOverlay}
        error={mealPlanError}
        onRetry={() => {
          void generateMealPlan();
        }}
      />
    </ScreenWrapper>
  );
};

export default WeeklyMealPlanScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.Accents.green,
    paddingTop: Spacings['2xl'],
  },
  header: {
    paddingHorizontal: Spacings['2xl'],
    paddingTop: Spacings.lg,
    gap: Spacings['2xl'],
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: TextTokens.Sizes.h2,
    color: TextTokens.Colors.onAccent,
    textAlign: 'center',
  },
  costCard: {
    alignSelf: 'center',
    alignItems: 'center',
    minWidth: 188,
    paddingVertical: Spacings.lg,
    paddingHorizontal: Spacings['4xl'],
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    backgroundColor: Colors.Backgrounds.primary,
    height: 72,
    width: '100%',
    justifyContent: 'space-between',
  },
  costLabel: {
    fontFamily: Fonts.medium,
    fontSize: TextTokens.Sizes.p1,
    color: TextTokens.Colors.secondary,
  },
  costValue: {
    marginTop: Spacings.xs,
    fontFamily: Fonts.medium,
    fontSize: TextTokens.Sizes.h4,
    color: TextTokens.Colors.primary,
  },
  costValueWeek: {
    fontFamily: Fonts.medium,
    fontSize: TextTokens.Sizes.p1,
    color: TextTokens.Colors.primary,
  },
  costSkeleton: {
    marginTop: Spacings.xs,
    width: 128,
    height: TextTokens.Sizes.h4,
  },
  carousel: {
    flex: 1,
    marginTop: Spacings['2xl'],
    paddingBottom: Spacings.lg,
  },
});
