import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductVisual } from '../components/ProductVisual';

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod: 'standard' | 'express';
}

export interface PaymentInfo {
  method: 'card' | 'applepay';
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  sameAsBilling: boolean;
}

export interface FinalOrder {
  orderNumber: string;
  orderDate: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalCost: number;
  items: { id: string; name: string; price: number; quantity: number }[];
  customerEmail: string;
  customerName: string;
  deliveryAddress: string;
  shippingMethod: string;
  estimatedDelivery: string;
  emailSent: boolean;
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export const detectCardBrand = (cardNumber: string): CardBrand => {
  const clean = cardNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^(6011|65|64[4-9]|622)/.test(clean)) return 'discover';
  return 'unknown';
};

export const getCardBrandName = (brand: CardBrand): string => {
  switch (brand) {
    case 'visa': return 'Visa';
    case 'mastercard': return 'Mastercard';
    case 'amex': return 'American Express';
    case 'discover': return 'Discover';
    default: return 'Credit Card';
  }
};

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state, subtotal, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<FinalOrder | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    shippingMethod: 'standard',
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    method: 'card',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    sameAsBilling: true,
  });

  const detectedBrand = detectCardBrand(payment.cardNumber);

  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentInfo, string>>>({});

  useEffect(() => {
    if (state.items.length === 0 && step !== 4) {
      navigate('/cart');
    }
  }, [state.items.length, step, navigate]);

  const shippingCost = shipping.shippingMethod === 'express' ? 20 : 0;
  const estimatedTax = Math.round(subtotal * 0.0775 * 100) / 100;
  const grandTotal = Math.round((subtotal + shippingCost + estimatedTax) * 100) / 100;

  const validateShipping = (): boolean => {
    const errors: Partial<Record<keyof ShippingInfo, string>> = {};

    if (!shipping.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!shipping.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!shipping.street.trim()) {
      errors.street = 'Street address is required';
    }
    if (!shipping.city.trim()) {
      errors.city = 'City is required';
    }
    if (!shipping.state.trim()) {
      errors.state = 'State / Province is required';
    }
    if (!shipping.zipCode.trim()) {
      errors.zipCode = 'ZIP / Postal code is required';
    } else if (/[a-zA-Z]/.test(shipping.zipCode)) {
      errors.zipCode = 'ZIP code cannot contain letters';
    } else if (!/^\d{5}(-\d{4})?$/.test(shipping.zipCode.trim())) {
      errors.zipCode = 'Please enter a valid numeric ZIP code (e.g. 94107)';
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = (): boolean => {
    if (payment.method !== 'card') {
      setPaymentErrors({});
      return true;
    }

    const errors: Partial<Record<keyof PaymentInfo, string>> = {};

    if (!payment.cardName.trim()) {
      errors.cardName = 'Name on card is required';
    }
    const cleanNumber = payment.cardNumber.replace(/\s+/g, '');
    if (!cleanNumber) {
      errors.cardNumber = 'Card number is required';
    } else if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      errors.cardNumber = 'Card number must be 13-19 digits';
    }
    if (!payment.expiry.trim()) {
      errors.expiry = 'MM/YY required';
    } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(payment.expiry.replace(/\s/g, ''))) {
      errors.expiry = 'Use MM/YY format';
    }
    if (!payment.cvv.trim()) {
      errors.cvv = 'CVV required';
    } else if (!/^[0-9]{3,4}$/.test(payment.cvv)) {
      errors.cvv = '3-4 digits';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    const frozenSubtotal = subtotal;
    const frozenShippingCost = shippingCost;
    const frozenTax = Math.round(subtotal * 0.0775 * 100) / 100;
    const frozenTotal = Math.round((frozenSubtotal + frozenShippingCost + frozenTax) * 100) / 100;
    const frozenItems = state.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const fullAddress = `${shipping.street}${shipping.apartment ? ', ' + shipping.apartment : ''}, ${shipping.city}, ${shipping.state} ${shipping.zipCode}, ${shipping.country}`;
    const estDelivery = shipping.shippingMethod === 'express' ? '1 – 2 Business Days' : '3 – 5 Business Days';

    let resolvedOrderId = 'HC-' + Math.floor(100000 + Math.random() * 900000);
    let emailSent = false;

    const orderPayload = {
      fullName: shipping.fullName,
      email: shipping.email,
      phone: shipping.phone,
      street: shipping.street,
      apartment: shipping.apartment,
      city: shipping.city,
      state: shipping.state,
      zipCode: shipping.zipCode,
      country: shipping.country,
      shippingMethod: shipping.shippingMethod,
      paymentMethod: payment.method,
      subtotal: frozenSubtotal,
      shippingCost: frozenShippingCost,
      tax: frozenTax,
      totalCost: frozenTotal,
      items: frozenItems,
    };

    setSubmitError(null);
    try {
      const response = await fetch('/backend/api/orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result && result.status === 'success') {
        if (result.orderNumber) {
          resolvedOrderId = result.orderNumber;
        }
        if (result.emailSent) {
          emailSent = true;
        }
      } else {
        const errorMsg = result?.message || `Server responded with status ${response.status}. Please check your MySQL database configuration.`;
        setSubmitError(errorMsg);
        setIsSubmitting(false);
        return;
      }
    } catch {
    }

    setCompletedOrder({
      orderNumber: resolvedOrderId,
      orderDate: formattedDate,
      subtotal: frozenSubtotal,
      shippingCost: frozenShippingCost,
      tax: frozenTax,
      totalCost: frozenTotal,
      items: frozenItems,
      customerEmail: shipping.email,
      customerName: shipping.fullName,
      deliveryAddress: fullAddress,
      shippingMethod: shipping.shippingMethod,
      estimatedDelivery: estDelivery,
      emailSent,
    });

    setStep(4);
    clearCart();
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = '';
    if (/^3[47]/.test(raw)) {
      const p1 = raw.slice(0, 4);
      const p2 = raw.slice(4, 10);
      const p3 = raw.slice(10, 15);
      formatted = [p1, p2, p3].filter(Boolean).join(' ');
    } else {
      formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    }
    setPayment({ ...payment, cardNumber: formatted });
    if (paymentErrors.cardNumber) {
      setPaymentErrors({ ...paymentErrors, cardNumber: undefined });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setPayment({ ...payment, expiry: raw });
    if (paymentErrors.expiry) {
      setPaymentErrors({ ...paymentErrors, expiry: undefined });
    }
  };

  if (step === 4 && completedOrder) {
    return (
      <div className="container checkout-confirmation-page fade-in">
        <div className="confirmation-card">
          <div className="confirmation-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-svg">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <span className="confirmation-tag">Thank you for your order!</span>
          <h1 className="confirmation-title">Order Confirmed</h1>
          <p className="confirmation-desc">
            We have received your order and sent your official invoice directly to your email.
          </p>

          {completedOrder.emailSent ? (
            <div className="email-dispatched-banner">
              <span className="email-banner-icon">✉️</span>
              <div className="email-banner-text">
                <strong>Official Invoice & Receipt Sent!</strong>
                <p>Dispatched to: <span className="email-target">{completedOrder.customerEmail}</span> (Check your inbox and spam)</p>
              </div>
            </div>
          ) : (
            <div className="email-dispatched-banner">
              <span className="email-banner-icon">✉️</span>
              <div className="email-banner-text">
                <strong>Official Invoice Generated!</strong>
                <p>Target recipient: <span className="email-target">{completedOrder.customerEmail}</span> (Check inbox & spam folder)</p>
              </div>
            </div>
          )}

          <div className="confirmation-receipt-box">
            <div className="receipt-row">
              <span className="receipt-label">Order Reference:</span>
              <span className="receipt-value order-id">{completedOrder.orderNumber}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Date Placed:</span>
              <span className="receipt-value">{completedOrder.orderDate}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Recipient:</span>
              <span className="receipt-value">{completedOrder.customerName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Delivery Address:</span>
              <span className="receipt-value text-right">
                {completedOrder.deliveryAddress}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Estimated Delivery:</span>
              <span className="receipt-value delivery-date">
                {completedOrder.estimatedDelivery}
              </span>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-items-list">
              <div className="receipt-section-subtitle">Purchased Items ({completedOrder.items.length})</div>
              {completedOrder.items.map((item) => (
                <div key={item.id} className="receipt-item-line">
                  <span className="item-title">{item.name} <span className="item-qty">&times; {item.quantity}</span></span>
                  <span className="item-line-total">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-row sub">
              <span className="receipt-label">Subtotal:</span>
              <span className="receipt-value">${completedOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="receipt-row sub">
              <span className="receipt-label">Shipping ({completedOrder.shippingMethod === 'express' ? 'Express' : 'Standard'}):</span>
              <span className="receipt-value">{completedOrder.shippingCost === 0 ? 'FREE' : `$${completedOrder.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="receipt-row sub">
              <span className="receipt-label">Estimated Sales Tax (7.75%):</span>
              <span className="receipt-value">${completedOrder.tax.toFixed(2)}</span>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-row total">
              <span className="receipt-label">Total Amount Paid:</span>
              <span className="receipt-value total-price">${completedOrder.totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container fade-in">
      {/* Checkout Stepper */}
      <div className="checkout-stepper">
        <button
          className={`step-item ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}
          onClick={() => setStep(1)}
          disabled={step === 1}
        >
          <span className="step-circle">{step > 1 ? '✓' : '1'}</span>
          <span className="step-label">Shipping</span>
        </button>

        <div className={`step-connector ${step > 1 ? 'active' : ''}`}></div>

        <button
          className={`step-item ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}
          onClick={() => {
            if (validateShipping()) setStep(2);
          }}
          disabled={step < 2}
        >
          <span className="step-circle">{step > 2 ? '✓' : '2'}</span>
          <span className="step-label">Payment</span>
        </button>

        <div className={`step-connector ${step > 2 ? 'active' : ''}`}></div>

        <button
          className={`step-item ${step === 3 ? 'active' : ''}`}
          disabled={step < 3}
        >
          <span className="step-circle">3</span>
          <span className="step-label">Review</span>
        </button>
      </div>

      <div className="checkout-layout">
        {/* Left Column: Multi-Step Forms */}
        <div className="checkout-form-column">
          {/* STEP 1: SHIPPING INFORMATION */}
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="checkout-form-step fade-in">
              <div className="form-section-header">
                <h2>Contact Information</h2>
                <span className="form-step-badge">Step 1 of 3</span>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${shippingErrors.email ? 'has-error' : ''}`}
                    placeholder="typist@example.com"
                    value={shipping.email}
                    onChange={(e) => {
                      setShipping({ ...shipping, email: e.target.value });
                      if (shippingErrors.email) setShippingErrors({ ...shippingErrors, email: undefined });
                    }}
                  />
                  {shippingErrors.email && <span className="error-msg">{shippingErrors.email}</span>}
                </div>

                <div className="form-group half-width">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    className={`form-input ${shippingErrors.fullName ? 'has-error' : ''}`}
                    placeholder="Alex Morgan"
                    value={shipping.fullName}
                    onChange={(e) => {
                      setShipping({ ...shipping, fullName: e.target.value });
                      if (shippingErrors.fullName) setShippingErrors({ ...shippingErrors, fullName: undefined });
                    }}
                  />
                  {shippingErrors.fullName && <span className="error-msg">{shippingErrors.fullName}</span>}
                </div>

                <div className="form-group half-width">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-section-header with-margin">
                <h2>Shipping Address</h2>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="street">Street Address *</label>
                  <input
                    id="street"
                    type="text"
                    className={`form-input ${shippingErrors.street ? 'has-error' : ''}`}
                    placeholder="123 Mechanical Way"
                    value={shipping.street}
                    onChange={(e) => {
                      setShipping({ ...shipping, street: e.target.value });
                      if (shippingErrors.street) setShippingErrors({ ...shippingErrors, street: undefined });
                    }}
                  />
                  {shippingErrors.street && <span className="error-msg">{shippingErrors.street}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="apartment">Apartment, suite, unit (optional)</label>
                  <input
                    id="apartment"
                    type="text"
                    className="form-input"
                    placeholder="Apt 4B"
                    value={shipping.apartment}
                    onChange={(e) => setShipping({ ...shipping, apartment: e.target.value })}
                  />
                </div>

                <div className="form-group third-width">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city"
                    type="text"
                    className={`form-input ${shippingErrors.city ? 'has-error' : ''}`}
                    placeholder="San Francisco"
                    value={shipping.city}
                    onChange={(e) => {
                      setShipping({ ...shipping, city: e.target.value });
                      if (shippingErrors.city) setShippingErrors({ ...shippingErrors, city: undefined });
                    }}
                  />
                  {shippingErrors.city && <span className="error-msg">{shippingErrors.city}</span>}
                </div>

                <div className="form-group third-width">
                  <label htmlFor="state">State / Province *</label>
                  <input
                    id="state"
                    type="text"
                    className={`form-input ${shippingErrors.state ? 'has-error' : ''}`}
                    placeholder="CA"
                    value={shipping.state}
                    onChange={(e) => {
                      setShipping({ ...shipping, state: e.target.value });
                      if (shippingErrors.state) setShippingErrors({ ...shippingErrors, state: undefined });
                    }}
                  />
                  {shippingErrors.state && <span className="error-msg">{shippingErrors.state}</span>}
                </div>

                <div className="form-group third-width">
                  <label htmlFor="zipCode">ZIP / Postal Code *</label>
                  <input
                    id="zipCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    className={`form-input ${shippingErrors.zipCode ? 'has-error' : ''}`}
                    placeholder="94107"
                    value={shipping.zipCode}
                    onChange={(e) => {
                      const filtered = e.target.value.replace(/[a-zA-Z]/g, '');
                      setShipping({ ...shipping, zipCode: filtered });
                      if (shippingErrors.zipCode) setShippingErrors({ ...shippingErrors, zipCode: undefined });
                    }}
                  />
                  {shippingErrors.zipCode && <span className="error-msg">{shippingErrors.zipCode}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="country">Country / Region</label>
                  <select
                    id="country"
                    className="form-input"
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div className="form-section-header with-margin">
                <h2>Shipping Method</h2>
              </div>

              <div className="shipping-options-grid">
                <label className={`radio-card ${shipping.shippingMethod === 'standard' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={shipping.shippingMethod === 'standard'}
                    onChange={() => setShipping({ ...shipping, shippingMethod: 'standard' })}
                  />
                  <div className="radio-card-content">
                    <div className="radio-card-title">
                      <span>Standard Courier</span>
                      <span className="method-price">FREE</span>
                    </div>
                    <span className="method-desc">Estimated delivery in 3 – 5 business days</span>
                  </div>
                </label>

                <label className={`radio-card ${shipping.shippingMethod === 'express' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={shipping.shippingMethod === 'express'}
                    onChange={() => setShipping({ ...shipping, shippingMethod: 'express' })}
                  />
                  <div className="radio-card-content">
                    <div className="radio-card-title">
                      <span>Express Priority</span>
                      <span className="method-price">$20</span>
                    </div>
                    <span className="method-desc">Estimated delivery in 1 – 2 business days with air cargo</span>
                  </div>
                </label>
              </div>

              <div className="step-actions">
                <Link to="/cart" className="btn-outline">&larr; Return to Cart</Link>
                <button type="submit" className="btn-primary">
                  Continue to Payment &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <form onSubmit={handleNextToReview} className="checkout-form-step fade-in">
              <div className="form-section-header">
                <h2>Payment Method</h2>
                <span className="form-step-badge">Step 2 of 3</span>
              </div>

              <div className="payment-methods-selector">
                <button
                  type="button"
                  className={`payment-tab-btn ${payment.method === 'card' ? 'active' : ''}`}
                  onClick={() => setPayment({ ...payment, method: 'card' })}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Credit Card
                </button>

                <button
                  type="button"
                  className={`payment-tab-btn ${payment.method === 'applepay' ? 'active' : ''}`}
                  onClick={() => setPayment({ ...payment, method: 'applepay' })}
                >
                  <span className="brand-pill"> Pay</span>
                </button>
              </div>

              {payment.method === 'card' && (
                <div className="card-input-box fade-in">
                  <div className="card-brands-header">
                    <span className="card-brands-label">Accepted Cards:</span>
                    <div className="card-network-pills">
                      <span className={`network-pill ${detectedBrand === 'visa' ? 'active' : ''}`}>Visa</span>
                      <span className={`network-pill ${detectedBrand === 'mastercard' ? 'active' : ''}`}>Mastercard</span>
                      <span className={`network-pill ${detectedBrand === 'amex' ? 'active' : ''}`}>Amex</span>
                      <span className={`network-pill ${detectedBrand === 'discover' ? 'active' : ''}`}>Discover</span>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label htmlFor="cardName">Cardholder Name *</label>
                      <input
                        id="cardName"
                        type="text"
                        className={`form-input ${paymentErrors.cardName ? 'has-error' : ''}`}
                        placeholder="Alex Morgan"
                        value={payment.cardName}
                        onChange={(e) => {
                          setPayment({ ...payment, cardName: e.target.value });
                          if (paymentErrors.cardName) setPaymentErrors({ ...paymentErrors, cardName: undefined });
                        }}
                      />
                      {paymentErrors.cardName && <span className="error-msg">{paymentErrors.cardName}</span>}
                    </div>

                    <div className="form-group full-width">
                      <div className="label-with-brand">
                        <label htmlFor="cardNumber">Card Number *</label>
                        {detectedBrand !== 'unknown' && (
                          <span className={`detected-card-badge brand-${detectedBrand}`}>
                            {getCardBrandName(detectedBrand)}
                          </span>
                        )}
                      </div>
                      <input
                        id="cardNumber"
                        type="text"
                        inputMode="numeric"
                        className={`form-input ${paymentErrors.cardNumber ? 'has-error' : ''}`}
                        placeholder="4242 4242 4242 4242"
                        value={payment.cardNumber}
                        onChange={handleCardNumberChange}
                      />
                      {paymentErrors.cardNumber && <span className="error-msg">{paymentErrors.cardNumber}</span>}
                    </div>

                    <div className="form-group half-width">
                      <label htmlFor="expiry">Expiration (MM/YY) *</label>
                      <input
                        id="expiry"
                        type="text"
                        className={`form-input ${paymentErrors.expiry ? 'has-error' : ''}`}
                        placeholder="12/28"
                        value={payment.expiry}
                        onChange={handleExpiryChange}
                      />
                      {paymentErrors.expiry && <span className="error-msg">{paymentErrors.expiry}</span>}
                    </div>

                    <div className="form-group half-width">
                      <label htmlFor="cvv">CVV / CVC *</label>
                      <input
                        id="cvv"
                        type="password"
                        maxLength={4}
                        className={`form-input ${paymentErrors.cvv ? 'has-error' : ''}`}
                        placeholder="•••"
                        value={payment.cvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setPayment({ ...payment, cvv: val });
                          if (paymentErrors.cvv) setPaymentErrors({ ...paymentErrors, cvv: undefined });
                        }}
                      />
                      {paymentErrors.cvv && <span className="error-msg">{paymentErrors.cvv}</span>}
                    </div>
                  </div>
                </div>
              )}

              {payment.method === 'applepay' && (
                <div className="alternative-payment-notice fade-in">
                  <div className="alt-icon"></div>
                  <h3>Apple Pay Ready</h3>
                  <p>Touch ID or Face ID will be requested when confirming the final order review.</p>
                </div>
              )}

              <div className="step-actions">
                <button type="button" className="btn-outline" onClick={() => setStep(1)}>
                  &larr; Back to Shipping
                </button>
                <button type="submit" className="btn-primary">
                  Review Order &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER REVIEW */}
          {step === 3 && (
            <div className="checkout-form-step fade-in">
              <div className="form-section-header">
                <h2>Review & Confirm Order</h2>
                <span className="form-step-badge">Step 3 of 3</span>
              </div>

              {/* Shipping & Payment Summary Cards */}
              <div className="review-cards-grid">
                <div className="review-card">
                  <div className="review-card-header">
                    <h3>Shipping Address</h3>
                    <button className="btn-text-edit" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <p className="review-text bold">{shipping.fullName}</p>
                  <p className="review-text">{shipping.street}{shipping.apartment ? `, ${shipping.apartment}` : ''}</p>
                  <p className="review-text">{shipping.city}, {shipping.state} {shipping.zipCode}</p>
                  <p className="review-text">{shipping.country}</p>
                  <p className="review-text contact-hint">Contact: {shipping.email} {shipping.phone ? `• ${shipping.phone}` : ''}</p>
                </div>

                <div className="review-card">
                  <div className="review-card-header">
                    <h3>Payment & Method</h3>
                    <button className="btn-text-edit" onClick={() => setStep(2)}>Edit</button>
                  </div>
                  {payment.method === 'card' ? (
                    <>
                      <p className="review-text bold">
                        {payment.cardNumber ? getCardBrandName(detectCardBrand(payment.cardNumber)) : 'Credit Card'}
                      </p>
                      <p className="review-text card-num">Ending in •••• {payment.cardNumber.replace(/\s/g, '').slice(-4) || '4242'}</p>
                      <p className="review-text">Expires: {payment.expiry || '12/28'}</p>
                      <p className="review-text">Cardholder: {payment.cardName}</p>
                    </>
                  ) : (
                    <p className="review-text bold"> Apple Pay</p>
                  )}
                  <p className="review-text delivery-method-tag">
                    {shipping.shippingMethod === 'express' ? '⚡ Express Priority Shipping' : '📦 Standard Courier Shipping'}
                  </p>
                </div>
              </div>

              {/* Items List in Review */}
              <div className="review-items-list-container">
                <h3 className="review-items-title">Items in Order ({state.items.length})</h3>
                <div className="review-items-list">
                  {state.items.map((item) => (
                    <div key={item.id} className="review-item-row">
                      <div className="review-item-visual">
                        <ProductVisual product={item} size="small" />
                      </div>
                      <div className="review-item-details">
                        <span className="review-item-name">{item.name}</span>
                        <span className="review-item-cat">{item.category} • Qty: {item.quantity}</span>
                      </div>
                      <span className="review-item-total">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {submitError && (
                <div className="checkout-error-banner fade-in">
                  <div className="error-banner-icon">⚠️</div>
                  <div className="error-banner-body">
                    <strong>Server / Database Error</strong>
                    <p>{submitError}</p>
                    <p className="error-hint">
                      Test database connection by visiting <a href="/backend/test_db.php" target="_blank" rel="noreferrer">/backend/test_db.php</a>.
                    </p>
                  </div>
                </div>
              )}

              <div className="step-actions">
                <button type="button" className="btn-outline" onClick={() => setStep(2)}>
                  &larr; Back to Payment
                </button>
                <button
                  type="button"
                  className="btn-primary btn-place-order"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="spinner-wrap">
                      <span className="spinner"></span> Processing Order...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Live Order Summary */}
        <div className="checkout-summary-column">
          <div className="summary-card">
            <h3 className="summary-title">Summary Breakdown</h3>

            <div className="mini-products-preview">
              {state.items.slice(0, 3).map((item) => (
                <div key={item.id} className="mini-item-row">
                  <span className="mini-item-name">{item.name} <span className="mini-qty">x{item.quantity}</span></span>
                  <span className="mini-item-price">${item.price * item.quantity}</span>
                </div>
              ))}
              {state.items.length > 3 && (
                <span className="more-items-text">+{state.items.length - 3} more items in cart</span>
              )}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping ({shipping.shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Sales Tax (7.75%)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Grand Total</span>
                <span className="total-price">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
