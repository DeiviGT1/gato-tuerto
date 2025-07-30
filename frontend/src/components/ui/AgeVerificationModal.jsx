import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

// Importa el archivo CSS que crearemos a continuación
import './AgeVerificationModal.css';

// Asegúrate de que esta ruta sea correcta y que la imagen esté en la carpeta `public`
const logoPath = "/images/gato-tuerto-logo.png";

// Clave de API de Google Maps (debe estar en un archivo .env)
const Maps_API_KEY = process.env.REACT_APP_Maps_API_KEY;

// Asigna el modal al elemento raíz de tu aplicación para la accesibilidad
Modal.setAppElement('#root');

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Comprueba si la edad ya ha sido verificada al cargar el componente
  useEffect(() => {
    const isOver21 = localStorage.getItem('isOver21');
    if (!isOver21) {
      setIsOpen(true);
    }
  }, []);

  // Opcional: Lógica de geolocalización (la he dejado como la tenías)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Si no tienes una clave de API, la petición de geocodificación fallará.
          if (!Maps_API_KEY) {
            console.warn("Google Maps API Key no está definida. La geocodificación inversa no funcionará.");
            return;
          }
          axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Maps_API_KEY}`)
            .then((response) => {
              const zipCodeComponent = response.data.results[0]?.address_components.find(c => c.types.includes('postal_code'));
              if (zipCodeComponent) {
                localStorage.setItem('zipCode', zipCodeComponent.long_name);
              }
            })
            .catch(error => console.error('Error en la geocodificación:', error));
        },
        (error) => console.error('Error de geolocalización:', error.message)
      );
    }
  }, []);


  const handleYes = () => {
    localStorage.setItem('isOver21', 'true');
    setIsOpen(false);
  };

  const handleNo = () => {
    // Es mejor mostrar un mensaje en la página que usar un alert().
    // Esto es solo un ejemplo, puedes redirigir a otra página.
    window.location.href = 'https://www.google.com/search?q=sitios+web+para+menores+de+edad';
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleNo} // Cierra si el usuario hace clic fuera (o presiona ESC)
      contentLabel="Verificación de Edad"
      // Estas son las clases clave que conectan con nuestro archivo CSS
      className="age-verification-modal"
      overlayClassName="age-verification-overlay"
      shouldCloseOnOverlayClick={false} // Impide cerrar el modal al hacer clic en el fondo
    >
      <div className="modal-content-wrapper">
        <div className="logo-container">
          <img src={logoPath} alt="Gato Tuerto Logo" className="logo-image" loading="lazy" />
        </div>
        <p className="age-prompt-text">¿Eres mayor de 21 años?</p>
        <div className="button-group">
          <button onClick={handleYes} className="age-button yes-button">
            Sí
          </button>
          <button onClick={handleNo} className="age-button no-button">
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AgeVerificationModal;