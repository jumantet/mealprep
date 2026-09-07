import type { DietaryNeedId } from '@data/dietary_needs';

import type { Product } from 'types/product';

const MEAT_DEPARTMENTS = new Set(['carne', 'salumi']);
const FISH_DEPARTMENTS = new Set(['pesce']);
const DAIRY_DEPARTMENTS = new Set(['latticini']);

const MEAT_CATEGORIES = new Set(['en:meats', 'en:hams', 'en:poultries', 'en:sausages']);
const FISH_CATEGORIES = new Set(['en:fishes', 'en:canned-fishes']);
const DAIRY_CATEGORIES = new Set([
  'en:cheeses',
  'en:yogurts',
  'en:milks',
  'en:eggs',
  'en:dairies',
  'en:baby-milks',
]);

const hasAllergen = (product: Product, allergenId: string) =>
  product.allergens.some(allergen => allergen.id === allergenId);

export const productMatchesDietaryNeeds = (
  product: Product,
  needs: readonly DietaryNeedId[]
) => {
  if (needs.length === 0 || needs.includes('none')) {
    return true;
  }

  const departmentId = product.department.id;
  const categoryId = product.category?.id;
  const isVeggie = needs.includes('veggie') || needs.includes('vegan');

  if (isVeggie) {
    if (MEAT_DEPARTMENTS.has(departmentId) || FISH_DEPARTMENTS.has(departmentId)) {
      return false;
    }
    if (
      categoryId &&
      (MEAT_CATEGORIES.has(categoryId) || FISH_CATEGORIES.has(categoryId))
    ) {
      return false;
    }
    if (
      hasAllergen(product, 'en:fish') ||
      hasAllergen(product, 'en:molluscs') ||
      hasAllergen(product, 'en:crustaceans')
    ) {
      return false;
    }
  }

  if (needs.includes('vegan')) {
    if (DAIRY_DEPARTMENTS.has(departmentId)) {
      return false;
    }
    if (categoryId && DAIRY_CATEGORIES.has(categoryId)) {
      return false;
    }
    if (hasAllergen(product, 'en:milk') || hasAllergen(product, 'en:eggs')) {
      return false;
    }
  }

  if (needs.includes('pescatarian')) {
    if (MEAT_DEPARTMENTS.has(departmentId)) {
      return false;
    }
    if (categoryId && MEAT_CATEGORIES.has(categoryId)) {
      return false;
    }
  }

  if (needs.includes('gluten_free') && hasAllergen(product, 'en:gluten')) {
    return false;
  }

  if (needs.includes('dairy_free')) {
    if (DAIRY_DEPARTMENTS.has(departmentId)) {
      return false;
    }
    if (categoryId && DAIRY_CATEGORIES.has(categoryId)) {
      return false;
    }
    if (hasAllergen(product, 'en:milk')) {
      return false;
    }
  }

  return true;
};
