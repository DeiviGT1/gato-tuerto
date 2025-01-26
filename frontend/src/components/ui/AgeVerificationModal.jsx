// src/components/ui/AgeVerificationModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './AgeVerificationModal.css';
import axios from 'axios';

// Asegúrate de mover 'gato-tuerto-logo.png' a 'public/images/'
const logoPath = "/images/gato-tuerto-logo.png";

// Configuración de Modal (puedes personalizarla según tus necesidades)
Modal.setAppElement('#root'); // Asumiendo que tu aplicación tiene un div con id 'root'

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
    // Opcional: Redirigir al usuario a otra página o cerrar la pestaña
  };

  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    zipCode: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationData((prevData) => ({
            ...prevData,
            latitude,
            longitude,
          }));

          // Geocodificación inversa
          axios
            .get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            )
            .then((response) => {
              const results = response.data.results;
              if (results.length > 0) {
                const addressComponents = results[0].address_components;
                const zipCodeComponent = addressComponents.find((component) =>
                  component.types.includes('postal_code')
                );
                if (zipCodeComponent) {
                  const zipCode = zipCodeComponent.long_name;
                  setLocationData((prevData) => ({
                    ...prevData,
                    zipCode,
                  }));
                  // Guardar el ZIP code en localStorage
                  localStorage.setItem('zipCode', zipCode);
                } else {
                  console.error('Unable to find ZIP code.');
                }
              } else {
                console.error('No address found.');
              }
            })
            .catch((error) => {
              console.error('Error fetching geocoding data:', error.message);
            });
        },
        (error) => {
          console.error('Geolocation error:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={handleNo} 
      contentLabel="Age Verification" 
      className="age-verification-modal"
      overlayClassName="age-verification-overlay"
    >
      <div className='modal-over-age'>
        <div className='image'>
          {/* Usar ruta absoluta para la imagen del logo */}
          <img src={logoPath} alt="Gato Tuerto Logo" className="logo-image" />
        </div>
        <p>Are you over the age of 21?</p>
        <div className="button-group">
          <button 
            onClick={handleYes} 
            className="age-button yes-button"
          >
            Yes
          </button>
          <button 
            onClick={handleNo} 
            className="age-button no-button"
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AgeVerificationModal;