<?php
require_once __DIR__ . '/../db.php';

$category = isset($_GET['category']) ? trim($_GET['category']) : '';

try {
    if (!empty($category) && $category !== 'All') {
        $stmt = $pdo->prepare("SELECT id, name, price, category, description, specs, color, image_url FROM products WHERE category = :category ORDER BY id ASC");
        $stmt->execute(['category' => $category]);
    } else {
        $stmt = $pdo->query("SELECT id, name, price, category, description, specs, color, image_url FROM products ORDER BY id ASC");
    }

    $rows = $stmt->fetchAll();

    // Decode JSON specs and map image_url for each product
    $products = array_map(function ($product) {
        $product['price'] = (float)$product['price'];
        $product['imageUrl'] = $product['image_url'] ?? '';
        if (is_string($product['specs'])) {
            $decoded = json_decode($product['specs'], true);
            $product['specs'] = is_array($decoded) ? $decoded : [];
        }
        return $product;
    }, $rows);

    echo json_encode([
        'status'   => 'success',
        'count'    => count($products),
        'products' => $products
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Failed to fetch products: ' . $e->getMessage()
    ]);
}
