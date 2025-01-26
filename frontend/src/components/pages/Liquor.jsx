// src/components/pages/Liquor.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Product from "../ui/Product";
import "./Liquor.css";
import LiquorOrder from '../ui/LiquorOrder';
import LoadingSpinner from '../ui/LoadingSpinner'; // Asegúrate de tener un componente de carga

function Liquor() {

    const { item } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const defaultSize = '750ml';
    const [currentLogo, setCurrentLogo] = useState(null);
    const [logos, setLogos] = useState({});
    const [selectedSize, setSelectedSize] = useState(defaultSize);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [inventory, setInventory] = useState(0); // Inicializado en 0

    const [items, setItems] = useState({ types: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para procesar los datos de la API
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

            // Excluir campos ya utilizados
            const { alcoholicBeverage, type: _, subtype: __, brand: ___, ...productData } = product;

            brandEntry.products.push(productData);
        });

        return { types: Object.values(typesMap) };
    }

    // Función para encontrar el producto específico
    const findProduct = (data, productRoute) => {
        for (let type of data.types) {
            for (let subtype of type.subtypes) {
                for (let brand of subtype.products) {
                    for (let product of brand.products) {
                        if (product.route === productRoute) {
                            return product;
                        }
                    }
                }
            }
        }
        return null;
    };

    // Fetch de los productos desde la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://gato-tuerto-server.vercel.app/api/products');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                const structuredData = processProductsData(data);
                setItems(structuredData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Encontrar el producto después de obtener los datos
    const product = findProduct(items, item);

    useEffect(() => {
        if (loading || error || !product) return; // Salir si aún está cargando, hay un error o el producto no se encontró

        const params = new URLSearchParams(location.search);
        const size = params.get('size') || defaultSize;
        const id = params.get('id') || product.sizes[0]?.id;
        setSelectedSize(size);
        setSelectedId(id);

        const loadImages = () => {
            const importedLogos = {};
            for (const sizeObj of product.sizes) {
                const imgPath = "/images/" + sizeObj.img; // Ruta absoluta a la imagen
                importedLogos[sizeObj.size] = imgPath;
            }
            setLogos(importedLogos);
            setCurrentLogo(importedLogos[size]);

            const sizeDetails = product.sizes.find(s => s.size === size);
            if (sizeDetails) {
                setSelectedPrice(sizeDetails.price);
                setInventory(sizeDetails.inventory || 0);
                setSelectedId(sizeDetails.id);
            } else {
                setSelectedPrice(null);
                setInventory(0);
                setSelectedId(null);
            }
        };

        loadImages();
    }, [product, location.pathname, location.search, loading, error]);

    const toggleLogo = (size) => {
        if (!logos[size]) return; // Prevenir errores si el logo no existe

        setCurrentLogo(logos[size]);
        setSelectedSize(size);
        const sizeDetails = product.sizes.find(s => s.size === size);
        if (sizeDetails) {
            setSelectedPrice(sizeDetails.price);
            setInventory(sizeDetails.inventory || 0);
            setSelectedId(sizeDetails.id);
        }

        // Actualizar la URL sin recargar la página
        const params = new URLSearchParams(location.search);
        params.set('size', size);
        params.set('id', sizeDetails?.id || '');
        navigate({ search: params.toString() }, { replace: true });
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="app-screen">
                    <div className="liquor">
                        <LoadingSpinner />
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="app-screen">
                    <div className="liquor">
                        <p>Error al cargar los productos: {error}</p>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="app-screen">
                    <div className="liquor">
                        <p>Producto no encontrado.</p>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="app-screen">
                <div className="liquor">
                    <div className='liquor-container'>
                        <div className={`liquor-image ${inventory === 0 ? 'out-of-stock' : ''}`}>
                            {inventory === 0 && <div className="warning-tape">Agotado</div>}
                            {currentLogo && <img src={currentLogo} className="App-logo" alt="logo" />}
                        </div>
                        <div className="liquor-content">
                            <div className='liquor-meta-info'>
                                <div className='liquor-size'>
                                    <p>Tamaño: {selectedSize}</p>
                                </div>
                                <div className='liquor-price'>
                                    <p>Precio: ${selectedPrice}</p>
                                </div>
                            </div>
                            <div className="liquor-sizes">
                                {Object.keys(logos).map((size) => (
                                    <button
                                        className={'liquor-size' + (selectedSize === size ? ' clicked' : '')}
                                        id={selectedSize === size ? 'clicked' : ''}
                                        key={size}
                                        onClick={() => toggleLogo(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <div className="liquor-info">
                                <h1 className='liquor-title'>{product.name}</h1>
                                <p className='liquor-description'>{product.description}</p>
                            </div>
                            <LiquorOrder maxInventory={inventory} idSelected={selectedId} inventory={inventory} />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Liquor;