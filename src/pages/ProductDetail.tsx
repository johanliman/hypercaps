import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductVisual } from '../components/ProductVisual';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = useMemo(() => {
    return products.find((p) => p.id === id);
  }, [id]);

  if (!product) {
    return (
      <div className="container error-page fade-in">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="product-detail-page container fade-in">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Catalog</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="detail-layout">
        {/* Left: Product Visual Graphic */}
        <div className="detail-visual-column">
          <div className="detail-visual-card">
            <ProductVisual product={product} size="large" />
          </div>
        </div>

        {/* Right: Product Info and Add to Cart Section */}
        <div className="detail-info-column">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-price-box">
            <span className="detail-price">${product.price}</span>
            <span className="detail-availability">✓ In Stock</span>
          </div>

          <p className="detail-description">{product.description}</p>

          {/* Specifications */}
          <div className="detail-specs-section">
            <h3 className="specs-title">Technical Specifications</h3>
            <ul className="specs-list">
              {product.specs.map((spec, idx) => (
                <li key={idx} className="spec-item">
                  <span className="spec-dot" style={{ backgroundColor: product.color }}></span>
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          {/* Purchasing Controls */}
          <div className="detail-purchase-section">
            <div className="qty-selector-container">
              <span className="qty-label">Quantity</span>
              <div className="qty-selector">
                <button 
                  className="qty-btn" 
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-display">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              className={`btn-primary detail-add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
