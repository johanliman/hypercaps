import React, { useState, useEffect } from 'react';
import { Product } from '../data/products';

interface ProductVisualProps {
  product: Product;
  size?: 'small' | 'large';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ product, size = 'small' }) => {
  const isLarge = size === 'large';
  const color = product.color;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [product.imageUrl, product.id]);

  // Render different CSS-based visual graphics depending on the category (graceful fallback)
  const renderVisual = () => {
    switch (product.category) {
      case 'Keyboards':
        return (
          <div 
            className={`kb-chassis ${isLarge ? 'large' : ''}`}
            style={{ 
              borderColor: color,
              boxShadow: `0 10px 30px ${color}15, var(--shadow)`
            }}
          >
            {/* Keyboard Frame inner */}
            <div className="kb-inner">
              {/* Keyboard keys */}
              <div className="kb-row">
                <div className="kb-key esc" style={{ backgroundColor: color, color: '#fff' }}></div>
                <div className="kb-key"></div>
                <div className="kb-key"></div>
                <div className="kb-key"></div>
                <div className="kb-key"></div>
                <div className="kb-key"></div>
                <div className="kb-key accent" style={{ backgroundColor: `${color}cc` }}></div>
              </div>
              <div className="kb-row">
                <div className="kb-key tab"></div>
                <div className="kb-key"></div>
                <div className="kb-key"></div>
                <div className="kb-key"></div>
                <div className="kb-key"></div>
                <div className="kb-key enter" style={{ backgroundColor: color, color: '#fff' }}></div>
              </div>
              <div className="kb-row">
                <div className="kb-key space" style={{ backgroundColor: '#fff', border: `1px solid ${color}` }}></div>
              </div>
            </div>
          </div>
        );

      case 'Keycaps':
        return (
          <div className={`keycap-set ${isLarge ? 'large' : ''}`}>
            {/* Visualizing a set of keycaps */}
            <div className="kc-item" style={{ backgroundColor: color, boxShadow: `0 8px 0 ${color}bb, var(--shadow)` }}>
              <span className="kc-legend">Esc</span>
            </div>
            <div className="kc-item" style={{ backgroundColor: '#ffffff', border: `2px solid ${color}`, boxShadow: `0 8px 0 ${color}66, var(--shadow)` }}>
              <span className="kc-legend" style={{ color: color }}>A</span>
            </div>
            <div className="kc-item" style={{ backgroundColor: color, boxShadow: `0 8px 0 ${color}bb, var(--shadow)` }}>
              <span className="kc-legend">S</span>
            </div>
            {isLarge && (
              <>
                <div className="kc-item" style={{ backgroundColor: '#ffffff', border: `2px solid ${color}`, boxShadow: `0 8px 0 ${color}66, var(--shadow)` }}>
                  <span className="kc-legend" style={{ color: color }}>D</span>
                </div>
                <div className="kc-item wide" style={{ backgroundColor: color, boxShadow: `0 8px 0 ${color}bb, var(--shadow)` }}>
                  <span className="kc-legend">Enter</span>
                </div>
              </>
            )}
          </div>
        );

      case 'Switches':
        return (
          <div className={`switch-visual ${isLarge ? 'large' : ''}`}>
            {/* Mechanical Switch visualization */}
            <div className="switch-stem-wrapper">
              <div className="switch-stem" style={{ backgroundColor: color }}>
                <div className="stem-cross-v" style={{ backgroundColor: '#fff' }}></div>
                <div className="stem-cross-h" style={{ backgroundColor: '#fff' }}></div>
              </div>
            </div>
            <div className="switch-top-housing" style={{ borderColor: color }}>
              <div className="switch-pins"></div>
            </div>
            <div className="switch-bottom-housing" style={{ backgroundColor: '#ececec' }}></div>
          </div>
        );

      default:
        return null;
    }
  };

  if (product.imageUrl && !imageError) {
    return (
      <div className={`product-visual-container has-photo ${product.category.toLowerCase()} ${isLarge ? 'large' : ''}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`product-real-image ${isLarge ? 'large' : ''}`}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`product-visual-container procedural ${product.category.toLowerCase()} ${isLarge ? 'large' : ''}`}>
      {renderVisual()}
    </div>
  );
};
