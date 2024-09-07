import React from 'react';
import './LoadingSpinner.css';
import loadingBeer1 from '../../assets/loading-beer-1.webp'; // Imagen fija
import loadingBeer2 from '../../assets/loading-beer-2.webp'; // Imagen de carga

const LoadingSpinner = () => {
    return (
        <div className='loading-screen'>
            <div className="beer-container">
                <img src={loadingBeer1} alt="Fixed Beer" className="fixed-beer" />
                <img src={loadingBeer2} alt="Loading Beer" className="loading-beer" />
            </div>
        </div>
    );
};

export default LoadingSpinner;