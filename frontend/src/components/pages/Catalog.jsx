import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Product from "../ui/Product";
import FilterComponent from "../layout/FilterComponent";
import FilterModal from "../layout/FilterModal";
import filterButton from "../../assets/filter-solid.svg";
import LoadingSpinner from '../ui/LoadingSpinner';
import arrowUp from '../../assets/arrow-up-solid.svg';
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
    const [selectedSize, setSelectedSize] = useState(''); 
    const [selectedWineType, setSelectedWineType] = useState('');
    const [selectedVarietal, setSelectedVarietal] = useState('');
    const [orderBy, setOrderBy] = useState('');
    //const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false); 
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset); // Track previous scroll position

    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('search') || searchTerm;

    // Inside Catalog component
    const [items, setItems] = useState({ types: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
        try {
        const response = await fetch('https://gato-tuerto-server.vercel.app/api/products');
        const data = await response.json();

        const structuredData = processProductsData(data);
        setItems(structuredData);
        setLoading(false);
        } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        }
    };

    fetchData();
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSelectedType(params.get('type') || '');
        setSelectedSubtype(params.get('subtype') || ''); 
        setSelectedBrand(params.get('brand') || '');
        setSelectedPrice(params.get('price') || '');
        setSelectedSize(params.get('size') || ''); 
        setSelectedWineType(params.get('wineType') || '');
        setSelectedVarietal(params.get('varietal') || '');
        setOrderBy(params.get('orderBy') || '');
    }, [location.search]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isScrollingDown = currentScrollPos < prevScrollPos;

            setShowScrollButton(isScrollingDown && currentScrollPos > 300);

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    const handleFilterChange = (newType, newSubtype, newBrand, newPrice, newSize, newWineType, newVarietal, newOrderBy) => {
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
    
    function processProductsData(data) {
        const typesMap = {};
      
        data.forEach(product => {
          const { type, subtype, brand } = product;
      
          if (!typesMap[type]) {
            typesMap[type] = {
              type,
              subtypes: [],
            };
          }
      
          let subtypeEntry = typesMap[type].subtypes.find(st => st.subtype === subtype);
          if (!subtypeEntry) {
            subtypeEntry = {
              subtype,
              products: [],
            };
            typesMap[type].subtypes.push(subtypeEntry);
          }
      
          let brandEntry = subtypeEntry.products.find(b => b.brand === brand);
          if (!brandEntry) {
            brandEntry = {
              brand,
              products: [],
            };
            subtypeEntry.products.push(brandEntry);
          }
      
          // Exclude fields already used
          const { alcoholicBeverage, type: _, subtype: __, brand: ___, ...productData } = product;
      
          brandEntry.products.push(productData);
        });
      
        return { types: Object.values(typesMap) };
      }
    

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

        const formattedSize = product.size.size.replace(/-/g, ' ');

        return (
            <Product
                key={`${product.name}-${formattedSize}`}
                route={product.route}
                name={product.name}
                price={product.size.price}
                size={formattedSize}
                img={images[product.size.img.replace('liquors-webp/', '')]}
                productClass={`${isOutOfStock ? 'out-of-stock' : ''}`}
                inventory={product.size.inventory}
                idSelected={product.size.id}
            />
        );
    });
};


    const allProducts = filterProducts(getAllProducts());

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                        selectedSize={selectedSize} 
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
                            selectedSize={selectedSize} 
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
                        {showScrollButton && (
                            <button className={`scroll-to-top ${showScrollButton ? 'show' : ''}`} onClick={scrollToTop}>
                                <img src={arrowUp} alt="" />
                            </button>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Catalog;
