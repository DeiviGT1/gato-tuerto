import React from 'react';
import './LoadingSpinner.css'; // Create this CSS file for styling the spinner

const LoadingSpinner = () => {
    return (
        <div className='loading-screen'>
            <div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
