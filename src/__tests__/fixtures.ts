import { Product, CartItem } from '../types';

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description: 'Your perfect pack for everyday use and walks in the forest.',
    category: "men's clothing",
    image: 'https://example.com/image1.png',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description: 'Slim-fitting style, contrast raglan long sleeve.',
    category: "men's clothing",
    image: 'https://example.com/image2.png',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Bracelet",
    price: 695,
    description: 'From our Legends Collection, the Naga was inspired by the mythical water dragon.',
    category: 'jewelery',
    image: 'https://example.com/image5.png',
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 11,
    title: 'Silicon Power 256GB SSD',
    price: 109,
    description: '3D NAND flash for high transfer speeds.',
    category: 'electronics',
    image: 'https://example.com/image11.png',
    rating: { rate: 4.8, count: 319 },
  },
  {
    id: 18,
    title: 'MBJ Women\'s Solid Short Sleeve Boat Neck V',
    price: 9.85,
    description: 'Lightweight fabric with great stretch for comfort.',
    category: "women's clothing",
    image: 'https://example.com/image18.png',
    rating: { rate: 4.7, count: 130 },
  },
];

export const mockCartItems: CartItem[] = [
  { product: mockProducts[0], quantity: 2 },
  { product: mockProducts[1], quantity: 1 },
];

export const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 99,
  title: 'Test Product',
  price: 49.99,
  description: 'A test product description.',
  category: 'test',
  image: 'https://example.com/test.png',
  rating: { rate: 4.0, count: 100 },
  ...overrides,
});