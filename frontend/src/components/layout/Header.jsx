import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Header.css';
import logo from '../../assets/gato-tuerto-logo.png';
import logoIso from '../../assets/gato-tuerto-logo-iso.png';
import SearchBar from './SearchBar';
import cart from '../../assets/cart-shopping-solid.svg';
import CartSidebar from '../pages/CartSideBar';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setLoading(false);
  }, [location]);

  useEffect(() => {
    updateCartCount();
  }, [cartOpen]);

  useEffect(() => {
    // Update cart count when the cart is updated
    const handleCartUpdate = () => updateCartCount();

    window.addEventListener('cartUpdated', handleCartUpdate);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateCartCount = () => {
    const count = Object.entries(localStorage)
      .filter(([key]) => key !== "isOver21" && key !== "zipCode")
      .reduce((sum, [_, value]) => sum + parseInt(value, 10), 0);
    setCartCount(count);
  };

  const handleClick = (path) => {
    setLoading(true);
    navigate(path);
    setMenuOpen(false); // Close menu on navigation
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const closeCartOnClickOutside = () => {
    setCartOpen(false);
  };

  return (
    <>
      <div className="App-header">
        <header>
          <div className="nav nav-left">
            <Link to="/" onClick={() => handleClick("/")} className='logo-link'>
              <img src={logo} alt="logo" className="logo" />
              <p className='logo-name'>
                <strong>EL GATO TUERTO</strong>
              </p>
            </Link>
            
            <button className='menu-toggle'>
              <Link to="/">
                <img src={logoIso} alt="" />
              </Link>
            </button>
            <button className="menu-toggle" onClick={toggleMenu}>
              ☰
            </button>
          </div>
          <div className={`nav nav-center ${menuOpen ? 'open' : ''}`}>
            {loading && <div className="loading-spinner">Loading...</div>}
            <div>
              <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={() => handleClick("/")}>
                <p>
                  <strong>HOME</strong>
                </p>
              </Link>
            </div>
            <div>
              <Link to="/catalog" className={location.pathname === "/catalog" ? "active" : ""} onClick={() => handleClick("/catalog")}>
                <p>
                  <strong>CATALOG</strong>
                </p>
              </Link>
            </div>
            <div>
              <Link to="/contact-us" className={location.pathname === "/contact-us" ? "active" : ""} onClick={() => handleClick("/contact-us")}>
                <p>
                  <strong>CONTACT US</strong>
                </p>
              </Link>
            </div>
            <div>
              <Link to="https://www.doordash.com/convenience/store/27766771/?event_type=autocomplete&pickup=false" target="_blank">
                <p>
                  DOORDASH
                </p>                  
              </Link>
            </div>
          </div>
          <div className="nav nav-right">
              <SearchBar placeholder="Search products..." />
          </div>
          <div className="cart">
            <button onClick={toggleCart}>
              <img src={cart} alt="Cart" />
              {/* Changed from span to div */}
              <div className="cart-count">{cartCount}</div>
            </button>
          </div>
        </header>
      </div>

      {menuOpen && <div className="overlay visible" onClick={toggleMenu}></div>}
      
      {cartOpen && (
        <div className="cart-overlay" onClick={closeCartOnClickOutside}></div>
      )}
      
      <CartSidebar isOpen={cartOpen} onClose={toggleCart} />
    </>
  );
}

export default Header;
