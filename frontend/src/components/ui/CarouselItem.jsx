import React from 'react';
import './CarouselItem.css';

const CarouselItem = ({ name, imagePaths, price }) => {
    if (!imagePaths) {
      return null;
    }
    return (
        <div className="carousel-item">
      <img
        src={imagePaths.large}
        srcSet={`${imagePaths.small} 480w, ${imagePaths.large} 1024w`}
        sizes="(max-width: 464px) 50vw, (max-width: 1024px) 33vw, 20vw"
        alt={name}
        loading="lazy"
      />
                <div className="product-name">{name}</div>
                <div className="product-price">${price.toFixed(2)}</div>
        </div>
    );
};

export default CarouselItem;
