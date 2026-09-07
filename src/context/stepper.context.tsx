import { usePathname } from 'expo-router';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenWrapper from '@components/screen_wrapper';
import StepperNavigation from '@components/stepper_navigation';
import type { DietaryNeedId } from '@data/dietary_needs';
import { Colors, Spacings } from '@theme';

export const DEFAULT_BUDGET = 82;
export const STEPPER_TOTAL_STEPS = 4;

export const STEPPER_STEPS = [
  {
    path: '/budget-selection',
    title: 'What’s your budget?',
  },
  {
    path: '/dietary-needs-selection',
    title: 'Any dietary needs?',
  },
] as const;

type StepperContextValue = {
  budget: number;
  setBudget: (budget: number) => void;
  dietaryNeeds: DietaryNeedId[];
  setDietaryNeeds: (dietaryNeeds: DietaryNeedId[]) => void;
  currentStep: number;
  totalSteps: number;
  title: string;
};

const StepperContext = createContext<StepperContextValue | null>(null);

export const useStepper = () => {
  const value = useContext(StepperContext);
  if (!value) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return value;
};

const stepFromPathname = (pathname: string) => {
  const index = STEPPER_STEPS.findIndex(step => step.path === pathname);
  if (index === -1) {
    return {
      currentStep: 1,
      title: '',
    };
  }

  return {
    currentStep: index + 1,
    title: STEPPER_STEPS[index].title,
  };
};

export const StepperProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [dietaryNeeds, setDietaryNeeds] = useState<DietaryNeedId[]>([]);
  const { currentStep, title } = stepFromPathname(pathname);

  const value = useMemo(
    () => ({
      budget,
      setBudget,
      dietaryNeeds,
      setDietaryNeeds,
      currentStep,
      totalSteps: STEPPER_TOTAL_STEPS,
      title,
    }),
    [budget, currentStep, dietaryNeeds, title]
  );

  return (
    <StepperContext.Provider value={value}>
      <ScreenWrapper style={styles.screen} safeAreaEdges={['top', 'bottom']}>
        <StepperNavigation />
        <View style={styles.body}>{children}</View>
      </ScreenWrapper>
    </StepperContext.Provider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.Backgrounds.screen,
    paddingTop: Spacings['2xl'],
  },
  body: {
    flex: 1,
  },
});
