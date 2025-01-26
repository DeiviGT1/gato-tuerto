// src/components/ui/CartSidebar.jsx

import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './CartSidebar.css';
import LoadingSpinner from '../ui/LoadingSpinner'; // Asegúrate de tener este componente

function CartSidebar({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [itemsData, setItemsData] = useState({ types: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para procesar los datos de la API
  const processProductsData = (data) => {
    const typesMap = {};

    data.forEach(product => {
      const { type, subtype, brand } = product;

      if (!typesMap[type]) {
        typesMap[type] = {
          type,
          subtypes: [],
        };
      }

      let subtypeEntry = typesMap[type].subtypes.find(st => st.subtype === subtype);
      if (!subtypeEntry) {
        subtypeEntry = {
          subtype,
          products: [],
        };
        typesMap[type].subtypes.push(subtypeEntry);
      }

      let brandEntry = subtypeEntry.products.find(b => b.brand === brand);
      if (!brandEntry) {
        brandEntry = {
          brand,
          products: [],
        };
        subtypeEntry.products.push(brandEntry);
      }

      // Excluir campos ya utilizados
      const { alcoholicBeverage, type: _, subtype: __, brand: ___, ...productData } = product;

      brandEntry.products.push(productData);
    });

    return { types: Object.values(typesMap) };
  };

  // Función para encontrar el producto específico por ID
  const findProductById = (id) => {
    for (const type of itemsData.types) {
      for (const subtype of type.subtypes) {
        for (const brand of subtype.products) {
          for (const product of brand.products) {
            for (const size of product.sizes) {
              if (size.id === id) {
                const imgSrc = "/images/" + size.img; // Ruta absoluta a la imagen
                return {
                  name: product.name,
                  size: size.size,
                  imgSrc: imgSrc,
                  maxInventory: size.inventory || 12  // Default to 12 if not specified
                };
              }
            }
          }
        }
      }
    }
    return null;
  };

  // Fetch de los productos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://gato-tuerto-server.vercel.app/api/products');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const structuredData = processProductsData(data);
        setItemsData(structuredData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Actualizar los ítems del carrito cuando se abre el sidebar o cuando se actualiza la data de productos
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (!loading && !error) {
        setCartItems(getCartItems());
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, itemsData, loading, error]);

  // Función para obtener los ítems del carrito desde localStorage
  const getCartItems = () => {
    const items = [];
    for (const [key, value] of Object.entries(localStorage)) {
      if (key !== "isOver21" && key !== "zipCode") {
        const product = findProductById(key);
        if (product && product.maxInventory > 12) {
          product.maxInventory = 12;
        }

        if (product) {
          items.push({
            id: key,
            name: product.name,
            size: product.size,
            quantity: parseInt(value, 10),
            maxInventory: product.maxInventory,
            imgSrc: product.imgSrc
          });
        }
      }
    }
    return items;
  };

  // Función para manejar la remoción de un ítem del carrito
  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, isRemoving: true };
      }
      return item;
    });

    setCartItems(updatedItems);

    setTimeout(() => {
      localStorage.removeItem(id);
      setCartItems(getCartItems());
    }, 300); // Asegúrate de que coincide con la duración de la animación
  };

  // Función para manejar el cambio de cantidad de un ítem en el carrito
  const handleQuantityChange = (id, newQuantity) => {
    localStorage.setItem(id, newQuantity.toString());
    setCartItems(getCartItems());
  };

  if (loading) {
    return (
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-content">
          <button className="close-btn" onClick={onClose}>X</button>
          <h2>Your Cart</h2>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-content">
          <button className="close-btn" onClick={onClose}>X</button>
          <h2>Your Cart</h2>
          <p>Error al cargar los productos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Your Cart</h2>
        <div className="cart-items">
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item, index) => (
                <div 
                  key={index} 
                  id={`cart-item-${item.id}`} 
                  className={`cart-item ${item.isRemoving ? 'fade-slide-out' : ''}`}
                >
                  <img src={item.imgSrc} alt={item.name} className="item-image" />
                  <div className='cart-item-meta'>
                    <h3>{item.name}</h3>
                    <p>Size: {item.size}</p> 
                    <div className="quantity-selector">
                      <label htmlFor={`quantity-${item.id}`}>Amount: </label>
                      <select
                        id={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      >
                        {[...Array(item.maxInventory).keys()].map((number) => (
                          <option key={number + 1} value={number + 1}>
                            {number + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button 
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className="checkout-section">
                <Link to="/checkout" className="checkout-btn">
                  Checkout
                </Link>
              </div>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartSidebar;