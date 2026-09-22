import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import KeycapRain from './components/KeycapRain';

export const App: React.FC = () => {
    return (
        <Router>
            <CartProvider>
                <KeycapRain />


                <div className="app-wrapper">
                    <Navbar />

                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            {/* Fallback to home */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </CartProvider>
        </Router>
    );
};

export default App;
