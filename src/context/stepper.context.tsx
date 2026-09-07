import { usePathname } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { DietaryNeedId } from '@data/dietary_needs';
import type { NutritionalGoalId } from '@data/nutritional_goals';
import { generateWeeklyMealPlan } from '@services/meal_plan';

import type { WeeklyMealPlan } from 'types/meal_plan';

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
  {
    path: '/nutritional-goals-selection',
    title: 'Any nutritional goals?',
  },
] as const;

type StepperContextValue = {
  budget: number;
  setBudget: (budget: number) => void;
  dietaryNeeds: DietaryNeedId[];
  setDietaryNeeds: (dietaryNeeds: DietaryNeedId[]) => void;
  nutritionalGoals: NutritionalGoalId[];
  setNutritionalGoals: (nutritionalGoals: NutritionalGoalId[]) => void;
  mealPlan: WeeklyMealPlan | null;
  isGeneratingMealPlan: boolean;
  mealPlanError: string | null;
  generateMealPlan: () => Promise<void>;
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
  const generationIdRef = useRef(0);
  const isGeneratingRef = useRef(false);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [dietaryNeeds, setDietaryNeeds] = useState<DietaryNeedId[]>([]);
  const [nutritionalGoals, setNutritionalGoals] = useState<NutritionalGoalId[]>([]);
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan | null>(null);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [mealPlanError, setMealPlanError] = useState<string | null>(null);
  const { currentStep, title } = stepFromPathname(pathname);

  const generateMealPlan = useCallback(async () => {
    if (isGeneratingRef.current) {
      return;
    }

    const generationId = generationIdRef.current + 1;
    generationIdRef.current = generationId;
    isGeneratingRef.current = true;
    setIsGeneratingMealPlan(true);
    setMealPlan(null);
    setMealPlanError(null);

    try {
      const plan = await generateWeeklyMealPlan({
        budget,
        dietaryNeeds,
        nutritionalGoals,
      });
      if (generationIdRef.current !== generationId) {
        return;
      }
      setMealPlan(plan);
    } catch (error) {
      if (generationIdRef.current !== generationId) {
        return;
      }
      setMealPlanError(
        error instanceof Error ? error.message : 'Could not generate the meal plan.'
      );
    } finally {
      if (generationIdRef.current === generationId) {
        isGeneratingRef.current = false;
        setIsGeneratingMealPlan(false);
      }
    }
  }, [budget, dietaryNeeds, nutritionalGoals]);

  const value = useMemo(
    () => ({
      budget,
      setBudget,
      dietaryNeeds,
      setDietaryNeeds,
      nutritionalGoals,
      setNutritionalGoals,
      mealPlan,
      isGeneratingMealPlan,
      mealPlanError,
      generateMealPlan,
      currentStep,
      totalSteps: STEPPER_TOTAL_STEPS,
      title,
    }),
    [
      budget,
      currentStep,
      dietaryNeeds,
      generateMealPlan,
      isGeneratingMealPlan,
      mealPlan,
      mealPlanError,
      nutritionalGoals,
      title,
    ]
  );

  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
};
