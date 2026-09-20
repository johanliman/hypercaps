<?php
header("Content-Type: text/html; charset=UTF-8");

echo "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; max-width: 700px; margin: 30px auto; padding: 25px; border: 1px solid #ddd; border-radius: 12px;'>";
echo "<h2 style='margin-top: 0;'>Hypercaps Environment & Connection Diagnostics</h2>";

$db_host = getenv('DB_HOST') ?: 'sql207.infinityfree.com';
$db_port = getenv('DB_PORT') ?: '3306';
$db_name = getenv('DB_NAME') ?: 'if0_42966179_hypercaps_db';
$db_user = getenv('DB_USER') ?: 'if0_42966179';
$db_pass = getenv('DB_PASS') ?: 'FcMWbNhiy7p';

echo "<h3>1. MySQL Database Connection</h3>";
echo "<p><strong>Host:</strong> {$db_host} | <strong>Database:</strong> {$db_name} | <strong>User:</strong> {$db_user}</p>";

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT            => 5,
    ];
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    echo "<p style='color: green; font-size: 16px;'><strong>✅ SUCCESS: Connected to MySQL database!</strong></p>";

    $tables = ['products', 'orders', 'order_items'];
    echo "<ul style='line-height: 1.8;'>";
    foreach ($tables as $table) {
        $check = $pdo->query("SHOW TABLES LIKE '{$table}'")->fetchAll();
        if (count($check) > 0) {
            $count = $pdo->query("SELECT COUNT(*) as c FROM {$table}")->fetch()['c'];
            echo "<li style='color: green;'>✅ Table <code>{$table}</code> found ({$count} records)</li>";
        } else {
            echo "<li style='color: red;'>❌ Table <code>{$table}</code> NOT FOUND! (Please import <code>backend/database/schema.sql</code> in phpMyAdmin)</li>";
        }
    }
    echo "</ul>";

} catch (PDOException $e) {
    echo "<p style='color: red; font-size: 16px;'><strong>❌ DATABASE CONNECTION FAILED:</strong></p>";
    echo "<pre style='background: #fee; padding: 12px; border-radius: 6px; border: 1px solid #fcc; font-size: 13px;'>" . htmlspecialchars($e->getMessage()) . "</pre>";
}

echo "<hr style='margin: 25px 0;'>";
echo "<h3>2. Gmail SMTP Email Status</h3>";

$emailConfigPath = __DIR__ . '/email_config.php';
$emailConfig = file_exists($emailConfigPath) ? require $emailConfigPath : ['enabled' => false];

echo "<p><strong>SMTP Host:</strong> " . ($emailConfig['host'] ?? 'Not set') . "<br>";
echo "<strong>SMTP User:</strong> " . ($emailConfig['username'] ?? 'Not set') . "<br>";
echo "<strong>App Password:</strong> " . (empty($emailConfig['password']) ? 'Not set' : '•••••••••••••••• (Configured)') . "<br>";
echo "<strong>Enabled:</strong> " . (!empty($emailConfig['enabled']) ? 'Yes' : 'No') . "</p>";

if (isset($_GET['send_test_email'])) {
    require_once __DIR__ . '/phpmailer/Exception.php';
    require_once __DIR__ . '/phpmailer/PHPMailer.php';
    require_once __DIR__ . '/phpmailer/SMTP.php';

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $emailConfig['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $emailConfig['username'];
        $mail->Password   = str_replace(' ', '', $emailConfig['password']);
        $mail->SMTPSecure = ($emailConfig['encryption'] ?? 'tls') === 'ssl' 
            ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS 
            : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = (int)($emailConfig['port'] ?? 587);
        $mail->Timeout    = 10;

        $mail->setFrom($emailConfig['username'], 'Hypercaps Diagnostics');
        $mail->addAddress($emailConfig['username'], 'Test Recipient');
        $mail->isHTML(true);
        $mail->Subject = 'Hypercaps SMTP Diagnostics Test Email';
        $mail->Body    = '<h3>SMTP Email is Working!</h3><p>Your Gmail App Password and PHPMailer on InfinityFree are configured and sending successfully.</p>';

        $mail->send();
        echo "<p style='color: green; font-weight: bold;'>✅ SUCCESS: Test email sent to {$emailConfig['username']}!</p>";
    } catch (\Exception $e) {
        echo "<p style='color: red; font-weight: bold;'>❌ SMTP SEND FAILED:</p>";
        echo "<pre style='background: #fee; padding: 12px; border-radius: 6px; border: 1px solid #fcc; font-size: 13px;'>" . htmlspecialchars($mail->ErrorInfo) . "</pre>";
    }
} else {
    echo "<p><a href='?send_test_email=1' style='background: #121212; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;'>Send Test Email to {$emailConfig['username']}</a></p>";
}

echo "</div>";
