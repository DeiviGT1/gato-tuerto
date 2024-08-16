import React, { useState } from 'react';

function LiquorOrder({ maxInventory, idSelected, inventory }) {
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    if (maxInventory > 12) {
        maxInventory = 12;
    }

    const handleAddToCart = () => {
        if (inventory > 0) {
            localStorage.setItem(idSelected, JSON.stringify(selectedQuantity));

            // Dispatch the custom event 'cartUpdated' after updating localStorage
            const event = new Event('cartUpdated');
            window.dispatchEvent(event);
        }
    };

    return (
        <div className='liquor-order'>
            <select
                className='quantity-select'
                id="quantity-select"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                disabled={inventory < 1}
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
                disabled={inventory < 1 || selectedQuantity < 1}
            >
                Add to Cart
            </button>
        </div>
    );
}

export default LiquorOrder;
