export interface Category {
  id: string;
  key: string;
  name: string;
}

export const SUPPORTED_CATEGORIES: Category[] = [
  { id: '509', key: 'phones', name: 'Phones' },
  { id: '7', key: 'computers', name: 'Computer & Office' },
  { id: '44', key: 'electronics', name: 'Consumer Electronics' },
  { id: '200000343', key: 'womens_clothing', name: "Women's Clothing" },
  { id: '200000345', key: 'mens_clothing', name: "Men's Clothing" },
  { id: '26', key: 'toys', name: 'Toys & Hobbies' },
  { id: '15', key: 'home_garden', name: 'Home & Garden' },
  { id: '18', key: 'sports', name: 'Sports & Entertainment' },
];
