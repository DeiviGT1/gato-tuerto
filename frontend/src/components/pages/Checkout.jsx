import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import products from './products.json';
import './Checkout.css';

const importAll = (r) => {
  let images = {};
  r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
  return images;
};

const images = importAll(require.context('./liquors', true, /\.(png|jpe?g|svg)$/));

const availableZipCodes = [
  33130,33128,33243,33299,33269,33266,33265,33257,33247,33245,33242,33239,33238,33197,33188,33153,33163,33164,33152,33101,33102,33112,33116,33119,33231,33131,33129,33136,33132,33135,33145,33125
]

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showResume, setShowResume] = useState(false);
  const [zipCode, setZipCode] = useState(localStorage.getItem('zipCode') || '');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const items = Object.entries(localStorage)
      .filter(([key]) => key !== 'isOver21' && key !== 'zipCode')
      .map(([key, value]) => {
        const product = findProductById(key);
        if (product) {
          return {
            id: key,
            name: product.name,
            price: product.price,
            quantity: parseInt(value, 10),
            size: product.size,
            imgSrc: product.imgSrc,
            maxInventory: product.maxInventory,
          };
        }
        return null;
      })
      .filter(item => item !== null);
    
    setCartItems(items);
    calculateTotals(items);
  }, []);

  const findProductById = (id) => {
    for (const type of products.types) {
      for (const subtype of type.subtypes) {
        for (const brand of subtype.products) {
          for (const product of brand.products) {
            for (const size of product.sizes) {
              if (size.id === id) {
                const imgSrc = images[size.img.replace('liquors/', '')];
                return {
                  name: product.name,
                  price: size.price,
                  size: size.size,  // Asegurarse de almacenar el tamaño aquí
                  imgSrc: imgSrc,
                  maxInventory: Math.min(size.inventory || 12, 12), // Limitar a 12 si el inventario es mayor
                };
              }
            }
          }
        }
      }
    }
    return null;
  };

  const calculateTotals = (items) => {
    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const salesTax = subTotal * 0.07;
    const total = subTotal + salesTax + 10;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    setSubTotal(subTotal);
    setSalesTax(salesTax);
    setTotal(total);
    setTotalItems(totalItems);
  };

  const handleRemoveItem = (id) => {
    localStorage.removeItem(id);
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    calculateTotals(updatedItems);

    // Dispatch the custom event 'cartUpdated' after updating localStorage
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };

  const handleQuantityChange = (id, newQuantity) => {
    localStorage.setItem(id, newQuantity);
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    calculateTotals(updatedItems);

    // Dispatch the custom event 'cartUpdated' after updating localStorage
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };

  const handleCheckout = () => {
    const orderDetails = {
      name,
      address,
      phoneNumber,
      email,
      paymentMethod,
      cardNumber: paymentMethod === 'card' ? cardNumber : null,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size  // Incluyendo el tamaño aquí
      })),
      total
    };
  
    fetch('https://gato-tuerto-server.vercel.app/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderDetails)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Clear cart and redirect to confirmation page
          localStorage.clear();
          navigate('/');
        } else {
          alert('Failed to process the order. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  };

  const toggleResume = () => {
    setShowResume(!showResume);
  };

  const handleZipCodeChange = (e) => {
    setZipCode(e.target.value);
    localStorage.setItem('zipCode', e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === 'cash') {
      setCardNumber('');
    }
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };

  return (
    <>
      <Header />
      <div className="app-screen">
        <div className="checkout-container">
          <h1>Checkout</h1>

          <button className="toggle-resume-btn" onClick={toggleResume}>
            {showResume ? 'Hide Resume' : 'Show Resume'}
          </button>

          {showResume && (
            <section className="resume-section">
              <h2>Cart resume</h2>
              <div className="checkout-items">
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <div key={item.id} className="checkout-item">
                      <div>
                        <img src={item.imgSrc} alt={item.name} className="checkout-item-image" />
                      </div>
                      <div className="checkout-item-info">
                        <p>{item.name}</p>
                        <div>
                          <div className='checkout-item-amount'>
                          <p>Cantidad:   </p>
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
                        <div>
                          <p>Precio: ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      <div>
                        <button 
                          className="remove-button" 
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </div>
              <div className="checkout-summary">
                <h3>Sub-Total: ${subTotal.toFixed(2)}</h3>
                <h3>Sales Tax (7%): ${salesTax.toFixed(2)}</h3>
                <h3>Delivery Fee: 10$</h3>
                <h3>Total: ${total.toFixed(2)}</h3>
              </div>
            </section>
          )}

          <section className="address-section">
            <h2>Shipping Address</h2>
            <form className="address-form">
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code: <span className="required">*</span></label>
                <input
                  type="text"
                  id="zipCode"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  placeholder="Enter your ZIP code"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name: <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address: <span className="required">*</span></label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter your address"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number: <span className="required">*</span></label>
                <input
                  type="text"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email: </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes (optional):</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder="Any special instructions?"
                />
              </div>
            </form>
          </section>

          <section className="payment-section">
            <h2>Payment Method</h2>
            <div className="form-group">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={handlePaymentMethodChange}
                />
                Cash
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={handlePaymentMethodChange}
                />
                Card on Delivery
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="form-group">
                <label htmlFor="cardNumber">Last 4 Digits of Card:</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="Enter the last 4 digits"
                  maxLength="4"
                />
              </div>
            )}
          </section>

          <button 
            className="checkout-button" 
            onClick={handleCheckout} 
            disabled={cartItems.length === 0 || !zipCode || !name || !address || !phoneNumber || (paymentMethod === 'card' && cardNumber.length !== 4)}
          >
            Proceed to Checkout
          </button>

        </div>
      <Footer />
      </div>
    </>
  );
}

export default Checkout;
