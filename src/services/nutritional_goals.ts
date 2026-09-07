import type { NutritionalGoalId } from '@data/nutritional_goals';

import type { Product, ProductNutrition } from 'types/product';

/** Per 100g thresholds aligned with EU nutrition claims where they exist. */
const HIGH_PROTEIN_G = 12;
const LOW_SUGAR_G = 5;
const LOW_FAT_G = 3;
const LOW_CARBS_G = 10;
const LOW_SALT_G = 0.3;

const meets = (value: number | null, predicate: (amount: number) => boolean) =>
  value != null && predicate(value);

const matchesGoal = (nutrition: ProductNutrition, goal: NutritionalGoalId) => {
  switch (goal) {
    case 'none':
      return true;
    case 'high_protein':
      return meets(nutrition.proteins100g, amount => amount >= HIGH_PROTEIN_G);
    case 'low_sugar':
      return meets(nutrition.sugars100g, amount => amount <= LOW_SUGAR_G);
    case 'low_fat':
      return meets(nutrition.fat100g, amount => amount <= LOW_FAT_G);
    case 'low_carbs':
      return meets(nutrition.carbohydrates100g, amount => amount <= LOW_CARBS_G);
    case 'low_salt':
      return meets(nutrition.salt100g, amount => amount <= LOW_SALT_G);
  }
};

export const productMatchesNutritionalGoals = (
  product: Product,
  goals: readonly NutritionalGoalId[]
) => {
  if (goals.length === 0 || goals.includes('none')) {
    return true;
  }

  return goals.every(goal => matchesGoal(product.nutrition, goal));
};
