import React, { useState } from 'react';

function LiquorOrder( { maxInventory, idSelected } ) {
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    if (maxInventory > 12) {
        maxInventory = 12;
    }

    const handleAddToCart = () => {
        localStorage.setItem(idSelected, JSON.stringify(selectedQuantity));
    };

    return (
        <div className='liquor-order'>
            <select
                id="quantity-select"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
            >
                {[...Array(maxInventory).keys()].map((number) => (
                    <option key={number + 1} value={number + 1}>
                        {number + 1}
                    </option>
                ))}
            </select>

            <button
                className='liquor-order-button'
                onClick={handleAddToCart}
                disabled={selectedQuantity < 1}
            >
                Add to Cart
            </button>
        </div>
    );
}

export default LiquorOrder;
