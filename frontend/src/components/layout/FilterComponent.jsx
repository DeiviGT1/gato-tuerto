import React, { useState, useEffect } from 'react';
import './FilterComponent.css';
import items from '../pages/products.json';

function FilterComponent({ selectedType, selectedSubtype, selectedBrand, selectedPrice, orderBy, selectedWineType, selectedVarietal, onFilterChange }) {

    const [brands, setBrands] = useState([]);
    const [wineTypes, setWineTypes] = useState([]);
    const [varietals, setVarietals] = useState([]);
    const [subtypes, setSubtypes] = useState([]);

    useEffect(() => {
        let allBrands = [];
        let allWineTypes = [];
        let allVarietals = [];
        let allSubtypes = [];

        items.types.forEach(type => {
            if (!selectedType || type.type === selectedType || selectedType === 'others' && !['whiskey', 'tequila', 'vodka', 'rum', 'wine'].includes(type.type)) {
                type.subtypes.forEach(subtype => {
                    allSubtypes.push(subtype.subtype);

                    if (!selectedSubtype || selectedSubtype === subtype.subtype) {
                        subtype.products.forEach(product => {
                            allBrands.push(product.brand);

                            product.products.forEach(p => {
                                if (p.wine_type) allWineTypes.push(p.wine_type);
                                if (p.varietal) allVarietals.push(p.varietal);
                            });
                        });
                    }
                });
            }
        });

        setBrands([...new Set(allBrands)]);
        setWineTypes([...new Set(allWineTypes)]);
        setVarietals([...new Set(allVarietals)]);
        setSubtypes([...new Set(allSubtypes)]);
    }, [selectedType, selectedSubtype, selectedWineType, selectedVarietal]);

    const handleTypeChange = (e) => {
        const newSelectedType = e.target.value;
        onFilterChange(newSelectedType, "", "", "", "", "", orderBy); 
    };

    const handleSubtypeChange = (e) => {
        onFilterChange(selectedType, e.target.value, "", selectedPrice, "", "", orderBy);
    };

    const handleBrandChange = (e) => {
        onFilterChange(selectedType, selectedSubtype, e.target.value, selectedPrice, selectedWineType, selectedVarietal, orderBy);
    };

    const handlePriceChange = (e) => {
        onFilterChange(selectedType, selectedSubtype, selectedBrand, e.target.value, selectedWineType, selectedVarietal, orderBy);
    };

    const handleOrderByChange = (e) => {
        onFilterChange(selectedType, selectedSubtype, selectedBrand, selectedPrice, selectedWineType, selectedVarietal, e.target.value);
    };

    const handleWineTypeChange = (e) => {
        const newWineType = e.target.value;
        onFilterChange(selectedType, selectedSubtype, selectedBrand, selectedPrice, newWineType, selectedVarietal, orderBy); 
    };

    const handleVarietalChange = (e) => {
        const newVarietal = e.target.value;
        onFilterChange(selectedType, selectedSubtype, selectedBrand, selectedPrice, selectedWineType, newVarietal, orderBy);
    };

    const handleResetFilters = () => {
        onFilterChange("", "", "", "", "", "", ""); 
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
                <label>Subtype:</label>
                <select value={selectedSubtype} onChange={handleSubtypeChange}>
                    <option value="">All</option>
                    {subtypes.map(subtype => {
                        const formattedSubtype = subtype
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, char => char.toUpperCase());

                        return (
                            <option key={subtype} value={subtype}>
                                {formattedSubtype}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div>
                <label>Brand:</label>
                <select value={selectedBrand} onChange={handleBrandChange}>
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
