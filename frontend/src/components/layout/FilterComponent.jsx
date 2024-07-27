import React, { useState, useEffect } from 'react';
import './FilterComponent.css';
import items from '../pages/products.json'; // Adjust the path as per your folder structure

function FilterComponent({ selectedType, selectedBrand, selectedPrice, orderBy, onFilterChange }) {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        if (selectedType) {
            let newBrands = [];
            if (selectedType === 'others') {
                items.types.forEach(type => {
                    if (!['whiskey', 'tequila', 'vodka', 'rum', 'wine'].includes(type.type)) {
                        type.subtypes.forEach(subtype => {
                            subtype.products.forEach(product => {
                                newBrands.push(product.brand);
                            });
                        });
                    }
                });
            } else {
                const selectedTypeData = items.types.find(type => type.type === selectedType);
                if (selectedTypeData) {
                    newBrands = selectedTypeData.subtypes.flatMap(subtype =>
                        subtype.products.map(product => product.brand)
                    );
                }
            }
            setBrands([...new Set(newBrands)]);
        } else {
            setBrands([]);
        }
    }, [selectedType]);

    const handleTypeChange = (e) => {
        onFilterChange(e.target.value, selectedBrand, selectedPrice, orderBy);
    };

    const handleBrandChange = (e) => {
        onFilterChange(selectedType, e.target.value, selectedPrice, orderBy);
    };

    const handlePriceChange = (e) => {
        onFilterChange(selectedType, selectedBrand, e.target.value, orderBy);
    };

    const handleOrderByChange = (e) => {
        onFilterChange(selectedType, selectedBrand, selectedPrice, e.target.value);
    };

    return (
        <div className="FilterComponent">
            <div>
                <label>Type:</label>
                <select value={selectedType} onChange={handleTypeChange}>
                    <option value="">All</option>
                    <option value="whiskey">Whiskey</option>
                    <option value="tequila">Tequila</option>
                    <option value="vodka">Vodka</option>
                    <option value="rum">Rum</option>
                    <option value="wine">Wine</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div>
                <label>Brand:</label>
                <select value={selectedBrand} onChange={handleBrandChange} disabled={!selectedType}>
                    <option value="">All</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Price (750ml):</label>
                <select value={selectedPrice} onChange={handlePriceChange}>
                    <option value="">All</option>
                    <option value="11.99-22.99">11.99 - 22.99</option>
                    <option value="23-29.99">23 - 29.99</option>
                    <option value="30-38.99">30 - 38.99</option>
                    <option value="39-48.99">39 - 48.99</option>
                    <option value="49-62.99">49 - 62.99</option>
                    <option value="63-10000">63 - 10000</option>
                </select>
            </div>
            <div>
                <label>Order By:</label>
                <select value={orderBy} onChange={handleOrderByChange}>
                    <option value="">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                </select>
            </div>
        </div>
    );
}

export default FilterComponent;
