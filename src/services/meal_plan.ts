import { DIETARY_NEED_OPTIONS, type DietaryNeedId } from '@data/dietary_needs';
import {
  NUTRITIONAL_GOAL_OPTIONS,
  type NutritionalGoalId,
} from '@data/nutritional_goals';
import { productMatchesDietaryNeeds } from '@services/dietary_needs';
import { productMatchesNutritionalGoals } from '@services/nutritional_goals';
import { getProducts } from '@services/products';

import type { DayMeal, WeeklyMealPlan, WeekDayId } from 'types/meal_plan';
import { WEEK_DAYS } from 'types/meal_plan';
import type { Product } from 'types/product';

const MAX_INGREDIENTS = 48;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';
const REQUEST_TIMEOUT_MS = 60000;

export type CatalogIngredient = {
  name: string;
  brand: string;
  department: string;
  price: number;
};

export type GenerateWeeklyMealPlanInput = {
  budget: number;
  dietaryNeeds: readonly DietaryNeedId[];
  nutritionalGoals: readonly NutritionalGoalId[];
};

const optionLabels = <T extends string>(
  ids: readonly T[],
  options: readonly { id: T; label: string }[]
) =>
  ids
    .map(id => options.find(option => option.id === id)?.label)
    .filter((label): label is string => Boolean(label));

const pickDiverseProducts = (products: Product[], limit: number) => {
  const buckets = new Map<string, Product[]>();
  for (const product of products) {
    const key = product.department.id;
    const bucket = buckets.get(key) ?? [];
    bucket.push(product);
    buckets.set(key, bucket);
  }

  const lists = [...buckets.values()];
  const picked: Product[] = [];
  let index = 0;

  while (picked.length < limit && lists.some(list => list.length > index)) {
    for (const list of lists) {
      const product = list[index];
      if (product) {
        picked.push(product);
        if (picked.length === limit) {
          break;
        }
      }
    }
    index += 1;
  }

  return picked;
};

export const getCatalogIngredients = (
  dietaryNeeds: readonly DietaryNeedId[],
  nutritionalGoals: readonly NutritionalGoalId[]
): CatalogIngredient[] => {
  const matching = getProducts().filter(
    product =>
      productMatchesDietaryNeeds(product, dietaryNeeds) &&
      productMatchesNutritionalGoals(product, nutritionalGoals)
  );
  const pool = matching.length > 0 ? matching : getProducts();

  return pickDiverseProducts(pool, MAX_INGREDIENTS).map(product => ({
    name: product.name,
    brand: product.brand,
    department: product.department.name,
    price: product.price.amount,
  }));
};

const isWeekDayId = (value: string): value is WeekDayId =>
  WEEK_DAYS.some(day => day.id === value);

const asNumber = (value: unknown) => {
  const amount = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const parseIngredients = (value: unknown): DayMeal['ingredients'] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(item => {
      if (typeof item === 'string') {
        return { name: item, quantity: '' };
      }
      if (!item || typeof item !== 'object') {
        return null;
      }
      const record = item as { name?: unknown; quantity?: unknown };
      const name = asString(record.name);
      if (!name) {
        return null;
      }
      return { name, quantity: asString(record.quantity) };
    })
    .filter((item): item is DayMeal['ingredients'][number] => item != null);
};

const parseRecipe = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(step => asString(step)).filter(Boolean);
};

const parseDays = (value: unknown): DayMeal[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const byId = new Map<WeekDayId, DayMeal>();

  value.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      return;
    }
    const record = item as Record<string, unknown>;
    const rawDay = asString(record.day).toLowerCase();
    const day = isWeekDayId(rawDay) ? rawDay : WEEK_DAYS[index]?.id;
    if (!day) {
      return;
    }

    byId.set(day, {
      day,
      mealName: asString(record.mealName) || asString(record.name) || 'Meal',
      prepTimeMinutes: Math.max(1, Math.round(asNumber(record.prepTimeMinutes))),
      servings: Math.max(1, Math.round(asNumber(record.servings) || 2)),
      pricePerServing: Math.max(0, asNumber(record.pricePerServing)),
      ingredients: parseIngredients(record.ingredients),
      recipe: parseRecipe(record.recipe),
    });
  });

  return WEEK_DAYS.map(day => byId.get(day.id)).filter((meal): meal is DayMeal =>
    Boolean(meal)
  );
};

