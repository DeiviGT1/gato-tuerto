import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Product from "../ui/Product";
import FilterComponent from "../layout/FilterComponent";
import FilterModal from "../layout/FilterModal";
import filterButton from "../../assets/filter-solid.svg";
import LoadingSpinner from '../ui/LoadingSpinner';
import items from './products.json';
import './Catalog.css';

const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
};

const images = importAll(require.context('./liquors', true, /\.(png|jpe?g|svg)$/));

function Catalog({ searchTerm = '' }) {
    const [selectedType, setSelectedType] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedWineType, setSelectedWineType] = useState('');
    const [selectedVarietal, setSelectedVarietal] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('search') || searchTerm;
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSelectedType(params.get('type') || '');
        setSelectedBrand(params.get('brand') || '');
        setSelectedPrice(params.get('price') || '');
        setSelectedWineType(params.get('wineType') || '');
        setSelectedVarietal(params.get('varietal') || '');
        setOrderBy(params.get('orderBy') || '');
    }, [location.search]);

    const handleFilterChange = (newType, newBrand, newPrice, newWineType, newVarietal, newOrderBy) => {
        setSelectedType(newType);
        setSelectedBrand(newBrand);
        setSelectedPrice(newPrice);
        setSelectedWineType(newWineType);
        setSelectedVarietal(newVarietal);
        setOrderBy(newOrderBy);

        const params = new URLSearchParams();
        if (newType) params.set('type', newType);
        if (newBrand) params.set('brand', newBrand);
        if (newPrice) params.set('price', newPrice);
        if (newWineType) params.set('wineType', newWineType);
        if (newVarietal) params.set('varietal', newVarietal);
        if (newOrderBy) params.set('orderBy', newOrderBy);

        navigate({ search: params.toString() });
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (!isModalOpen) {
            document.body.style.overflow = 'hidden'; // Disable background scroll
        } else {
            document.body.style.overflow = ''; // Re-enable background scroll
        }
    };

    const getAllProducts = () => {
        let allProducts = [];
        items.types.forEach(type => {
            if (selectedType === 'others') {
                if (!['whiskey', 'tequila', 'vodka', 'rum', 'wine'].includes(type.type)) {
                    type.subtypes.forEach(subtype => {
                        subtype.products.forEach(brand => {
                            if (!selectedBrand || brand.brand === selectedBrand) {
                                brand.products.forEach(product => {
                                    if (
                                        (!selectedWineType || product.wine_type === selectedWineType) &&
                                        (!selectedVarietal || product.varietal === selectedVarietal)
                                    ) {
                                        allProducts.push(product);
                                    }
                                });
                            }
                        });
                    });
                }
            } else if (!selectedType || type.type === selectedType) {
                type.subtypes.forEach(subtype => {
                    subtype.products.forEach(brand => {
                        if (!selectedBrand || brand.brand === selectedBrand) {
                            brand.products.forEach(product => {
                                if (
                                    (!selectedWineType || product.wine_type === selectedWineType) &&
                                    (!selectedVarietal || product.varietal === selectedVarietal)
                                ) {
                                    allProducts.push(product);
                                }
                            });
                        }
                    });
                });
            }
        });
        return allProducts;
    };

    const filterProducts = (products) => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };
    
    const sortProducts = (products) => {
        return products.slice().sort((a, b) => {
            const sizeA = a.sizes.find(size => size.size === "750ml");
            const sizeB = b.sizes.find(size => size.size === "750ml");
            const priceA = sizeA ? sizeA.price : 0;
            const priceB = sizeB ? sizeB.price : 0;
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            if (orderBy === 'price-asc') {
                return priceA - priceB;
            } else if (orderBy === 'price-desc') {
                return priceB - priceA;
            } else if (orderBy === 'name-asc') {
                return nameA.localeCompare(nameB);
            } else if (orderBy === 'name-desc') {
                return nameB.localeCompare(nameA);
            }
            return 0;
        });
    };

    const renderProducts = (products) => {
        products = sortProducts(products);
    
        return products.map((product) => {
            return product.sizes.map((size) => {
                const totalInventory = product.sizes.reduce((sum, size) => sum + size.inventory, 0);
                const isOutOfStock = totalInventory === 0;
    
                if (selectedPrice) {
                    const [minPrice, maxPrice] = selectedPrice.split('-').map(Number);
                    if (size.price < minPrice || size.price > maxPrice) {
                        return null;
                    }
                }
    
                return (
                    <Product
                        key={`${product.name}-${size.size}`}
                        route={product.route}
                        name={product.name}
                        price={size.price}
                        size={size.size}
                        img={images[size.img.replace('liquors/', '')]}
                        productClass={`${isOutOfStock ? 'out-of-stock' : ''}`}
                        inventory={size.inventory}
                        idSelected={size.id}
                    />
                );
            });
        }).flat();
    };
    
    const allProducts = filterProducts(getAllProducts());

    return (
        <>
            <Header />
            <div className="app-screen">
                <div className="catalog-container">
                    <button className="filter-button" onClick={toggleModal}>
                        <img src={filterButton}x alt="" />
                        
                        </button>
                    <FilterComponent
                        selectedType={selectedType}
                        selectedBrand={selectedBrand}
                        selectedPrice={selectedPrice}
                        selectedWineType={selectedWineType}
                        selectedVarietal={selectedVarietal}
                        orderBy={orderBy}
                        onFilterChange={handleFilterChange}
                    />
                    <FilterModal isOpen={isModalOpen} onClose={toggleModal}>
                        <FilterComponent
                            selectedType={selectedType}
                            selectedBrand={selectedBrand}
                            selectedPrice={selectedPrice}
                            selectedWineType={selectedWineType}
                            selectedVarietal={selectedVarietal}
                            orderBy={orderBy}
                            onFilterChange={handleFilterChange}
                        />
                    </FilterModal>
                    <div className="Catalog">
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <section>
                                <div className="card-container">
                                    {renderProducts(allProducts)}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            <Footer />
            </div>
        </>
    );
}

export default Catalog;
