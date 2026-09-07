export const DIETARY_NEED_OPTIONS = [
  { id: 'none', label: 'None', emoji: undefined },
  { id: 'veggie', label: 'Veggie', emoji: '🥕' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
  { id: 'gluten_free', label: 'Gluten free', emoji: '🌾' },
  { id: 'dairy_free', label: 'Dairy free', emoji: '🥛' },
] as const;

export type DietaryNeedId = (typeof DIETARY_NEED_OPTIONS)[number]['id'];
