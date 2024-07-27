import React, { useState, useEffect } from 'react';
import './Footer.css';

function Footer() {
  const [hours, setHours] = useState('');

  useEffect(() => {
    const today = new Date().getDay();
    if (today === 5 || today === 6) { // 5 is Friday and 6 is Saturday
      setHours('9:00 am - 1:00 am');
    } else {
      setHours('9:00 am - 12:00 am');
    }
  }, []);

  return (
    <div className='App-footer'>
      <footer>
        <div className='footer-section'>
          <p className='footer-address'>Address: 476 SW 8th St</p>
          <p className='footer-number'>Number: (305) - 854 - 8576</p>
          <p className='footer-hours'>Open today: {hours}</p>
        </div>
        <div className='footer-section policies'>
          <div>
            <p className="copyright">Copyright © 2024 El Gato Tuerto - All Rights Reserved.</p>
            <div className='links'>
              <a href="">
                <p>PRIVACY POLICY</p>
              </a>
              <a href="">
                <p>TERMS AND CONDITIONS</p>
              </a>
            </div>
          </div>
        </div>

        <div className='footer-section map'>
        <iframe
          title="Liquor Store Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.3692473716744!2d-80.2048746!3d25.7660274!2m3!1f0!2f0!3f1!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b68ef0468205%3A0x77e4989b3a7955f2!2sEl%20Gato%20Tuerto%20Liquors!5e0!3m2!1sen!2sus!15sdata=!3m1!4b1!4m5!3m4!1s0x88d9b68ef0468205:0x77e4989b3a7955f2!8m2!3d25.7660274!4d-80.2022997"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>

        </div>
      </footer>
    </div>
  );
}

export default Footer;
