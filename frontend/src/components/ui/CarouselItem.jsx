import React from 'react';
import './CarouselItem.css';

const CarouselItem = ({ name, imgSrc, price }) => {
    return (
        <div className="carousel-item">
                <img
                    src={imgSrc}
                    alt={name}
                    className="product-image"
                    loading='lazy'
                />
                <div className="product-name">{name}</div>
                <div className="product-price">${price.toFixed(2)}</div>
        </div>
    );
};

export default CarouselItem;
