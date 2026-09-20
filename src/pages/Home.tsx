import React, { useState, useMemo } from 'react';
import { products, Category } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="home-page container fade-in">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tagline">Premium Keyboards & Accessories</span>
          <h1 className="hero-title">The Mechanical Art of Typing</h1>
          <p className="hero-subtitle">
            Explore our curated catalog of custom gasket-mount keyboards, premium dye-sub keycaps, and finely lubed linear & tactile switches.
          </p>
          <div className="hero-actions">
            <button 
              className="btn-primary"
              onClick={() => {
                const element = document.getElementById('catalog-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Browse Catalog
            </button>
            <a href="#about" className="btn-outline">Our Story</a>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog-section" className="catalog-section">
        <div className="catalog-header">
          <h2 className="section-title">Product Catalog</h2>
          
          {/* Category Filter */}
          <div className="category-filters">
            {(['All', 'Keyboards', 'Keycaps', 'Switches'] as const).map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-catalog">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* About Brand Pitch Section */}
      <section id="about" className="about-brand-section">
        <div className="about-brand-grid">
          <div className="about-brand-text">
            <h3>Designed for Enthusiasts</h3>
            <p>
              We believe a keyboard is more than just an input device—it's an extension of your creative and professional workflow. Every item in our shop is selected for its sound signature, acoustic performance, visual symmetry, and tactile feel.
            </p>
            <div className="feature-badges">
              <div className="feature-badge">
                <span className="feature-icon">🛡️</span>
                <span>Premium Quality</span>
              </div>
              <div className="feature-badge">
                <span className="feature-icon">✈️</span>
                <span>Worldwide Shipping</span>
              </div>
              <div className="feature-badge">
                <span className="feature-icon">⚡</span>
                <span>Expert Support</span>
              </div>
            </div>
          </div>
          <div className="about-brand-visual">
            <div className="aesthetic-box-frame">
              <div className="aesthetic-dot"></div>
              <div className="aesthetic-strip"></div>
              <div className="aesthetic-pattern"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
