import { Slot, usePathname } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenWrapper from '@components/screen_wrapper';
import StepperNavigation from '@components/stepper_navigation';
import { StepperProvider } from '@context/stepper.context';
import { Colors, Spacings } from '@theme';

const MEAL_PLAN_PATH = '/weekly-meal-plan';

const StepperChrome = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  if (pathname === MEAL_PLAN_PATH) {
    return children;
  }

  return (
    <ScreenWrapper style={styles.screen} safeAreaEdges={['top', 'bottom']}>
      <StepperNavigation />
      <View style={styles.body}>{children}</View>
    </ScreenWrapper>
  );
};

export default function StepperLayout() {
  return (
    <StepperProvider>
      <StepperChrome>
        <Slot />
      </StepperChrome>
    </StepperProvider>
  );
}

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
