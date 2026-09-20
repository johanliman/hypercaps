import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">HYPER</span>
          <span className="logo-accent">CAPS</span>
        </Link>
        
        <nav className="navbar-menu">
          <NavLink 
            to="/" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Catalog
          </NavLink>
          
          <NavLink 
            to="/cart" 
            className={({ isActive }) => `navbar-link cart-link ${isActive ? 'active' : ''}`}
          >
            <span className="cart-label">Cart</span>
            <div className="cart-icon-wrapper">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="cart-icon"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {totalItems > 0 && (
                <span className="cart-badge fade-in">{totalItems}</span>
              )}
            </div>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
