export const WEEK_DAYS = [
  { id: 'monday', short: 'Mon', label: 'Monday' },
  { id: 'tuesday', short: 'Tue', label: 'Tuesday' },
  { id: 'wednesday', short: 'Wed', label: 'Wednesday' },
  { id: 'thursday', short: 'Thu', label: 'Thursday' },
  { id: 'friday', short: 'Fri', label: 'Friday' },
  { id: 'saturday', short: 'Sat', label: 'Saturday' },
  { id: 'sunday', short: 'Sun', label: 'Sunday' },
] as const;

export type WeekDayId = (typeof WEEK_DAYS)[number]['id'];

export type MealIngredient = {
  name: string;
  quantity: string;
};

export type DayMeal = {
  day: WeekDayId;
  mealName: string;
  prepTimeMinutes: number;
  servings: number;
  pricePerServing: number;
  ingredients: MealIngredient[];
  recipe: string[];
};

export type WeeklyMealPlan = {
  estimatedWeeklyCost: number;
  days: DayMeal[];
};
