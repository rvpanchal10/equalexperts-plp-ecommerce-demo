export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'name-asc';

export const SORT_LABELS: Record<SortOption, string> = {
  default: 'Default',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'rating-desc': 'Top Rated',
  'name-asc': 'Name: A–Z',
};

export const ALL_CATEGORIES = 'all';

export const TOP_RATED_THRESHOLD = 4.5;

export const PRODUCTS_PER_PAGE = 8;