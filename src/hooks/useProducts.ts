import { useMemo } from 'react';

import { getProductById, getProducts } from '@services/products';

export const useProducts = () => {
  return useMemo(() => getProducts(), []);
};

export const useProduct = (id?: string) => {
  return useMemo(() => (id ? getProductById(id) : undefined), [id]);
};