const parseMealPlan = (payload: unknown): WeeklyMealPlan => {
  const record =
    payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const days = parseDays(record.days);

  if (days.length !== WEEK_DAYS.length) {
    throw new Error('The meal plan did not include every day of the week.');
  }

  const estimatedWeeklyCost = asNumber(record.estimatedWeeklyCost);
  const fallbackCost = days.reduce(
    (sum, day) => sum + day.pricePerServing * day.servings,
    0
  );

  return {
    estimatedWeeklyCost: estimatedWeeklyCost > 0 ? estimatedWeeklyCost : fallbackCost,
    days,
  };
};

export const generateWeeklyMealPlan = async ({
  budget,
  dietaryNeeds,
  nutritionalGoals,
}: GenerateWeeklyMealPlanInput): Promise<WeeklyMealPlan> => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenAI API key.');
  }

  const ingredients = getCatalogIngredients(dietaryNeeds, nutritionalGoals);
  const dietLabels = optionLabels(dietaryNeeds, DIETARY_NEED_OPTIONS);
  const goalLabels = optionLabels(nutritionalGoals, NUTRITIONAL_GOAL_OPTIONS);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.7,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a meal-prep chef who coaches people through cooking at home. Reply with JSON only. Use the provided grocery catalog as the ingredient source. Recipes are a cook-along: second person, one clear action per step, with heat, timing, and doneness cues so the cook always knows what to do next.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              instructions: [
                'Create one meal for each weekday from monday to sunday.',
                `Stay within a weekly grocery budget of €${budget}.`,
                'Prefer catalog products for ingredients; include name and quantity.',
                'Each meal needs prepTimeMinutes, servings, pricePerServing, ingredients, and recipe steps.',
                'estimatedWeeklyCost must be the sum of all meal costs for the week.',
                'Each recipe must have 6 to 9 steps. Never fewer than 6.',
                'Walk the cook from mise en place through heat, cooking, seasoning, finishing, and plating.',
                'Each step is 1–2 sentences, starts with a verb, and includes a time or visual cue when useful (sizzle, golden, fork-tender).',
                'Tone: encouraging and specific, like a coach in the kitchen. No vague steps such as "cook the food" or "enjoy".',
              ],
              dietaryNeeds: dietLabels,
              nutritionalGoals: goalLabels,
              catalog: ingredients,
              outputSchema: {
                estimatedWeeklyCost: 80,
                days: [
                  {
                    day: 'monday',
                    mealName: 'Lemon herb chicken with roasted veg',
                    prepTimeMinutes: 35,
                    servings: 2,
                    pricePerServing: 4.18,
                    ingredients: [{ name: 'Product from catalog', quantity: '200g' }],
                    recipe: [
                      'Set out every ingredient and pat the chicken dry so it browns instead of steaming.',
                      'Heat a splash of oil in a large pan over medium-high until it shimmers, about 1 minute.',
                      'Season the chicken well, then sear 4–5 minutes per side until the skin is deep golden.',
                      'Lower the heat to medium, add the vegetables, and toss until they pick up the pan juices.',
                      'Cover and cook 8–10 minutes, until the chicken is cooked through and the veg is tender.',
                      'Squeeze over lemon, taste, and add salt or herbs until it tastes bright.',
                      'Rest 2 minutes, then plate and spoon the pan juices over the top.',
                    ],
                  },
                ],
              },
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      if (response.status === 401) {
        throw new Error(
          'OpenAI rejected the API key. Put a valid key in .env as EXPO_PUBLIC_OPENAI_API_KEY and restart Expo.'
        );
      }
      throw new Error(
        payload?.error?.message || `Could not generate the meal plan (${response.status}).`
      );
    }

    const body = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = body.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('The meal plan response was empty.');
    }

    return parseMealPlan(JSON.parse(content));
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The meal plan took too long to generate.');
    }
    throw error instanceof Error ? error : new Error('Could not generate the meal plan.');
  } finally {
    clearTimeout(timeout);
  }
};
