// AgeVerificationModal.js
import React, { useState, useEffect } from 'react';
import logo from '../../assets/gato-tuerto-logo.png';
import Modal from 'react-modal';
import './AgeVerificationModal.css';
import axios from 'axios';


const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isOver21 = localStorage.getItem('isOver21');
    if (!isOver21) {
      setIsOpen(true);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem('isOver21', true);
    setIsOpen(false);
  };

  const handleNo = () => {
    alert('You must be over 21 to enter this site.');
  };

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Geocodificación inversa
          axios
            .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`)
            .then((response) => {
              const results = response.data.results;
              if (results.length > 0) {
                const addressComponents = results[0].address_components;
                const zipCodeComponent = addressComponents.find((component) =>
                  component.types.includes('postal_code')
                );
                if (zipCodeComponent) {
                  const zipCode = zipCodeComponent.long_name;
                  setAddress(zipCode);
                  // Save ZIP code to localStorage
                  localStorage.setItem('zipCode', zipCode);
                } else {
                  console.error('Unable to find ZIP code.');
                }
              } else {
                console.error('No address found.');
              }
            })
            .catch((error) => {
              console.error(error.message);
            });
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <Modal isOpen={isOpen} ariaHideApp={false}>
      <div className='modal-over-age'>
        <div className='image'>
          <img src={logo} alt="" />
        </div>
        <p>Are you over the age of 21?</p>
        <div>
        <button onClick={handleYes} style={{ margin: '5px', padding: '10px 20px', fontSize: '16px' }}>Yes</button>
        <button onClick={handleNo} style={{ margin: '5px', padding: '10px 20px', fontSize: '16px' }}>No</button>
        </div>
      </div>
    </Modal>
  );
};

export default AgeVerificationModal;
