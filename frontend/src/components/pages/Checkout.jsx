// const checkoutRequest = fetch('https://gato-tuerto-server.vercel.app/checkout', {
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import products from './products.json';
import './Checkout.css'; // Asegúrate de tener las clases CSS actualizadas
import loadingBeer1 from '../../assets/loading-beer-1.webp'; // Imagen fija
import loadingBeer2 from '../../assets/loading-beer-2.webp'; // Imagen de carga

const importAll = (r) => {
  let images = {};
  r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
  return images;
};

const images = importAll(require.context('./liquors-webp', true, /\.(png|jpe?g|svg|webp)$/));

const availableZipCodes = [
  33130, 33128, 33243, 33299, 33269, 33266, 33265, 33257, 33247, 33245, 33242, 33239, 33238, 33197, 33188, 33153, 33163, 33164, 33152, 33101, 33102, 33112, 33116, 33119, 33231, 33131, 33129, 33136, 33132, 33135, 33145, 33125
];

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(18);
  const [customTip, setCustomTip] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para la pantalla de carga
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
                const imgSrc = images[size.img.replace('liquors-webp/', '')];
                return {
                  name: product.name,
                  price: size.price,
                  size: size.size,
                  imgSrc: imgSrc,
                  maxInventory: Math.min(size.inventory || 12, 12),
                };
              }
            }
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    calculateTotals(cartItems);
  }, [tipPercentage, cartItems]);

  const calculateTotals = (items) => {
    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const salesTax = subTotal * 0.07;
    const tipAmount = subTotal * (tipPercentage / 100);
    const total = subTotal + salesTax + tipAmount + 4.99;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    setSubTotal(subTotal);
    setSalesTax(salesTax);
    setTotal(total);
    setTotalItems(totalItems);
  };

  const handleQuantityChange = (id, newQuantity) => {
    localStorage.setItem(id, newQuantity);
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    calculateTotals(updatedItems);

    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };

  const handleRemoveItem = (id) => {
    localStorage.removeItem(id);
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    calculateTotals(updatedItems);

    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
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
        size: item.size
      })),
      total,
      notes
    };
  
    setIsLoading(true); // Mostrar pantalla de carga
  
    // Promise que asegura que la pantalla de carga se muestra al menos 10 segundos
    const minimumLoadingTime = new Promise((resolve) => setTimeout(resolve, 10000));
  
    // Promesa de la solicitud al servidor
    const checkoutRequest = fetch('https://gato-tuerto-server.vercel.app/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          localStorage.clear();
          navigate('/', { state: { showProcessingModal: true, fromCheckout: true } });
        } else {
          alert('Failed to process the order. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  
    // Usamos Promise.all para asegurar que ambas promesas (mínimo de 10 segundos y solicitud) terminen
    Promise.all([minimumLoadingTime, checkoutRequest]).finally(() => {
      setIsLoading(false); // Ocultar pantalla de carga después de ambas promesas
    });
  };
  

  const toggleResume = () => {
    setShowResume(!showResume);
  };

  return (
    <>
      <Header />
      <div className="app-screen">
        {isLoading && (
          <div className="loading-overlay">
            <div className="beer-container">
              <img src={loadingBeer1} alt="Fixed Beer" className="fixed-beer" />
              <img src={loadingBeer2} alt="Loading Beer" className="loading-beer" />
            </div>
            <p>Processing your order...</p>
          </div>
        )}
        <div className="checkout-container">
          <h1>Checkout</h1>

          <button className="toggle-resume-btn" onClick={toggleResume}>
            {!showResume ? 'Hide Resume' : 'Show Resume'}
          </button>

          {!showResume && (
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
                          -
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </div>

              {/* Tip Section */}
              <section className="tip-section">
  <h2>Tip</h2>
  <div className="tip-options">
    <button 
      className={`tip-button ${tipPercentage === 15 ? 'active' : ''}`}
      onClick={() => { setTipPercentage(15); setCustomTip(''); }}
    >
      15%
    </button>
    <button 
      className={`tip-button ${tipPercentage === 18 ? 'active' : ''}`}
      onClick={() => { setTipPercentage(18); setCustomTip(''); }}
    >
      18%
    </button>
    <button 
      className={`tip-button ${tipPercentage === 22 ? 'active' : ''}`}
      onClick={() => { setTipPercentage(22); setCustomTip(''); }}
    >
      22%
    </button>

    {/* Wrapping the Other button and input inside a div */}
    <div className="custom-tip-wrapper">
      <button 
        className={`tip-button ${customTip !== '' ? 'active' : ''}`}
        onClick={() => { setTipPercentage(10); setCustomTip('10'); }} // Default to 10%
      >
        Other
      </button>

      {customTip !== '' && (
        <div className="custom-tip-container">
          <input 
            type="number" 
            value={customTip} 
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setTipPercentage(0);
                setCustomTip("");
              } else {
                const parsedValue = parseFloat(value);
                if (parsedValue >= 0) {
                  setTipPercentage(parsedValue); 
                  setCustomTip(value);
                }
              }
            }} 
          />
          <span>%</span>
        </div>
      )}
    </div>
  </div>
</section>

              {/* Summary Section */}
              <div className="checkout-summary">
                <h3>Sub-Total: ${subTotal.toFixed(2)}</h3>
                <h3>Sales Tax (7%): ${salesTax.toFixed(2)}</h3>
                <h3>Tip ({tipPercentage}%): ${(subTotal * (tipPercentage / 100)).toFixed(2)}</h3>
                <h3>Delivery Fee: $4.99</h3>
                <h3>Total: ${total.toFixed(2)}</h3>
              </div>
            </section>
          )}

          <section className="address-section">
            <h2>Shipping Address</h2>
            <form className="address-form">
              <div className="form-group" style={{ position: 'relative' }}>
                <label htmlFor="zipCode">
                  ZIP Code: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="zipCode"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  placeholder="Enter your ZIP code"
                  required
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="tooltip" style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '5px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    zIndex: '10',
                    marginTop: '5px'
                  }}>
                    Must be within 3 miles distance
                  </div>
                )}
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
                <label htmlFor="email">Email: <span className="required">*</span></label>
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
            <h2>Payment Method (on Delivery) </h2>
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
                Card
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
          {/* <section className="adviser-section">
            <h2 className="adviser-title">Adviser</h2>
            <p className="adviser-text">
              <strong>
                If your delivery takes more than 45 minutes, your delivery fee will be <span className="highlight">FREE</span>.
              </strong>
            </p>
          </section> */}

          <button 
            className="checkout-button" 
            onClick={handleCheckout} 
            disabled={cartItems.length === 0 || !zipCode || !name || !address || !phoneNumber || (paymentMethod === 'card' && cardNumber.length !== 4) || !availableZipCodes.includes(parseInt(zipCode)) || !paymentMethod || !email}
          >
            Submit
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Checkout;