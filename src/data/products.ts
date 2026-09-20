export type Category = 'Keyboards' | 'Keycaps' | 'Switches';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  specs: string[];
  color: string; // Used for CSS-based visuals
}

export interface CartItem extends Product {
  quantity: number;
}

export const products: Product[] = [
  {
    id: 'k1',
    name: 'Hyper-65 Graphite',
    price: 189,
    category: 'Keyboards',
    description: 'A premium 65% mechanical keyboard with a sleek aluminum frame and gasket mount design.',
    specs: ['65% Layout', 'Gasket Mount', 'Hot-swappable PCB', 'RGB Backlit'],
    color: '#2d2d2d'
  },
  {
    id: 'k2',
    name: 'Frost TKL',
    price: 159,
    category: 'Keyboards',
    description: 'Minimalist Tenkeyless keyboard with a frosted polycarbonate case for smooth light diffusion.',
    specs: ['TKL Layout', 'Polycarbonate Case', 'Hot-swappable', 'White LEDs'],
    color: '#e0e0e0'
  },
  {
    id: 'c1',
    name: 'Serenity Keycaps',
    price: 85,
    category: 'Keycaps',
    description: 'High-quality PBT dye-sub keycaps with a soothing pastel color palette.',
    specs: ['PBT Material', 'Cherry Profile', '128 Keys', 'Dye-Sublimated'],
    color: '#a2d2ff'
  },
  {
    id: 'c2',
    name: 'Midnight Bloom',
    price: 95,
    category: 'Keycaps',
    description: 'Dark-themed keycaps with floral accents, made from durable doubleshot ABS.',
    specs: ['ABS Material', 'OSA Profile', '135 Keys', 'Doubleshot'],
    color: '#3d348b'
  },
  {
    id: 's1',
    name: 'Linear Velvets',
    price: 45,
    category: 'Switches',
    description: 'Ultra-smooth linear switches with a light actuation force and deep acoustic profile.',
    specs: ['Linear', '5-pin', '45g Actuation', 'Pre-lubed'],
    color: '#ff85a1'
  },
  {
    id: 's2',
    name: 'Tactile Thumps',
    price: 50,
    category: 'Switches',
    description: 'Satisfying tactile bump with a snappy return, perfect for heavy typists.',
    specs: ['Tactile', '5-pin', '62g Actuation', 'Nylon Housing'],
    color: '#fb8500'
  }
];
