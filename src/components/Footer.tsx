import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">HYPER</span>
            <span className="logo-accent">CAPS</span>
          </Link>
          <p className="footer-description">
            Artisanal mechanical keyboards, premium custom keycaps, and ultra-smooth switches designed for enthusiast typists.
          </p>
        </div>
        
        <div className="footer-links-group">
          <div className="footer-column">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/?category=All">All Products</Link></li>
              <li><Link to="/?category=Keyboards">Keyboards</Link></li>
              <li><Link to="/?category=Keycaps">Keycaps</Link></li>
              <li><Link to="/?category=Switches">Switches</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Contact Us</h4>
            <div className="footer-contact-block">
              <a href="mailto:support.hypercaps@gmail.com" className="footer-email-link">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  width="18" 
                  height="18"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>support.hypercaps@gmail.com</span>
              </a>
              <p className="footer-contact-hint">
                Questions about custom keyboard builds, switch recommendations, or orders? Click to send us an email directly.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Hypercaps Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
