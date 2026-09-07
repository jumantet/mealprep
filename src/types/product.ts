export type LabeledId = {
  id: string;
  name: string;
};

export type ProductNutrition = {
  energyKcal100g: number | null;
  fat100g: number | null;
  saturatedFat100g: number | null;
  carbohydrates100g: number | null;
  sugars100g: number | null;
  fiber100g: number | null;
  proteins100g: number | null;
  salt100g: number | null;
};

export type Product = {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  department: LabeledId;
  category: LabeledId | null;
  quantity: string | null;
  netContent: {
    value: number;
    unit: string;
  } | null;
  price: {
    amount: number;
    currency: string;
  };
  unitPrice: {
    amount: number;
    unit: string;
  } | null;
  nutrition: ProductNutrition;
  nutriScore: string | null;
  novaGroup: number | null;
  labels: LabeledId[];
  allergens: LabeledId[];
};
