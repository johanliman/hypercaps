<?php
require_once __DIR__ . '/db.php';

header("Content-Type: text/html; charset=UTF-8");

echo "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Sync Products to Database - Hypercaps</title>";
echo "<style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; margin: 0; padding: 40px 20px; color: #222; }
    .container { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e5ea; }
    h1 { margin-top: 0; font-size: 22px; color: #111; }
    .badge-success { background: #d1fae5; color: #065f46; padding: 8px 14px; border-radius: 6px; font-weight: 600; display: inline-block; margin-bottom: 15px; }
    .badge-error { background: #fee2e2; color: #991b1b; padding: 8px 14px; border-radius: 6px; font-weight: 600; display: inline-block; margin-bottom: 15px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    th { background: #f4f4f6; text-align: left; padding: 10px 12px; border-bottom: 2px solid #ddd; font-weight: 700; }
    td { padding: 10px 12px; border-bottom: 1px solid #eee; vertical-align: middle; }
    img { width: 50px; height: 38px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
    .btn { display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; margin-right: 10px; }
    .btn-secondary { background: #2563eb; }
</style></head><body><div class='container'>";

echo "<h1>Hypercaps Database Product Synchronizer</h1>";

try {
    // 1. Ensure image_url column exists in products table
    try {
        $pdo->exec("ALTER TABLE products ADD COLUMN image_url TEXT NULL");
        echo "<p style='color: #059669; font-size: 14px;'>✓ Checked: Added <code>image_url</code> column to <code>products</code> table.</p>";
    } catch (Exception $colEx) {
        // Column already exists or table structure is fine
        echo "<p style='color: #666; font-size: 14px;'>✓ Checked: <code>image_url</code> column already present.</p>";
    }

    // 2. The 12 Official Artisan Products
    $allProducts = [
        [
            'id' => 'k1',
            'name' => 'Hyper-65 Graphite',
            'price' => 189.00,
            'category' => 'Keyboards',
            'description' => 'A premium 65% mechanical keyboard with a sleek aluminum frame and gasket mount design for a soft, acoustic bottom-out.',
            'specs' => json_encode(['65% Layout', 'Gasket Mount', 'Hot-swappable PCB', 'RGB Backlit']),
            'color' => '#2d2d2d',
            'image_url' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 'k2',
            'name' => 'Frost TKL',
            'price' => 159.00,
            'category' => 'Keyboards',
            'description' => 'Minimalist Tenkeyless keyboard with a frosted polycarbonate case for smooth light diffusion and clean aesthetics.',
            'specs' => json_encode(['TKL Layout', 'Polycarbonate Case', 'Hot-swappable', 'White LEDs']),
            'color' => '#e0e0e0',
            'image_url' => 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 'k3',
            'name' => 'Aura-75 Wireless',
            'price' => 219.00,
            'category' => 'Keyboards',
            'description' => 'Flagship 75% CNC machined aluminum chassis with tri-mode Bluetooth/2.4G/USB-C and a solid brass acoustic weight.',
            'specs' => json_encode(['75% Compact', 'Tri-Mode Wireless', 'Solid Brass Weight', 'Flex-Cut PCB']),
            'color' => '#c5a059',
            'image_url' => 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 'k4',
            'name' => 'Cyber-40 Ortho',
            'price' => 135.00,
            'category' => 'Keyboards',
            'description' => 'Futuristic 40% ortholinear grid layout with rotary encoder knob, customizable OLED screen, and anodized teal finish.',
            'specs' => json_encode(['40% Ortholinear', 'Rotary Encoder', 'OLED Screen', 'QMK / VIA Ready']),
            'color' => '#00b4d8',
            'image_url' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 'c1',
            'name' => 'Serenity Keycaps',
            'price' => 85.00,
            'category' => 'Keycaps',
            'description' => 'High-quality PBT dye-sub keycaps with a soothing pastel color palette and silky textured finish that resists shine.',
            'specs' => json_encode(['PBT Material', 'Cherry Profile', '128 Keys', 'Dye-Sublimated']),
            'color' => '#a2d2ff',
            'image_url' => 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 'c2',
            'name' => 'Midnight Bloom',
            'price' => 95.00,
            'category' => 'Keycaps',
            'description' => 'Dark-themed keycaps with floral violet accents, engineered from durable doubleshot ABS with crisp long-lasting legends.',
            'specs' => json_encode(['ABS Material', 'OSA Profile', '135 Keys', 'Doubleshot']),
            'color' => '#3d348b',
            'image_url' => 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 'c3',
            'name' => 'Matcha Latte PBT',
            'price' => 79.00,
            'category' => 'Keycaps',
            'description' => 'Botanical forest green and creamy milk tones with crisp Japanese Katakana sub-legends printed on 1.5mm thick PBT.',
            'specs' => json_encode(['Thick 1.5mm PBT', 'Cherry Profile', '140 Keys', 'Katakana Sub-Legends']),
            'color' => '#588157',
            'image_url' => 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 'c4',
            'name' => 'Retro Terminal 1984',
            'price' => 89.00,
            'category' => 'Keycaps',
            'description' => 'Vintage amber legends over dark warm-gray bases evoking classic mainframe workstations of the 1980s.',
            'specs' => json_encode(['SA Spherical Profile', 'ABS Doubleshot', '132 Keys', 'Deep Dish Homing']),
            'color' => '#f77f00',
            'image_url' => 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 's1',
            'name' => 'Linear Velvets',
            'price' => 45.00,
            'category' => 'Switches',
            'description' => 'Ultra-smooth linear switches with a light actuation force and deep acoustic thock, factory pre-lubricated with Krytox.',
            'specs' => json_encode(['Linear', '5-pin', '45g Actuation', 'Factory Lubed']),
            'color' => '#ff85a1',
            'image_url' => 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 's2',
            'name' => 'Tactile Thumps',
            'price' => 50.00,
            'category' => 'Switches',
            'description' => 'Satisfying tactile bump with a snappy return and durable nylon housing, perfect for typing enthusiasts.',
            'specs' => json_encode(['Tactile', '5-pin', '62g Actuation', 'Nylon Housing']),
            'color' => '#fb8500',
            'image_url' => 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 's3',
            'name' => 'Silent Alpacas',
            'price' => 55.00,
            'category' => 'Switches',
            'description' => 'Whisper-quiet linear switches equipped with integrated TPE rubber dampeners, ideal for quiet office productivity.',
            'specs' => json_encode(['Silent Linear', '5-pin', '50g Actuation', 'Dual Dampeners']),
            'color' => '#06d6a0',
            'image_url' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'id' => 's4',
            'name' => 'Clicky Jades',
            'price' => 42.00,
            'category' => 'Switches',
            'description' => 'Thick tactile clickbar design producing a deep acoustic click and crisp physical snap on every keystroke.',
            'specs' => json_encode(['Clickbar Tactile', '5-pin PCB Mount', '55g Actuation', 'Polycarbonate Housing']),
            'color' => '#118ab2',
            'image_url' => 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'
        ]
    ];

    $stmt = $pdo->prepare("
        INSERT INTO products (id, name, price, category, description, specs, color, image_url)
        VALUES (:id, :name, :price, :category, :description, :specs, :color, :image_url)
        ON DUPLICATE KEY UPDATE
            name=VALUES(name),
            price=VALUES(price),
            category=VALUES(category),
            description=VALUES(description),
            specs=VALUES(specs),
            color=VALUES(color),
            image_url=VALUES(image_url)
    ");

    $count = 0;
    foreach ($allProducts as $p) {
        $stmt->execute($p);
        $count++;
    }

    echo "<div class='badge-success'>✓ Successfully inserted / updated all {$count} products in MySQL database!</div>";

    // Read back rows to verify
    $rows = $pdo->query("SELECT id, name, category, price, image_url FROM products ORDER BY id ASC")->fetchAll();

    echo "<p>Your MySQL database now contains <strong>" . count($rows) . "</strong> products:</p>";
    echo "<table>";
    echo "<tr><th>ID</th><th>Thumbnail</th><th>Product Name</th><th>Category</th><th>Price</th></tr>";
    foreach ($rows as $r) {
        $img = htmlspecialchars($r['image_url'] ?? '');
        $imgTag = $img ? "<img src='{$img}' alt='' />" : "—";
        echo "<tr>
            <td><code>{$r['id']}</code></td>
            <td>{$imgTag}</td>
            <td><strong>{$r['name']}</strong></td>
            <td>{$r['category']}</td>
            <td>\${$r['price']}</td>
        </tr>";
    }
    echo "</table>";

    echo "<div style='margin-top: 30px;'>
        <a href='../' class='btn'>Back to Store</a>
        <a href='test_db.php' class='btn btn-secondary'>Check Connection Diagnostics</a>
    </div>";

} catch (Exception $e) {
    echo "<div class='badge-error'>❌ Database Sync Failed: " . htmlspecialchars($e->getMessage()) . "</div>";
    echo "<p>Please ensure your database credentials in <code>backend/db.php</code> are correct and that the database user has INSERT / ALTER permissions.</p>";
}

echo "</div></body></html>";
