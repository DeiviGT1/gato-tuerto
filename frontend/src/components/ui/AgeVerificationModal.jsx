// AgeVerificationModal.js
import React, { useState, useEffect } from 'react';
import logo from '../../assets/gato-tuerto-logo.png';
import Modal from 'react-modal';
import './AgeVerificationModal.css';

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isOver18 = localStorage.getItem('sOver18');
    if (!isOver18) {
      setIsOpen(true);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem('isOver18', true);
    setIsOpen(false);
  };

  const handleNo = () => {
    alert('You must be over 18 to enter this site.');
  };

  return (
    <Modal isOpen={isOpen} ariaHideApp={false}>
      <div style={{ textAlign: 'center' }} className='modal-over-age'>
        <div>
          <img src={logo} alt="" />
        </div>
        <p>Are you over the age of 21?</p>
        <button onClick={handleYes} style={{ margin: '5px', padding: '10px 20px', fontSize: '16px' }}>Yes</button>
        <button onClick={handleNo} style={{ margin: '5px', padding: '10px 20px', fontSize: '16px' }}>No</button>
      </div>
    </Modal>
  );
};

export default AgeVerificationModal;
