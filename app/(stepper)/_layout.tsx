import { Slot } from 'expo-router';

import { StepperProvider } from '@context/stepper.context';

export default function StepperLayout() {
  return (
    <StepperProvider>
      <Slot />
    </StepperProvider>
  );
}
