export const NUTRITIONAL_GOAL_OPTIONS = [
  { id: 'none', label: 'None', emoji: undefined },
  { id: 'high_protein', label: 'High protein', emoji: '🥩' },
  { id: 'low_sugar', label: 'Low sugar', emoji: '🍯' },
  { id: 'low_fat', label: 'Low fat', emoji: '🫑' },
  { id: 'low_carbs', label: 'Low carbs', emoji: '🍝' },
  { id: 'low_salt', label: 'Low salt', emoji: '🧂' },
] as const;

export type NutritionalGoalId = (typeof NUTRITIONAL_GOAL_OPTIONS)[number]['id'];
