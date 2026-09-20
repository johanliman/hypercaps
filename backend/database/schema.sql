-- Hypercaps Database Schema (MySQL 5.7+ / 8.0+)

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    specs JSON,
    color VARCHAR(50) NOT NULL,
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

-- Seed Initial Products
INSERT INTO products (id, name, price, category, description, specs, color) VALUES
('k1', 'Hyper-65 Graphite', 189.00, 'Keyboards', 'A premium 65% mechanical keyboard with a sleek aluminum frame and gasket mount design.', '["65% Layout", "Gasket Mount", "Hot-swappable PCB", "RGB Backlit"]', '#2d2d2d'),
('k2', 'Frost TKL', 159.00, 'Keyboards', 'Minimalist Tenkeyless keyboard with a frosted polycarbonate case for smooth light diffusion.', '["TKL Layout", "Polycarbonate Case", "Hot-swappable", "White LEDs"]', '#e0e0e0'),
('c1', 'Serenity Keycaps', 85.00, 'Keycaps', 'High-quality PBT dye-sub keycaps with a soothing pastel color palette.', '["PBT Material", "Cherry Profile", "128 Keys", "Dye-Sublimated"]', '#a2d2ff'),
('c2', 'Midnight Bloom', 95.00, 'Keycaps', 'Dark-themed keycaps with floral accents, made from durable doubleshot ABS.', '["ABS Material", "OSA Profile", "135 Keys", "Doubleshot"]', '#3d348b'),
('s1', 'Linear Velvets', 45.00, 'Switches', 'Ultra-smooth linear switches with a light actuation force and deep acoustic profile.', '["Linear", "5-pin", "45g Actuation", "Pre-lubed"]', '#ff85a1'),
('s2', 'Tactile Thumps', 50.00, 'Switches', 'Satisfying tactile bump with a snappy return, perfect for heavy typists.', '["Tactile", "5-pin", "62g Actuation", "Nylon Housing"]', '#fb8500')
ON DUPLICATE KEY UPDATE 
    name=VALUES(name),
    price=VALUES(price),
    description=VALUES(description),
    specs=VALUES(specs),
    color=VALUES(color);
