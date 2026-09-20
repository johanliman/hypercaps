import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card fade-in" onClick={handleCardClick}>
      <div className="product-card-visual-wrapper">
        <ProductVisual product={product} size="small" />
      </div>
      
      <div className="product-card-info">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-description">{product.description}</p>
        
        <div className="product-card-footer">
          <span className="product-card-price">${product.price}</span>
          <button 
            className={`btn-add-to-cart ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={added}
          >
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
