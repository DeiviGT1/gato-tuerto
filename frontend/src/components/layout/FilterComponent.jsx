// src/layout/FilterComponent.jsx

import React, { useState, useEffect } from 'react';
import './FilterComponent.css';
import items from '../pages/products.json';

function FilterComponent({ selectedType, selectedBrand, selectedPrice, orderBy, selectedWineType, selectedVarietal, onFilterChange }) {

    const [brands, setBrands] = useState([]);
    const [wineTypes, setWineTypes] = useState([]);
    const [varietals, setVarietals] = useState([]);

    useEffect(() => {
        let allBrands = [];
        let allWineTypes = [];
        let allVarietals = [];

        if (selectedType === 'wine') {
            items.types.forEach(type => {
                if (type.type === 'wine') {
                    type.subtypes.forEach(subtype => {
                        subtype.products.forEach(product => {
                            const matchesWineType = !selectedWineType || product.products.some(p => p.wine_type === selectedWineType);
                            const matchesVarietal = !selectedVarietal || product.products.some(p => p.varietal === selectedVarietal);

                            if (matchesWineType && matchesVarietal) {
                                allBrands.push(product.brand);
                            }

                            product.products.forEach(p => {
                                if (!selectedWineType || p.wine_type === selectedWineType) {
                                    if (p.varietal) allVarietals.push(p.varietal);
                                }
                                if (!selectedVarietal || p.varietal === selectedVarietal) {
                                    if (p.wine_type) allWineTypes.push(p.wine_type);
                                }
                            });
                        });
                    });
                }
            });

            setBrands([...new Set(allBrands)]);
            setWineTypes([...new Set(allWineTypes)]);
            setVarietals([...new Set(allVarietals)]);
        } else {
            setBrands([]);
            setWineTypes([]);
            setVarietals([]);
        }
    }, [selectedType, selectedWineType, selectedVarietal]);

    const handleTypeChange = (e) => {
        const newSelectedType = e.target.value;
        onFilterChange(newSelectedType, "", "", "", "", orderBy); 
    };

    const handleBrandChange = (e) => {
        onFilterChange(selectedType, e.target.value, selectedPrice, selectedWineType, selectedVarietal, orderBy);
    };

    const handlePriceChange = (e) => {
        onFilterChange(selectedType, selectedBrand, e.target.value, selectedWineType, selectedVarietal, orderBy);
    };

    const handleOrderByChange = (e) => {
        onFilterChange(selectedType, selectedBrand, selectedPrice, selectedWineType, selectedVarietal, e.target.value);
    };

    const handleWineTypeChange = (e) => {
        const newWineType = e.target.value;
        onFilterChange(selectedType, "", selectedPrice, newWineType, selectedVarietal, orderBy); 
    };

    const handleVarietalChange = (e) => {
        const newVarietal = e.target.value;
        onFilterChange(selectedType, "", selectedPrice, selectedWineType, newVarietal, orderBy);
    };

    const handleResetFilters = () => {
        onFilterChange("", "", "", "", "", ""); 
    };

    return (
        <div className="FilterComponent">
            <button className="reset-button" onClick={handleResetFilters}>Reset Filters</button>
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
                <label>Wine Type:</label>
                <select value={selectedWineType} onChange={handleWineTypeChange} disabled={selectedType !== 'wine'}>
                    <option value="">All</option>
                    {wineTypes.map(wineType => (
                        <option key={wineType} value={wineType}>{wineType}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Varietal:</label>
                <select value={selectedVarietal} onChange={handleVarietalChange} disabled={selectedType !== 'wine'}>
                    <option value="">All</option>
                    {varietals.map(v => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Price:</label>
                <select value={selectedPrice} onChange={handlePriceChange}>
                    <option value="">All</option>
                    <option value="11.99-20.99">11.99 - 20.99</option>
                    <option value="21-27.99">21 - 27.99</option>
                    <option value="28-42.99">28 - 42.99</option>
                    <option value="43-73.99">43 - 73.99</option>
                    <option value="74-136.99">74 - 136.99</option>
                    <option value="137-10000">137 - 10000</option>
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
