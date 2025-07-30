// Puede estar en src/components/ui/ProductSection.jsx o donde prefiera

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CarouselItem from "./CarouselItem";

// El helper para filtrar puede vivir aquí o ser importado
const getProductsByType = (type, productRoutes, allProductData) => {
    if (!allProductData || !allProductData.types) return [];
    const typeData = allProductData.types.find(t => t.type === type);
    if (!typeData) return [];
    return typeData.subtypes.flatMap(s => s.products).flatMap(b => b.products)
        .filter(p => productRoutes.includes(p.route))
        .map(p => {
            const size = p.sizes.find(s => s.size === "750ml") || p.sizes[0];
            return { ...p, imgSrc: `/images/${size.img}`, price: size.price };
        });
};

const phrases = ["Explore Our Selection of:", "Discover the Best in:", "Top Picks for:"];
const getRandomPhrase = () => phrases[Math.floor(Math.random() * phrases.length)];

// AHORA ESTE COMPONENTE ES INDEPENDIENTE Y CARGA SUS DATOS
const ProductSection = ({ title, link, productType, productRoutes, responsive }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [randomPhrase] = useState(getRandomPhrase());

    useEffect(() => {
        const fetchAndSetProducts = async () => {
            try {
                // Nota: El navegador cacheará esta petición después de la primera vez,
                // por lo que no es tan ineficiente como parece.
                const response = await fetch('/products.json');
                const allProductData = await response.json();
                const filteredProducts = getProductsByType(productType, productRoutes, allProductData);
                setProducts(filteredProducts);
            } catch (error) {
                console.error(`Failed to fetch products for ${title}:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndSetProducts();
    }, [title, productType]); // Dependencias del efecto

    if (isLoading) {
        return <div className="carousel-placeholder">Loading {title}...</div>;
    }

    return (
        <section className={`home-features ${title.toLowerCase()}`}>
            <div className="section">
                <p className="section-title">{randomPhrase}&nbsp;</p>
                <Link to={link}>
                    <p className="section-link">{title}</p>
                </Link>
            </div>
            <Carousel responsive={responsive} infinite={true}>
                {products.map(product => (
                    <Link to={`/product/${product.route}`} key={product.route}>
                        <CarouselItem name={product.name} imgSrc={product.imgSrc} price={product.price} />
                    </Link>
                ))}
            </Carousel>
        </section>
    );
};

export default ProductSection;