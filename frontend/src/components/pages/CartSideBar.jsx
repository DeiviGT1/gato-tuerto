import React, { useEffect, useState } from 'react';
import './CartSidebar.css';
import productsData from './products.json';

const importAll = (r) => {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
};

const images = importAll(require.context('./liquors', true, /\.(png|jpe?g|svg)$/));

function CartSidebar({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    setCartItems(getCartItems());
  }, [isOpen]);

  const getCartItems = () => {
    const items = [];
    for (const [key, value] of Object.entries(localStorage)) {
      if (key !== "isOver21" && key !== "zipCode") {
        const product = findProductById(key);
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

  const findProductById = (id) => {
    for (const type of productsData.types) {
      for (const subtype of type.subtypes) {
        for (const brand of subtype.products) {
          for (const product of brand.products) {
            for (const size of product.sizes) {
              if (size.id === id) {
                const imgSrc = images[size.img.replace('liquors/', '')];
                return {
                  name: product.name,
                  size: size.size,
                  imgSrc: imgSrc,
                  maxInventory: size.maxInventory || 12  // Default to 12 if not specified
                };
              }
            }
          }
        }
      }
    }
    return null;
  };

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
    }, 300); // Match the duration of the animation
  };

  const handleQuantityChange = (id, newQuantity) => {
    localStorage.setItem(id, JSON.stringify(newQuantity));
    setCartItems(getCartItems());
  };

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div>
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
                    <div>
                      <p>Amount: </p>
                      <select
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
              <div>
                <button className="checkout-btn">Checkout</button>
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
