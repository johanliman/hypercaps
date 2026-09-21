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
            echo "<li style='color: green;'>✅ Table <code>{$table}</code> found ({$count} records)";
            if ($table === 'products' && (int)$count < 12) {
                echo " — <span style='color: #b45309; font-weight: 600;'>Note: Only {$count}/12 products found! Click below to sync all 12 products.</span>";
            }
            echo "</li>";
        } else {
            echo "<li style='color: red;'>❌ Table <code>{$table}</code> NOT FOUND! (Please import <code>backend/database/schema.sql</code> in phpMyAdmin)</li>";
        }
    }
    echo "</ul>";

    echo "<p><a href='sync_products.php' style='display: inline-block; background: #2563eb; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;'>🔄 Sync All 12 Products & Images into MySQL Database</a></p>";

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

    $testPort = isset($_GET['port']) && $_GET['port'] == '465' ? 465 : (int)($emailConfig['port'] ?? 587);
    $testSecure = $testPort === 465 ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $debugOutput = '';
    $mail->Debugoutput = function($str, $level) use (&$debugOutput) {
        $debugOutput .= htmlspecialchars($str) . "\n";
    };
    $mail->SMTPDebug = 2; // Capture full connection debug trace

    try {
        $mail->isSMTP();
        $mail->Host       = $emailConfig['host'] ?? 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $emailConfig['username'];
        $mail->Password   = str_replace(' ', '', $emailConfig['password']);
        $mail->SMTPSecure = $testSecure;
        $mail->Port       = $testPort;
        $mail->Timeout    = 15;

        // Fix for shared hosting SSL verification
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true
            ]
        ];

        $mail->setFrom($emailConfig['username'], 'Hypercaps Diagnostics');
        $mail->addAddress($emailConfig['username'], 'Test Recipient');
        $mail->isHTML(true);
        $mail->Subject = "Hypercaps SMTP Diagnostics Test Email (Port {$testPort})";
        $mail->Body    = "<h3>SMTP Email is Working!</h3><p>Your Gmail App Password and PHPMailer on InfinityFree are configured and sending successfully over Port {$testPort}.</p>";

        $mail->send();
        echo "<div style='background: #ecfdf5; border: 1px solid #10b981; padding: 16px; border-radius: 8px; margin: 15px 0;'>";
        echo "<p style='color: #065f46; font-weight: bold; margin: 0;'>✅ SUCCESS: Test email sent to {$emailConfig['username']} via Port {$testPort}!</p>";
        echo "<p style='font-size: 13px; color: #047857; margin: 6px 0 0 0;'>Check your inbox (and Spam/Junk folder) for confirmation.</p>";
        echo "</div>";
    } catch (\Exception $e) {
        echo "<div style='background: #fef2f2; border: 1px solid #ef4444; padding: 16px; border-radius: 8px; margin: 15px 0;'>";
        echo "<p style='color: #991b1b; font-weight: bold; margin: 0;'>❌ SMTP SEND FAILED (Port {$testPort}):</p>";
        echo "<p style='color: #b91c1c; font-size: 13px; margin: 6px 0;'>" . htmlspecialchars($mail->ErrorInfo) . "</p>";
        echo "<details style='margin-top: 10px;'><summary style='cursor: pointer; color: #7f1d1d; font-weight: 600; font-size: 12px;'>Show Technical Connection Log</summary>";
        echo "<pre style='background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #fca5a5; font-size: 11px; max-height: 250px; overflow-y: auto; margin-top: 8px;'>" . $debugOutput . "</pre>";
        echo "</details>";
        echo "</div>";
    }
}

echo "<div style='display: flex; gap: 10px; margin: 15px 0;'>";
echo "<a href='?send_test_email=1&port=587' style='background: #121212; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;'>Send Test Email (Port 587 - TLS)</a>";
echo "<a href='?send_test_email=1&port=465' style='background: #374151; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;'>Send Test Email (Port 465 - SSL)</a>";
echo "</div>";

$logPath = __DIR__ . '/email_error.log';
if (file_exists($logPath)) {
    $logs = file_get_contents($logPath);
    if (!empty($logs)) {
        echo "<div style='margin-top: 20px; background: #fffbeb; border: 1px solid #f59e0b; padding: 12px 16px; border-radius: 8px;'>";
        echo "<strong style='color: #92400e; font-size: 13px;'>Recent Order Email Errors (email_error.log):</strong>";
        echo "<pre style='font-size: 11px; color: #b45309; max-height: 150px; overflow-y: auto; margin: 6px 0 0 0;'>" . htmlspecialchars($logs) . "</pre>";
        echo "</div>";
    }
}

echo "</div>";
