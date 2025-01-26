// src/components/layout/Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Header.css';
import SearchBar from './SearchBar';
import CartSidebar from '../pages/CartSideBar';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Efecto para manejar el estado de carga basado en la ubicación
  useEffect(() => {
    setLoading(false);
  }, [location]);

  // Efecto para actualizar el conteo del carrito cuando se abre/cierra
  useEffect(() => {
    updateCartCount();
  }, [cartOpen]);

  // Efecto para escuchar eventos 'cartUpdated' y actualizar el conteo del carrito
  useEffect(() => {
    const handleCartUpdate = () => updateCartCount();

    window.addEventListener('cartUpdated', handleCartUpdate);

    // Limpieza del event listener al desmontar el componente
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Función para actualizar el conteo del carrito
  const updateCartCount = () => {
    const count = Object.entries(localStorage)
      .filter(([key]) => key !== "isOver21" && key !== "zipCode")
      .reduce((sum, [_, value]) => {
        const quantity = parseInt(value, 10);
        return sum + (isNaN(quantity) ? 0 : quantity);
      }, 0);
    setCartCount(count);
  };

  // Maneja la navegación y actualiza el estado de carga
  const handleClick = (path) => {
    setLoading(true);
    navigate(path);
    setMenuOpen(false); // Cerrar el menú al navegar
  };

  // Alterna la apertura del menú
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Alterna la apertura del carrito
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  // Cierra el carrito al hacer clic fuera de él
  const closeCartOnClickOutside = () => {
    setCartOpen(false);
  };

  return (
    <>
      <div className="App-header">
        <header>
          <div className="nav nav-left">
            <Link to="/" onClick={() => handleClick("/")} className='logo-link'>
              {/* Usar ruta absoluta para la imagen del logo */}
              <img src="/images/gato-tuerto-logo.png" alt="logo" className="logo" />
              <p className='logo-name'>
                <strong>EL GATO TUERTO</strong>
              </p>
            </Link>
            
            <button className='menu-toggle'>
              <Link to="/">
                {/* Usar ruta absoluta para la imagen del logo en el botón */}
                <img src="/images/gato-tuerto-logo.png" alt="logo" />
              </Link>
            </button>
            <button className="menu-toggle" onClick={toggleMenu}>
              ☰
            </button>
          </div>
          
          <div className={`nav nav-center ${menuOpen ? 'open' : ''}`}>
            {loading && <div className="loading-spinner">Loading...</div>}
            <div>
              <Link 
                to="/" 
                className={location.pathname === "/" ? "active" : ""} 
                onClick={() => handleClick("/")}
              >
                <p>
                  <strong>HOME</strong>
                </p>
              </Link>
            </div>
            <div>
              <Link 
                to="/catalog" 
                className={location.pathname === "/catalog" ? "active" : ""} 
                onClick={() => handleClick("/catalog")}
              >
                <p>
                  <strong>CATALOG</strong>
                </p>
              </Link>
            </div>
            <div>
              <Link 
                to="/contact-us" 
                className={location.pathname === "/contact-us" ? "active" : ""} 
                onClick={() => handleClick("/contact-us")}
              >
                <p>
                  <strong>CONTACT US</strong>
                </p>
              </Link>
            </div>
            <div>
              <a 
                href="https://www.instagram.com/el_gato_tuerto" 
                target="_blank" 
                rel="noopener noreferrer" // Agregar rel para seguridad
              >
                <p>
                  <strong>INSTAGRAM</strong>
                </p>
              </a>
            </div>
          </div>
          
          <div className="nav nav-right">
            <SearchBar placeholder="Search products..." />
          </div>
          
          <div className="cart">
            <button onClick={toggleCart}>
              {/* Usar ruta absoluta para la imagen del carrito */}
              <img src="/images/cart-shopping-solid.svg" alt="Cart" />
              <div className="cart-count">{cartCount}</div>
            </button>
          </div>
        </header>
      </div>

      {/* Superposición al abrir el menú */}
      {menuOpen && <div className="overlay visible" onClick={toggleMenu}></div>}
      
      {/* Superposición al abrir el carrito */}
      {cartOpen && (
        <div className="cart-overlay" onClick={closeCartOnClickOutside}></div>
      )}
      
      {/* Sidebar del carrito */}
      <CartSidebar isOpen={cartOpen} onClose={toggleCart} />
    </>
  );
}

export default Header;