# 📐 Cyclomatic Complexity Analysis

**Project**: Hypercaps — Artisan Mechanical Keyboards & Components  
**Standard**: McCabe Cyclomatic Complexity (\(M = E - N + 2P = 1 + D\))  
**Analysis Target**: Core Backend API routines & Business Logic  

---

## 1. Backend Cyclomatic Complexity Table (PHP)

| Feature / Function (PHP) | File (typical) | Cyclomatic Complexity |
| :--- | :--- | :---: |
| `processOrderTransaction()` | `orders.php` | **8** |
| `dispatchInvoiceEmail()` | `orders.php` | **7** |
| `validateOrderPayload()` | `orders.php` | **6** |
| `syncProductsCatalog()` | `sync_products.php` | **6** |
| `testSmtpConnection()` | `test_db.php` | **5** |
| `checkDatabaseHealth()` | `test_db.php` | **4** |
| `fetchProductsByCategory()` | `products.php` | **4** |
| `formatInvoiceFinancials()` | `orders.php` | **4** |
| `initDatabaseConnection()` | `db.php` | **3** |
| `deserializeSpecs()` | `products.php` | **3** |

---

## 2. Routine Complexity Breakdown & Branch Analysis

### 1. `processOrderTransaction()` — CC: 8 (`orders.php`)
- **Purpose**: Executes atomic MySQL order creation with line-item iteration, transaction boundary management, and rollback handlers.
- **Decision Points**:
  - `try / catch` exception boundary
  - Subtotal numeric check & ternary assignment
  - Shipping cost tier validation
  - Dynamic 7.75% tax computation fallback
  - Null coalescing for shipping method and payment mode
  - `foreach` loop over cart line items
  - Transaction rollback conditional on active PDO transaction

### 2. `dispatchInvoiceEmail()` — CC: 7 (`orders.php`)
- **Purpose**: Dispatches branded HTML tax invoice to customer email via PHPMailer SMTP with SSL/TLS fallback.
- **Decision Points**:
  - Configuration existence check (`file_exists`)
  - SMTP enabled and credential verification guard clauses
  - Port detection and encryption protocol selection (TLS 587 vs SSL 465)
  - Merchant BCC copy dispatch conditional check
  - Native `mail()` fallback execution on SMTP transport failure

### 3. `validateOrderPayload()` — CC: 6 (`orders.php`)
- **Purpose**: Enforces strict REST input sanitization before processing orders.
- **Decision Points**:
  - Request method verification (`$_SERVER['REQUEST_METHOD'] !== 'POST'`)
  - JSON payload validation (`!$data`)
  - Required fields iteration (`fullName`, `email`, `street`, `city`, `state`, `zipCode`, `items`)
  - Line items array structure and non-empty length checks

### 4. `syncProductsCatalog()` — CC: 6 (`sync_products.php`)
- **Purpose**: Automated schema migration and catalog synchronization for 18 artisan products.
- **Decision Points**:
  - Dynamic schema column existence check (`ALTER TABLE products ADD COLUMN image_url`)
  - UPSERT execution loop over 18 products
  - Post-sync verification query and HTML table generation

### 5. `testSmtpConnection()` — CC: 5 (`test_db.php`)
- **Purpose**: Diagnostic utility testing live Gmail SMTP authentication and port reachability.
- **Decision Points**:
  - GET action parameter detection
  - Port toggle handling (587 STARTTLS vs 465 SSL)
  - PHPMailer connection exception trapping and verbose debug output capture

---

## 3. Frontend Cyclomatic Complexity Table (TypeScript / React)

For complete architectural coverage, the key frontend state management and checkout routines:

| Feature / Function (Frontend) | File (typical) | Cyclomatic Complexity |
| :--- | :--- | :---: |
| `validateCheckoutForm()` | `Checkout.tsx` | **8** |
| `handlePlaceOrder()` | `Checkout.tsx` | **7** |
| `calculateOrderSummary()` | `Checkout.tsx` | **6** |
| `updateQuantity()` | `CartContext.tsx` | **5** |
| `addToCart()` | `CartContext.tsx` | **4** |
| `filterProducts()` | `Home.tsx` | **4** |
| `removeFromCart()` | `CartContext.tsx` | **3** |
| `getCartTotal()` | `CartContext.tsx` | **3** |
| `syncLocalStorage()` | `CartContext.tsx` | **3** |
| `renderKeycapVisual()` | `ProductVisual.tsx` | **3** |

---

## 4. McCabe Complexity Interpretation Guide

| Complexity Score | Risk Rating | Architectural Status |
| :---: | :---: | :--- |
| **1 – 10** | **Low Risk** | **Simple, highly testable, well-structured procedure (Hypercaps falls entirely within this range)** |
| **11 – 20** | **Moderate Risk** | More complex; moderate refactoring or sub-routine extraction recommended |
| **21 – 50** | **High Risk** | High complexity; difficult to unit test comprehensively |
| **50+** | **Very High** | Unmaintainable / monolithic code; urgent refactoring required |
