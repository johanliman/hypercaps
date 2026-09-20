<?php
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed. Use POST.']);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload.']);
    exit();
}

// Validate required fields
$requiredFields = ['fullName', 'email', 'street', 'city', 'state', 'zipCode', 'items'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(422);
        echo json_encode(['status' => 'error', 'message' => "Missing required field: {$field}"]);
        exit();
    }
}

if (!is_array($data['items']) || count($data['items']) === 0) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Order must contain at least one item.']);
    exit();
}

try {
    $pdo->beginTransaction();

    // Generate Order ID (HC-XXXXXX)
    $orderId = 'HC-' . random_int(100000, 999999);

    $subtotal       = isset($data['subtotal']) ? (float)$data['subtotal'] : 0.00;
    $shippingCost   = isset($data['shippingCost']) ? (float)$data['shippingCost'] : 0.00;
    // 7.75% Tax rate
    $tax            = isset($data['tax']) ? (float)$data['tax'] : round($subtotal * 0.0775, 2);
    $totalCost      = isset($data['totalCost']) ? (float)$data['totalCost'] : round($subtotal + $shippingCost + $tax, 2);
    $shippingMethod = $data['shippingMethod'] ?? 'standard';
    $paymentMethod  = $data['paymentMethod'] ?? 'card';
    $customerEmail  = trim($data['email']);
    $customerName   = trim($data['fullName']);

    // Insert Order Record
    $orderStmt = $pdo->prepare("
        INSERT INTO orders (
            id, full_name, email, phone, street, apartment, city, state, zip_code, country,
            shipping_method, payment_method, subtotal, shipping_cost, tax, total_cost, status
        ) VALUES (
            :id, :full_name, :email, :phone, :street, :apartment, :city, :state, :zip_code, :country,
            :shipping_method, :payment_method, :subtotal, :shipping_cost, :tax, :total_cost, 'Processing'
        )
    ");

    $orderStmt->execute([
        'id'              => $orderId,
        'full_name'       => $customerName,
        'email'           => $customerEmail,
        'phone'           => $data['phone'] ?? '',
        'street'          => trim($data['street']),
        'apartment'       => $data['apartment'] ?? '',
        'city'            => trim($data['city']),
        'state'           => trim($data['state']),
        'zip_code'        => trim($data['zipCode']),
        'country'         => $data['country'] ?? 'United States',
        'shipping_method' => $shippingMethod,
        'payment_method'  => $paymentMethod,
        'subtotal'        => $subtotal,
        'shipping_cost'   => $shippingCost,
        'tax'             => $tax,
        'total_cost'      => $totalCost
    ]);

    // Insert Line Items
    $itemStmt = $pdo->prepare("
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
        VALUES (:order_id, :product_id, :product_name, :price, :quantity)
    ");

    $itemsHtmlRows = '';
    foreach ($data['items'] as $item) {
        $price = (float)$item['price'];
        $qty = (int)$item['quantity'];
        $lineTotal = number_format($price * $qty, 2);

        $itemStmt->execute([
            'order_id'     => $orderId,
            'product_id'   => $item['id'],
            'product_name' => $item['name'],
            'price'        => $price,
            'quantity'     => $qty
        ]);

        $itemsHtmlRows .= "
            <tr>
                <td style='padding: 12px 14px; border-bottom: 1px solid #f0f0f0; color: #111; font-weight: 500;'>{$item['name']}</td>
                <td style='padding: 12px 14px; border-bottom: 1px solid #f0f0f0; text-align: center; color: #555;'>{$qty}</td>
                <td style='padding: 12px 14px; border-bottom: 1px solid #f0f0f0; text-align: right; color: #555;'>\${$price}</td>
                <td style='padding: 12px 14px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: 700; color: #111;'>\${$lineTotal}</td>
            </tr>
        ";
    }

    $pdo->commit();

    // Financial Formatting
    $formattedSubtotal = number_format($subtotal, 2);
    $formattedShipping = $shippingCost == 0 ? 'FREE' : '$' . number_format($shippingCost, 2);
    $formattedTax      = number_format($tax, 2);
    $formattedTotal    = number_format($totalCost, 2);
    $deliveryDays      = $shippingMethod === 'express' ? '1 – 2 Business Days' : '3 – 5 Business Days';
    $orderDateStr      = date('M j, Y');

    $streetAddr = htmlspecialchars($data['street']) . ($data['apartment'] ? ', ' . htmlspecialchars($data['apartment']) : '');
    $cityStateZip = htmlspecialchars($data['city']) . ', ' . htmlspecialchars($data['state']) . ' ' . htmlspecialchars($data['zipCode']);
    $countryStr = htmlspecialchars($data['country'] ?? 'United States');

    $emailSubject = "Hypercaps Official Invoice & Order Confirmation (#{$orderId})";

    $emailBody = "
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <title>Invoice {$orderId}</title>
    </head>
    <body style='margin: 0; padding: 30px; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color: #222;'>
      <div style='max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e5e5ea; box-shadow: 0 4px 16px rgba(0,0,0,0.04);'>
        
        <div style='background: #121212; padding: 28px 32px;'>
          <h1 style='margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;'>
            HYPER<span style='color: #888888; font-weight: 300;'>CAPS</span>
          </h1>
          <p style='margin: 4px 0 0 0; color: #10b981; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;'>Official Tax Invoice</p>
        </div>

        <div style='padding: 32px;'>
          <div style='margin-bottom: 24px;'>
            <h2 style='margin: 0 0 6px 0; font-size: 20px; color: #111;'>Thank you for your order, {$customerName}!</h2>
            <p style='margin: 0; color: #666; font-size: 14px; line-height: 1.5;'>
              Your artisan keyboard components have been registered and are being prepared for dispatch.
            </p>
          </div>

          <div style='background: #fafafa; border: 1px solid #ebebeb; border-radius: 10px; padding: 18px 20px; margin-bottom: 28px;'>
            <table style='width: 100%; font-size: 13px; line-height: 1.6;'>
              <tr>
                <td style='color: #777; width: 40%;'>Order Reference:</td>
                <td style='font-weight: 700; font-family: monospace; font-size: 14px; color: #111;'>{$orderId}</td>
              </tr>
              <tr>
                <td style='color: #777;'>Order Date:</td>
                <td style='font-weight: 600; color: #333;'>{$orderDateStr}</td>
              </tr>
              <tr>
                <td style='color: #777;'>Estimated Delivery:</td>
                <td style='font-weight: 700; color: #2563eb;'>{$deliveryDays}</td>
              </tr>
              <tr>
                <td style='color: #777; vertical-align: top;'>Ship To:</td>
                <td style='color: #333;'>
                  <strong>{$customerName}</strong><br>
                  {$streetAddr}<br>
                  {$cityStateZip}, {$countryStr}
                </td>
              </tr>
            </table>
          </div>

          <table style='width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;'>
            <thead>
              <tr style='background-color: #f5f5f7; border-bottom: 2px solid #e5e5ea; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: #666;'>
                <th style='padding: 10px 14px; text-align: left;'>Product</th>
                <th style='padding: 10px 14px; text-align: center;'>Qty</th>
                <th style='padding: 10px 14px; text-align: right;'>Price</th>
                <th style='padding: 10px 14px; text-align: right;'>Total</th>
              </tr>
            </thead>
            <tbody>
              {$itemsHtmlRows}
            </tbody>
          </table>

          <div style='border-top: 1px solid #e5e5ea; padding-top: 16px; margin-bottom: 28px;'>
            <table style='width: 100%; font-size: 14px; line-height: 1.8;'>
              <tr>
                <td style='color: #666;'>Subtotal:</td>
                <td style='text-align: right; font-weight: 500;'>\${$formattedSubtotal}</td>
              </tr>
              <tr>
                <td style='color: #666;'>Shipping ({$shippingMethod}):</td>
                <td style='text-align: right; font-weight: 500;'>{$formattedShipping}</td>
              </tr>
              <tr>
                <td style='color: #666;'>Estimated Sales Tax (7.75%):</td>
                <td style='text-align: right; font-weight: 500;'>\${$formattedTax}</td>
              </tr>
              <tr style='font-size: 18px; font-weight: 800; border-top: 2px solid #111;'>
                <td style='padding-top: 12px; color: #111;'>Total Amount Paid:</td>
                <td style='padding-top: 12px; text-align: right; color: #111;'>\${$formattedTotal}</td>
              </tr>
            </table>
          </div>

          <div style='background-color: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 12px 16px; text-align: center;'>
            <p style='margin: 0; font-size: 13px; color: #065f46; font-weight: 600;'>
              ✓ Payment Verified • 30-Day Money Back Guarantee Included
            </p>
          </div>
        </div>

        <div style='background: #fafafa; border-top: 1px solid #e5e5ea; padding: 20px 32px; text-align: center; font-size: 12px; color: #888;'>
          <p style='margin: 0;'>Hypercaps Enthusiast Keyboards & Custom Components</p>
          <p style='margin: 4px 0 0 0;'>Questions about this invoice? Contact us at support@clickclack.infinityfree.me</p>
        </div>
      </div>
    </body>
    </html>
    ";

    // Attempt sending email via PHPMailer or standard mail
    $emailSent = false;
    $emailNotice = '';

    $emailConfigPath = __DIR__ . '/../email_config.php';
    $emailConfig = file_exists($emailConfigPath) ? require $emailConfigPath : ['enabled' => false];

    if (!empty($emailConfig['enabled']) && !empty($emailConfig['username']) && $emailConfig['username'] !== 'your_email@gmail.com') {
        require_once __DIR__ . '/../phpmailer/Exception.php';
        require_once __DIR__ . '/../phpmailer/PHPMailer.php';
        require_once __DIR__ . '/../phpmailer/SMTP.php';

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

            $mail->setFrom($emailConfig['username'], $emailConfig['from_name'] ?? 'Hypercaps');
            $mail->addAddress($customerEmail, $customerName);
            $mail->isHTML(true);
            $mail->Subject = $emailSubject;
            $mail->Body    = $emailBody;

            $mail->send();
            $emailSent = true;
            $emailNotice = "Invoice successfully emailed via SMTP to {$customerEmail}.";
        } catch (\Exception $e) {
            $emailSent = false;
            $emailNotice = "SMTP Send Failed: " . $mail->ErrorInfo;
        }
    } else {
        // Fallback to standard PHP mail()
        $emailHeaders = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: Hypercaps Orders <orders@clickclack.infinityfree.me>',
            'Reply-To: support@clickclack.infinityfree.me',
            'X-Mailer: PHP/' . phpversion()
        ];
        $emailSent = @mail($customerEmail, $emailSubject, $emailBody, implode("\r\n", $emailHeaders));
        $emailNotice = $emailSent 
            ? "Invoice dispatched to {$customerEmail}." 
            : "Note: InfinityFree blocks default mail(). Set up backend/email_config.php with your Gmail or SMTP to deliver live emails.";
    }

    http_response_code(201);
    echo json_encode([
        'status'         => 'success',
        'orderNumber'    => $orderId,
        'message'        => 'Order recorded successfully in MySQL database.',
        'subtotal'       => $subtotal,
        'shippingCost'   => $shippingCost,
        'tax'            => $tax,
        'totalCost'      => $totalCost,
        'emailSent'      => $emailSent,
        'emailNotice'    => $emailNotice,
        'recipientEmail' => $customerEmail,
        'estimatedDays'  => $deliveryDays
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Failed to process order in database: ' . $e->getMessage()
    ]);
}
