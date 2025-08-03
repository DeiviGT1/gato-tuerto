import React, { useState, useEffect } from 'react';
import './FilterComponent.css';
import items from '../pages/products.json';

function FilterComponent({
    selectedType,
    selectedSubtype,
    selectedBrand,
    selectedPrice,
    selectedSize,
    orderBy,
    selectedWineType,
    selectedVarietal,
    onFilterChange
}) {
    const [brands, setBrands] = useState([]);
    const [wineTypes, setWineTypes] = useState([]);
    const [varietals, setVarietals] = useState([]);
    const [subtypes, setSubtypes] = useState([]);
    const [sizes, setSizes] = useState([]);

    const predefinedTypes = [
        "whiskey",
        "tequila",
        "vodka",
        "rum",
        "wine",
        "gin",
        "cognac",
        "brandy",
        "mezcal",
        "aguardiente",
        "liquors",
        "beer",
    ];

    useEffect(() => {
        let allBrands = [];
        let allWineTypes = [];
        let allVarietals = [];
        let allSubtypes = [];
        let allSizes = [];
        let otherAdded = false;

        const sizeToMl = (size) => {
            if (size.includes("oz")) {
                return parseFloat(size) * 29.5735; // Convertir onzas a mililitros
            } else if (size.includes("ml")) {
                return parseFloat(size);
            } else if (size.includes("L")) {
                return parseFloat(size) * 1000;
            } else if (size.includes("PET")) {
                return parseFloat(size) * 1000; // Tratar "PET" como mililitros
            }
            return 0;
        };

        items.types.forEach(type => {
            const isSelectedType =
                !selectedType ||
                (selectedType !== 'other' && type.type === selectedType) ||
                (selectedType === 'cognac' && (type.type === 'cognac' || type.type === 'brandy')) ||
                (selectedType === 'brandy' && (type.type === 'cognac' || type.type === 'brandy')) ||
                (selectedType === 'other' && !predefinedTypes.includes(type.type));

            if (isSelectedType) {
                type.subtypes.forEach(subtype => {
                    allSubtypes.push(subtype.subtype);

                    if (!selectedSubtype || selectedSubtype === subtype.subtype) {
                        subtype.products.forEach(product => {
                            allBrands.push(product.brand);

                            product.products.forEach(p => {
                                if (p.wine_type) allWineTypes.push(p.wine_type);
                                if (p.varietal) allVarietals.push(p.varietal);
                                if (p.sizes) {
                                    p.sizes.forEach(size => {
                                        if (size.size.includes("oz")) {
                                            if (!otherAdded) {
                                                allSizes.push("Other");
                                                otherAdded = true;
                                            }
                                        } else if (size.size === "750 PET" || size.size === "750") {
                                            allSizes.push("750 PET");
                                            allSizes.push("750");
                                        } else {
                                            allSizes.push(size.size);
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });

        // Remove duplicates and sort sizes by their milliliter value
        const uniqueSizes = [...new Set(allSizes)].sort((a, b) => sizeToMl(a) - sizeToMl(b));

        setBrands([...new Set(allBrands)].sort());
        setWineTypes([...new Set(allWineTypes)].sort());
        setVarietals([...new Set(allVarietals)].sort());
        setSubtypes([...new Set(allSubtypes)].sort());
        setSizes(uniqueSizes);
    }, [
        selectedType,
        selectedSubtype,
        selectedWineType,
        selectedVarietal,
    ]);

    const handleTypeChange = (e) => {
        const newSelectedType = e.target.value;
        onFilterChange(newSelectedType, selectedSubtype, "", "", "", "", "", orderBy); 
    };

    const handleSubtypeChange = (e) => {
        onFilterChange(selectedType, e.target.value, "", selectedPrice, selectedSize, "", orderBy);
    };

    const handleBrandChange = (e) => {
        onFilterChange(selectedType, selectedSubtype, e.target.value, selectedPrice, selectedSize, selectedWineType, selectedVarietal, orderBy);
    };

    const handlePriceChange = (e) => {
        onFilterChange(selectedType, selectedSubtype, selectedBrand, e.target.value, selectedSize, selectedWineType, selectedVarietal, orderBy);
    };

    const handleSizeChange = (e) => {
        onFilterChange(selectedType, selectedSubtype, selectedBrand, selectedPrice, e.target.value, selectedWineType, selectedVarietal, orderBy);
    };

    const handleOrderByChange = (e) => {
        onFilterChange(selectedType, selectedSubtype, selectedBrand, selectedPrice, selectedSize, selectedWineType, selectedVarietal, e.target.value);
    };

    const handleWineTypeChange = (e) => {
        const newWineType = e.target.value;
        onFilterChange(selectedType, selectedSubtype, selectedBrand, selectedPrice, selectedSize, newWineType, selectedVarietal, orderBy); 
    };

    const handleVarietalChange = (e) => {
        const newVarietal = e.target.value;
        onFilterChange(selectedType, selectedSubtype, selectedBrand, selectedPrice, selectedSize, selectedWineType, newVarietal, orderBy);
    };

    const handleResetFilters = () => {
        onFilterChange("", "", "", "", "", "", "", ""); 
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
                    <option value="gin">Gin</option>
                    <option value="cognac">Cognac/Brandy</option>
                    <option value="mezcal">Mezcal</option>
                    <option value="aguardiente">Aguardiente</option>
                    <option value="liquors">Liquors</option>
                    <option value="beer">Beer</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label>Country:</label>
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
                <label>Size:</label>
                <select value={selectedSize} onChange={handleSizeChange}>
                    <option value="">All</option>
                    {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Wine Type:</label>
                <select
                    value={selectedWineType}
                    onChange={handleWineTypeChange}
                    disabled={selectedType !== 'wine'}
                >
                    <option value="">All</option>
                    {wineTypes.map(wineType => (
                        <option key={wineType} value={wineType}>{wineType}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Varietal:</label>
                <select
                    value={selectedVarietal}
                    onChange={handleVarietalChange}
                    disabled={selectedType !== 'wine'}
                >
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
                    <option value="0-20.99">0 - 19.99</option>
                    <option value="20-39.99">20 - 39.99</option>
                    <option value="40-69.99">40 - 69.99</option>
                    <option value="70-129.99">70 - 129.99</option>
                    <option value="130-169.99">130 - 169.99</option>
                    <option value="170-10000">170 - 10000</option>
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