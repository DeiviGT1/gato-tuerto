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

const images = importAll(require.context('./liquors-webp', true, /\.(png|jpe?g|svg|webp)$/));

function Catalog({ searchTerm = '' }) {
    const [selectedType, setSelectedType] = useState('');
    const [selectedSubtype, setSelectedSubtype] = useState(''); 
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedSize, setSelectedSize] = useState(''); // New size filter
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
        setSelectedSubtype(params.get('subtype') || ''); 
        setSelectedBrand(params.get('brand') || '');
        setSelectedPrice(params.get('price') || '');
        setSelectedSize(params.get('size') || ''); // New size filter
        setSelectedWineType(params.get('wineType') || '');
        setSelectedVarietal(params.get('varietal') || '');
        setOrderBy(params.get('orderBy') || '');
    }, [location.search]);

    const handleFilterChange = (newType, newSubtype, newBrand, newPrice, newSize, newWineType, newVarietal, newOrderBy) => {
        // Si se selecciona "Other", establece newSize en "Other"
        if (newSize === "Other") {
            newSize = "Other";
        }
    
        setSelectedType(newType);
        setSelectedSubtype(newSubtype);
        setSelectedBrand(newBrand);
        setSelectedPrice(newPrice);
        setSelectedSize(newSize); 
        setSelectedWineType(newWineType);
        setSelectedVarietal(newVarietal);
        setOrderBy(newOrderBy);
    
        const params = new URLSearchParams();
        if (newType) params.set('type', newType);
        if (newSubtype) params.set('subtype', newSubtype);
        if (newBrand) params.set('brand', newBrand);
        if (newPrice) params.set('price', newPrice);
        if (newSize && newSize !== "Other") params.set('size', newSize); 
        if (newWineType) params.set('wineType', newWineType);
        if (newVarietal) params.set('varietal', newVarietal);
        if (newOrderBy) params.set('orderBy', newOrderBy);
    
        navigate({ search: params.toString() });
    };
    

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (!isModalOpen) {
            document.body.style.overflow = 'hidden'; 
        } else {
            document.body.style.overflow = ''; 
        }
    };

    const getAllProducts = () => {
        let allProducts = [];
        items.types.forEach(type => {
            if (
                !selectedType ||
                type.type === selectedType ||
                (selectedType === 'cognac' && type.type === 'brandy') ||
                (selectedType === 'brandy' && type.type === 'cognac')
            ) {
                type.subtypes.forEach(subtype => {
                    if (!selectedSubtype || subtype.subtype === selectedSubtype) {
                        subtype.products.forEach(brand => {
                            if (!selectedBrand || brand.brand === selectedBrand) {
                                brand.products.forEach(product => {
                                    product.sizes.forEach(size => {
                                        if (
                                            (!selectedWineType || product.wine_type === selectedWineType) &&
                                            (!selectedVarietal || product.varietal === selectedVarietal) &&
                                            (selectedSize === "Other" ? size.size.includes("oz") : (!selectedSize || size.size === selectedSize))
                                        ) {
                                            allProducts.push({
                                                ...product,
                                                size,
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
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
            const priceA = a.size.price || 0;
            const priceB = b.size.price || 0;
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
        const isOutOfStock = product.size.inventory === 0;

        if (selectedPrice) {
            const [minPrice, maxPrice] = selectedPrice.split('-').map(Number);
            if (product.size.price < minPrice || product.size.price > maxPrice) {
                return null;
            }
        }

        // Reemplazar "-" por " " en el tamaño (size)
        const formattedSize = product.size.size.replace(/-/g, ' ');

        return (
            <Product
                key={`${product.name}-${formattedSize}`}
                route={product.route}
                name={product.name}
                price={product.size.price}
                size={formattedSize}  // Usar el tamaño formateado
                img={images[product.size.img.replace('liquors-webp/', '')]}
                productClass={`${isOutOfStock ? 'out-of-stock' : ''}`}
                inventory={product.size.inventory}
                idSelected={product.size.id}
            />
        );
    });
};


    const allProducts = filterProducts(getAllProducts());

    return (
        <>
            <Header />
            <div className="app-screen">
                <div className="catalog-container">
                    <button className="filter-button" onClick={toggleModal}>
                        <img src={filterButton} alt="" />
                    </button>
                    <FilterComponent
                        selectedType={selectedType}
                        selectedSubtype={selectedSubtype} 
                        selectedBrand={selectedBrand}
                        selectedPrice={selectedPrice}
                        selectedSize={selectedSize} // New size filter
                        selectedWineType={selectedWineType}
                        selectedVarietal={selectedVarietal}
                        orderBy={orderBy}
                        onFilterChange={handleFilterChange}
                    />
                    <FilterModal isOpen={isModalOpen} onClose={toggleModal}>
                        <FilterComponent
                            selectedType={selectedType}
                            selectedSubtype={selectedSubtype} 
                            selectedBrand={selectedBrand}
                            selectedPrice={selectedPrice}
                            selectedSize={selectedSize} // New size filter
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
