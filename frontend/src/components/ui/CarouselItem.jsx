import React from 'react';
import './CarouselItem.css';

const CarouselItem = ({ name, imgSrc, price }) => {
    return (
        <div className="carousel-item">
            <a href="#">
                <img
                    src={imgSrc}
                    alt={name}
                    className="product-image"
                />
                <div className="product-name">{name}</div>
                <div className="product-price">${price.toFixed(2)}</div>
            </a>
        </div>
    );
};

export default CarouselItem;
