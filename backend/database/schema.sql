-- Hypercaps Database Schema (MySQL 5.7+ / 8.0+)

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    specs JSON,
    color VARCHAR(50) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    street VARCHAR(255) NOT NULL,
    apartment VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    shipping_method VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Seed All 18 Products (6 Keyboards, 6 Keycaps, 6 Switches)
INSERT INTO products (id, name, price, category, description, specs, color, image_url) VALUES
('k1', 'Hyper-65 Graphite', 189.00, 'Keyboards', 'A premium 65% mechanical keyboard with a sleek aluminum frame and gasket mount design for a soft, acoustic bottom-out.', '["65% Layout", "Gasket Mount", "Hot-swappable PCB", "RGB Backlit"]', '#2d2d2d', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'),
('k2', 'Frost TKL', 159.00, 'Keyboards', 'Minimalist Tenkeyless keyboard with a frosted polycarbonate case for smooth light diffusion and clean aesthetics.', '["TKL Layout", "Polycarbonate Case", "Hot-swappable", "White LEDs"]', '#e0e0e0', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'),
('k3', 'Aura-75 Wireless', 219.00, 'Keyboards', 'Flagship 75% CNC machined aluminum chassis with tri-mode Bluetooth/2.4G/USB-C and a solid brass acoustic weight.', '["75% Compact", "Tri-Mode Wireless", "Solid Brass Weight", "Flex-Cut PCB"]', '#c5a059', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'),
('k4', 'Cyber-40 Ortho', 135.00, 'Keyboards', 'Futuristic 40% ortholinear grid layout with rotary encoder knob, customizable OLED screen, and anodized teal finish.', '["40% Ortholinear", "Rotary Encoder", "OLED Screen", "QMK / VIA Ready"]', '#00b4d8', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80'),
('k5', 'Shelby-80 Artisan', 239.00, 'Keyboards', 'Custom 80% Tenkeyless board with an anodized navy aluminum chassis, seamless chamfered edges, and deep acoustic sound profile.', '["80% TKL Layout", "CNC Aluminum Chassis", "FR4 Mounting Plate", "South-Facing Hotswap"]', '#1d3557', 'https://images.unsplash.com/photo-1688966863295-03a35c1132b2?w=800&auto=format&fit=crop&q=80'),
('k6', 'Tofu-60 Minimalist', 169.00, 'Keyboards', 'Classic 60% compact anodized aluminum keyboard case equipped with internal brass weight bar and acoustic poron dampening.', '["60% Compact Layout", "Brass Weight Bar", "Poron Gasket Dampeners", "QMK / VIA Ready"]', '#4a4e69', 'https://images.unsplash.com/photo-1697022976768-2fd7f4e4c399?w=800&auto=format&fit=crop&q=80'),

('c1', 'Serenity Keycaps', 85.00, 'Keycaps', 'High-quality PBT dye-sub keycaps with a soothing pastel color palette and silky textured finish that resists shine.', '["PBT Material", "Cherry Profile", "128 Keys", "Dye-Sublimated"]', '#a2d2ff', 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=800&auto=format&fit=crop&q=80'),
('c2', 'Midnight Bloom', 95.00, 'Keycaps', 'Dark-themed keycaps with floral violet accents, engineered from durable doubleshot ABS with crisp long-lasting legends.', '["ABS Material", "OSA Profile", "135 Keys", "Doubleshot"]', '#3d348b', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80'),
('c3', 'Matcha Latte PBT', 79.00, 'Keycaps', 'Botanical forest green and creamy milk tones with crisp Japanese Katakana sub-legends printed on 1.5mm thick PBT.', '["Thick 1.5mm PBT", "Cherry Profile", "140 Keys", "Katakana Sub-Legends"]', '#588157', 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&auto=format&fit=crop&q=80'),
('c4', 'Retro Terminal 1984', 89.00, 'Keycaps', 'Vintage amber legends over dark warm-gray bases evoking classic mainframe workstations of the 1980s.', '["SA Spherical Profile", "ABS Doubleshot", "132 Keys", "Deep Dish Homing"]', '#f77f00', 'https://images.unsplash.com/photo-1611087889903-b4837b46857c?w=800&auto=format&fit=crop&q=80'),
('c5', 'Carbon Cyberpunk PBT', 92.00, 'Keycaps', 'High-contrast anthracite and vibrant industrial orange accent keycaps inspired by vintage tooling and cyber aesthetics.', '["PBT Dye-Sub", "Cherry Profile", "142 Keys", "Industrial Orange Accents"]', '#ff7b00', 'https://images.unsplash.com/photo-1677229537285-ea9467edb90a?w=800&auto=format&fit=crop&q=80'),
('c6', 'Nebula Pink Artisan', 98.00, 'Keycaps', 'Vibrant magenta and lilac keycaps sculpted in spherical profile with deep sculpted finger scoops and novelty keys.', '["MT3 Profile", "Doubleshot ABS", "130 Keys", "Deep Dish Spherical"]', '#d90429', 'https://images.unsplash.com/photo-1667296682738-1bdcac5719d3?w=800&auto=format&fit=crop&q=80'),

('s1', 'Linear Velvets', 45.00, 'Switches', 'Ultra-smooth linear switches with a light actuation force and deep acoustic thock, factory pre-lubricated with Krytox.', '["Linear", "5-pin", "45g Actuation", "Factory Lubed"]', '#ff85a1', 'https://images.unsplash.com/photo-1635135449698-dbf56dd1dd0c?w=800&auto=format&fit=crop&q=80'),
('s2', 'Tactile Thumps', 50.00, 'Switches', 'Satisfying tactile bump with a snappy return and durable nylon housing, perfect for typing enthusiasts.', '["Tactile", "5-pin", "62g Actuation", "Nylon Housing"]', '#fb8500', 'https://images.unsplash.com/photo-1601983578498-5272e886ce99?w=800&auto=format&fit=crop&q=80'),
('s3', 'Silent Alpacas', 55.00, 'Switches', 'Whisper-quiet linear switches equipped with integrated TPE rubber dampeners, ideal for quiet office productivity.', '["Silent Linear", "5-pin", "50g Actuation", "Dual Dampeners"]', '#06d6a0', 'https://images.unsplash.com/photo-1786173974625-ce9291a18ee1?w=800&auto=format&fit=crop&q=80'),
('s4', 'Clicky Jades', 42.00, 'Switches', 'Thick tactile clickbar design producing a deep acoustic click and crisp physical snap on every keystroke.', '["Clickbar Tactile", "5-pin PCB Mount", "55g Actuation", "Polycarbonate Housing"]', '#118ab2', 'https://images.unsplash.com/photo-1786173974541-6c1c7462d1d8?w=800&auto=format&fit=crop&q=80'),
('s5', 'Boba U4T Tactiles', 52.00, 'Switches', 'Acclaimed high-end tactile switches featuring proprietary pearl POM housing and a rounded, highly pronounced tactile bump.', '["Tactile Bump", "5-pin PCB Mount", "62g Actuation", "Custom Pearl Housing"]', '#ffd166', 'https://images.unsplash.com/photo-1636091156281-777ee1e048d8?w=800&auto=format&fit=crop&q=80'),
('s6', 'Gateron Black Inks', 48.00, 'Switches', 'Legendary enthusiast deep-sounding linear switches with dark smokey translucent housings and low-friction stems.', '["Heavy Linear", "5-pin PCB Mount", "60g Actuation", "Smokey Inks Housing"]', '#2b2d42', 'https://images.unsplash.com/photo-1632125972828-a4cfdec70f00?w=800&auto=format&fit=crop&q=80')
ON DUPLICATE KEY UPDATE 
    name=VALUES(name),
    price=VALUES(price),
    description=VALUES(description),
    specs=VALUES(specs),
    color=VALUES(color),
    image_url=VALUES(image_url);
