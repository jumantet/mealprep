import products from '@data/product_catalog_en.json';

import type { Product } from 'types/product';

export const getProducts = (): Product[] => products as Product[];

export const getProductById = (id: string): Product | undefined =>
  getProducts().find(product => product.id === id);
