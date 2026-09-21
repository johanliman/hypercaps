export type Category = 'Keyboards' | 'Keycaps' | 'Switches';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  specs: string[];
  color: string; // Used for CSS-based visuals & accent highlights
  imageUrl: string; // High-resolution product photography
}

export interface CartItem extends Product {
  quantity: number;
}

export const products: Product[] = [
  // --- KEYBOARDS (6 items) ---
  {
    id: 'k1',
    name: 'Hyper-65 Graphite',
    price: 189,
    category: 'Keyboards',
    description: 'A premium 65% mechanical keyboard with a sleek aluminum frame and gasket mount design for a soft, acoustic bottom-out.',
    specs: ['65% Layout', 'Gasket Mount', 'Hot-swappable PCB', 'RGB Backlit'],
    color: '#2d2d2d',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'k2',
    name: 'Frost TKL',
    price: 159,
    category: 'Keyboards',
    description: 'Minimalist Tenkeyless keyboard with a frosted polycarbonate case for smooth light diffusion and clean aesthetics.',
    specs: ['TKL Layout', 'Polycarbonate Case', 'Hot-swappable', 'White LEDs'],
    color: '#e0e0e0',
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'k3',
    name: 'Aura-75 Wireless',
    price: 219,
    category: 'Keyboards',
    description: 'Flagship 75% CNC machined aluminum chassis with tri-mode Bluetooth/2.4G/USB-C and a solid brass acoustic weight.',
    specs: ['75% Compact', 'Tri-Mode Wireless', 'Solid Brass Weight', 'Flex-Cut PCB'],
    color: '#c5a059',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'k4',
    name: 'Cyber-40 Ortho',
    price: 135,
    category: 'Keyboards',
    description: 'Futuristic 40% ortholinear grid layout with rotary encoder knob, customizable OLED screen, and anodized teal finish.',
    specs: ['40% Ortholinear', 'Rotary Encoder', 'OLED Screen', 'QMK / VIA Ready'],
    color: '#00b4d8',
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'k5',
    name: 'Shelby-80 Artisan',
    price: 239,
    category: 'Keyboards',
    description: 'Custom 80% Tenkeyless board with an anodized navy aluminum chassis, seamless chamfered edges, and deep acoustic sound profile.',
    specs: ['80% TKL Layout', 'CNC Aluminum Chassis', 'FR4 Mounting Plate', 'South-Facing Hotswap'],
    color: '#1d3557',
    imageUrl: 'https://images.unsplash.com/photo-1688966863295-03a35c1132b2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'k6',
    name: 'Tofu-60 Minimalist',
    price: 169,
    category: 'Keyboards',
    description: 'Classic 60% compact anodized aluminum keyboard case equipped with internal brass weight bar and acoustic poron dampening.',
    specs: ['60% Compact Layout', 'Brass Weight Bar', 'Poron Gasket Dampeners', 'QMK / VIA Ready'],
    color: '#4a4e69',
    imageUrl: 'https://images.unsplash.com/photo-1697022976768-2fd7f4e4c399?w=800&auto=format&fit=crop&q=80'
  },

  // --- KEYCAPS (6 items) ---
  {
    id: 'c1',
    name: 'Serenity Keycaps',
    price: 85,
    category: 'Keycaps',
    description: 'High-quality PBT dye-sub keycaps with a soothing pastel color palette and silky textured finish that resists shine.',
    specs: ['PBT Material', 'Cherry Profile', '128 Keys', 'Dye-Sublimated'],
    color: '#a2d2ff',
    imageUrl: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'c2',
    name: 'Midnight Bloom',
    price: 95,
    category: 'Keycaps',
    description: 'Dark-themed keycaps with floral violet accents, engineered from durable doubleshot ABS with crisp long-lasting legends.',
    specs: ['ABS Material', 'OSA Profile', '135 Keys', 'Doubleshot'],
    color: '#3d348b',
    imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'c3',
    name: 'Matcha Latte PBT',
    price: 79,
    category: 'Keycaps',
    description: 'Botanical forest green and creamy milk tones with crisp Japanese Katakana sub-legends printed on 1.5mm thick PBT.',
    specs: ['Thick 1.5mm PBT', 'Cherry Profile', '140 Keys', 'Katakana Sub-Legends'],
    color: '#588157',
    imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'c4',
    name: 'Retro Terminal 1984',
    price: 89,
    category: 'Keycaps',
    description: 'Vintage amber legends over dark warm-gray bases evoking classic mainframe workstations of the 1980s.',
    specs: ['SA Spherical Profile', 'ABS Doubleshot', '132 Keys', 'Deep Dish Homing'],
    color: '#f77f00',
    imageUrl: 'https://images.unsplash.com/photo-1611087889903-b4837b46857c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'c5',
    name: 'Carbon Cyberpunk PBT',
    price: 92,
    category: 'Keycaps',
    description: 'High-contrast anthracite and vibrant industrial orange accent keycaps inspired by vintage tooling and cyber aesthetics.',
    specs: ['PBT Dye-Sub', 'Cherry Profile', '142 Keys', 'Industrial Orange Accents'],
    color: '#ff7b00',
    imageUrl: 'https://images.unsplash.com/photo-1677229537285-ea9467edb90a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'c6',
    name: 'Nebula Pink Artisan',
    price: 98,
    category: 'Keycaps',
    description: 'Vibrant magenta and lilac keycaps sculpted in spherical profile with deep sculpted finger scoops and novelty keys.',
    specs: ['MT3 Profile', 'Doubleshot ABS', '130 Keys', 'Deep Dish Spherical'],
    color: '#d90429',
    imageUrl: 'https://images.unsplash.com/photo-1667296682738-1bdcac5719d3?w=800&auto=format&fit=crop&q=80'
  },

  // --- SWITCHES (6 items) ---
  {
    id: 's1',
    name: 'Linear Velvets',
    price: 45,
    category: 'Switches',
    description: 'Ultra-smooth linear switches with a light actuation force and deep acoustic thock, factory pre-lubricated with Krytox.',
    specs: ['Linear', '5-pin', '45g Actuation', 'Factory Lubed'],
    color: '#ff85a1',
    imageUrl: 'https://images.unsplash.com/photo-1635135449698-dbf56dd1dd0c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 's2',
    name: 'Tactile Thumps',
    price: 50,
    category: 'Switches',
    description: 'Satisfying tactile bump with a snappy return and durable nylon housing, perfect for typing enthusiasts.',
    specs: ['Tactile', '5-pin', '62g Actuation', 'Nylon Housing'],
    color: '#fb8500',
    imageUrl: 'https://images.unsplash.com/photo-1601983578498-5272e886ce99?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 's3',
    name: 'Silent Alpacas',
    price: 55,
    category: 'Switches',
    description: 'Whisper-quiet linear switches equipped with integrated TPE rubber dampeners, ideal for quiet office productivity.',
    specs: ['Silent Linear', '5-pin', '50g Actuation', 'Dual Dampeners'],
    color: '#06d6a0',
    imageUrl: 'https://images.unsplash.com/photo-1786173974625-ce9291a18ee1?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 's4',
    name: 'Clicky Jades',
    price: 42,
    category: 'Switches',
    description: 'Thick tactile clickbar design producing a deep acoustic click and crisp physical snap on every keystroke.',
    specs: ['Clickbar Tactile', '5-pin PCB Mount', '55g Actuation', 'Polycarbonate Housing'],
    color: '#118ab2',
    imageUrl: 'https://images.unsplash.com/photo-1786173974541-6c1c7462d1d8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 's5',
    name: 'Boba U4T Tactiles',
    price: 52,
    category: 'Switches',
    description: 'Acclaimed high-end tactile switches featuring proprietary pearl POM housing and a rounded, highly pronounced tactile bump.',
    specs: ['Tactile Bump', '5-pin PCB Mount', '62g Actuation', 'Custom Pearl Housing'],
    color: '#ffd166',
    imageUrl: 'https://images.unsplash.com/photo-1636091156281-777ee1e048d8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 's6',
    name: 'Gateron Black Inks',
    price: 48,
    category: 'Switches',
    description: 'Legendary enthusiast deep-sounding linear switches with dark smokey translucent housings and low-friction stems.',
    specs: ['Heavy Linear', '5-pin PCB Mount', '60g Actuation', 'Smokey Inks Housing'],
    color: '#2b2d42',
    imageUrl: 'https://images.unsplash.com/photo-1632125972828-a4cfdec70f00?w=800&auto=format&fit=crop&q=80'
  }
];
