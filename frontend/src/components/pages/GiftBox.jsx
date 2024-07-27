import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Product from "../ui/Product";
import FilterComponent from "../layout/FilterComponent";
import items from './products.json'; // Adjust the path according to your folder structure
import './Catalog.css';

// Helper function to dynamically import images
const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
};

// Import all images in the specified directory
const images = importAll(require.context('./liquors', true, /\.(png|jpe?g|svg)$/));

function GiftBox() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedType, setSelectedType] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSelectedType(params.get('type') || '');
        setSelectedBrand(params.get('brand') || '');
        setSelectedPrice(params.get('price') || '');
    }, [location.search]);

    const handleFilterChange = (newType, newBrand, newPrice) => {
        setSelectedType(newType);
        setSelectedBrand(newBrand);
        setSelectedPrice(newPrice);

        const params = new URLSearchParams(location.search);
        if (newType) params.set('type', newType);
        else params.delete('type');
        if (newBrand) params.set('brand', newBrand);
        else params.delete('brand');
        if (newPrice) params.set('price', newPrice);
        else params.delete('price');

        navigate({ search: params.toString() });
    };

    const renderProducts = (products) => {
        return products
            .filter(product => product.modal) // Only include products where modal is true
            .map(product => {
                const preferredSize = product.sizes.find(size => size.size === "750ml gift") || product.sizes.find(size => size.size === "750ml") || product.sizes[0];

                if (selectedPrice) {
                    const [minPrice, maxPrice] = selectedPrice.split('-').map(Number);
                    if (preferredSize.price < minPrice || preferredSize.price > maxPrice) {
                        return null; // Skip products outside the selected price range
                    }
                }

                return (
                    <Product
                        key={product.route}
                        route={product.route}
                        name={product.name}
                        price={preferredSize.price}
                        size={preferredSize.size}
                        img={images[preferredSize.img.replace('liquors/', '')]} // Adjust the path
                    />
                );
            });
    };

    const renderSubtypes = (subtypes) => {
        return subtypes.map(subtype =>
            subtype.products
                .filter(brand => !selectedBrand || brand.brand === selectedBrand)
                .map(brand => renderProducts(brand.products))
        );
    };

    const renderTypes = () => {
        return items.types
            .filter(type => !selectedType || type.type === selectedType)
            .map(type => renderSubtypes(type.subtypes));
    };

    return (
        <>
            <div className="app-screen">
                <Header />
                <FilterComponent 
                    selectedType={selectedType}
                    selectedBrand={selectedBrand}
                    selectedPrice={selectedPrice}
                    onFilterChange={handleFilterChange} 
                />
                <div className="Catalog">
                    <section>
                        <div className="card-container">
                            {renderTypes()}
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default GiftBox;
