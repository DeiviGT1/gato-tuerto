import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Modal from '../ui/Modal';
import Product from "../ui/Product";
import items from './products.json';
import "./Liquor.css";
import LiquorOrder from '../ui/LiquorOrder';

const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
    return images;
};

const images = importAll(require.context('./liquors-webp', true, /\.(png|jpe?g|svg|webp)$/));

function Liquor() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
      
    const { item } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const defaultSize = '750ml';
    const [currentLogo, setCurrentLogo] = useState(null);
    const [logos, setLogos] = useState({});
    const [selectedSize, setSelectedSize] = useState(defaultSize);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [inventory, setInventory] = useState(0); // Initialize with 0

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

    const product = findProduct(items, item);

    useEffect(() => {
        if (!product) return; // Exit if product is not found

        const params = new URLSearchParams(location.search);
        const size = params.get('size') || defaultSize;
        const id = params.get('id') || product.sizes[0]?.id;
        setSelectedSize(size);
        setSelectedId(id);

        const loadImages = async () => {
            const importedLogos = {};
            for (const sizeObj of product.sizes) {
                try {
                    const image = images[sizeObj.img.replace('liquors-webp/', '')]
                    if (image) {
                        importedLogos[sizeObj.size] = image;
                    } else {
                        console.error(`Image not found for size ${sizeObj.size}`);
                    }
                } catch (error) {
                    console.error(`Error loading image for size ${sizeObj.size}:`, error);
                }
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
    }, [product, location.pathname, location.search]);

    const toggleLogo = (size) => {
        if (!logos[size]) return; // Prevent errors if logo doesn't exist

        setCurrentLogo(logos[size]);
        setSelectedSize(size);
        const sizeDetails = product.sizes.find(s => s.size === size);
        if (sizeDetails) {
            setSelectedPrice(sizeDetails.price);
            setInventory(sizeDetails.inventory || 0);
            setSelectedId(sizeDetails.id);
        }

        // Update the URL without reloading the page
        const params = new URLSearchParams(location.search);
        params.set('size', size);
        params.set('id', sizeDetails?.id || '');
        navigate({ search: params.toString() }, { replace: true });
    };

    if (!product) {
        return (
            <>
                <Header />
                <div className="app-screen">
                    <div className="liquor">
                        <p>Product not found.</p>
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
                            {inventory === 0 && <div className="warning-tape">Out of Stock</div>}
                            {currentLogo && <img src={currentLogo} className="App-logo" alt="logo" />}
                        </div>
                        <div className="liquor-content">
                            <div className='liquor-meta-info'>
                                <div className='liquor-size'>
                                    <p>Size: {selectedSize} </p>
                                </div>
                                <div className='liquor-price'>
                                    <p>Price: ${selectedPrice} </p>
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