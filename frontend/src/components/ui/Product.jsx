import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Product({ route, name, price, size, img, productClass, inventory, idSelected }) {
    const titleRef = useRef(null);
    const [fontSize, setFontSize] = useState(24); // initial font size
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    if (inventory > 12) {
        inventory = 12;
    }

    const handleAddToCart = () => {
        localStorage.setItem(idSelected, JSON.stringify(selectedQuantity));

        // Dispatch the custom event 'cartUpdated' after updating localStorage
        const event = new Event('cartUpdated');
        window.dispatchEvent(event);
    };

    useEffect(() => {
        const adjustFontSize = () => {
            const maxHeight = 2.4 * 24; // 2 lines * line-height (1.2em) * initial font size (24px)
            if (titleRef.current) {
                let currentFontSize = fontSize;
                while (titleRef.current.scrollHeight > maxHeight && currentFontSize > 20) {
                    currentFontSize -= 1;
                    setFontSize(currentFontSize);
                }
            }
        };

        adjustFontSize();
    }, [name, fontSize]);

    return (
        <div className={`card ${productClass}`}>
            {productClass === 'out-of-stock' && (
                <div className="warning-tape">Out of Stock</div>
            )}
            <Link to={`/product/${route}?size=${size}&id=${idSelected}`}>
                <div className="card-image">
                    <img src={img} alt={name} />
                </div>
                <div className="card-info">
                    <div className="card-name">
                        <h2 ref={titleRef} className="card-title" style={{ fontSize: `${fontSize}px` }}>{name}</h2>
                    </div>
                    <div className="card-metadata">
                        <p className="card-price">Price: ${price}</p>
                        <p className="card-size">Size: {size}</p>
                    </div>
                    
                </div>
            </Link>
            <div className='liquor-order'>
                <select
                    className='quantity-select'
                    id="quantity-select"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                    disabled={inventory < 1}
                >
                    {[...Array(inventory).keys()].map((number) => (
                        <option key={number + 1} value={number + 1}>
                            {number + 1}
                        </option>
                    ))}
                </select>

                <button
                    className='liquor-order-button'
                    onClick={handleAddToCart}
                    disabled={inventory < 1 || selectedQuantity < 1}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default Product;
