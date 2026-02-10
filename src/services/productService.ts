import { Product } from '../types';

const API_URL = 'https://equalexperts.github.io/frontend-take-home-test-data/products.json';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }

  return response.json();
}