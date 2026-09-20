import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductVisual } from '../components/ProductVisual';

export const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

  const shippingCost = subtotal > 150 ? 0 : 15;
  const totalCost = subtotal + shippingCost;

  // If cart is empty
  if (state.items.length === 0) {
    return (
      <div className="container cart-empty-page fade-in">
        <div className="empty-cart-card">
          <div className="empty-cart-icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="sad-cart"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              <path d="m10 11 4 4m0-4-4 4"></path>
            </svg>
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Explore our products and find the perfect keyboard components to start your custom build.</p>
          <Link to="/" className="btn-primary">Browse Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container fade-in">
      <h1 className="page-title">Shopping Cart</h1>
      
      <div className="cart-layout">
        {/* Left Column: List of items */}
        <div className="cart-items-column">
          <div className="cart-items-header">
            <span>Product</span>
            <span className="header-qty">Quantity</span>
            <span className="header-total">Total</span>
          </div>

          <div className="cart-items-list">
            {state.items.map((item) => (
              <div key={item.id} className="cart-item-row">
                {/* Visual */}
                <div className="cart-item-visual-cell">
                  <div className="cart-item-visual-preview">
                    <ProductVisual product={item} size="small" />
                  </div>
                </div>

                {/* Info */}
                <div className="cart-item-info-cell">
                  <span className="cart-item-category">{item.category}</span>
                  <Link to={`/product/${item.id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <span className="cart-item-price">${item.price}</span>
                </div>

                {/* Quantity Control */}
                <div className="cart-item-qty-cell">
                  <div className="qty-selector mini">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="cart-item-total-cell">
                  <span className="cart-item-subtotal">${item.price * item.quantity}</span>
                </div>

                {/* Delete button */}
                <div className="cart-item-remove-cell">
                  <button 
                    className="btn-remove" 
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="trash-icon"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions-row">
            <Link to="/" className="btn-outline">&larr; Continue Shopping</Link>
            <button className="btn-clear-cart" onClick={clearCart}>Clear Shopping Cart</button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="cart-summary-column">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
              </div>
              {shippingCost > 0 && (
                <div className="shipping-hint">
                  Add <strong>${150 - subtotal}</strong> more for free shipping!
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Estimated Total</span>
                <span className="total-price">${totalCost}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary btn-checkout">
              Proceed to Checkout &rarr;
            </Link>
            <p className="summary-guarantee">
              🔒 Secure checkout. 30-day money back guarantee included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
