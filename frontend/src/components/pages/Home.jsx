import React, { useEffect, useState } from 'react';
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './Home.css';
import CarouselItem from "../ui/CarouselItem";
import { Link } from 'react-router-dom';
import productData from './products.json';
import bannerSmirnoff from '../../assets/banner-smirnoff.png';
import bannerCointreau from '../../assets/banner-cointreau.png';
import bannerGranCentenario from '../../assets/banner-gran-centenario.png';
import bannerJohnnieWalker from '../../assets/banner-johnnie-walker.png';
import welcomeBanner from '../../assets/banner-welcome.png';
import bannerSmirnoffCel from '../../assets/banner-smirnoff-cel.png';
import bannerCointreauCel from '../../assets/banner-cointreau-cel.png';
import bannerGranCentenarioCel from '../../assets/banner-gran-centenario-cel.png';
import bannerJohnnieWalkerCel from '../../assets/banner-johnnie-walker-cel.png';
import bannerWelcomeCel from '../../assets/banner-welcome-cel.png';
import mainWhiskey from '../pages/liquors/whiskey/scotch/macallan/macallan-18-double-oak/macallan-18-double-oak-750ml.png';
import mainTequila from '../pages/liquors/tequila/jalisco/clase-azul/clase-azul-reposado/clase-azul-reposado-750ml.png';
import mainRum from '../pages/liquors/rum/guatemalan/zacapa/zacapa-23/zacapa-23-750ml.png';
import mainVodka from '../pages/liquors/vodka/french/ciroc/ciroc-vodka/ciroc-vodka-750ml.png';
import mainWine from '../pages/liquors/wine/american/caymus/caymus-cabernet-sauvignon/caymus-cabernet-sauvignon-750ml.png';


// Step 1: Import all images dynamically
const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
    return images;
};

const images = importAll(require.context('./liquors', true, /\.(png|jpe?g|svg)$/));

// Step 2: Create a function to get products by type
const getProductsByType = (type, productRoutes) => {
    return productData.types
        .find(t => t.type === type)
        .subtypes.flatMap(subtype => subtype.products)
        .flatMap(brand => brand.products)
        .filter(product => productRoutes.includes(product.route))
        .map(product => {
            const preferredSize = product.sizes.find(size => size.size === "750ml") || product.sizes[0];
            const imgSrc = images[preferredSize.img.replace('liquors/', '')];
            return { ...product, imgSrc, price: preferredSize.price };
        });
};

// Step 3: Create a reusable Banner component
const Banner = ({ desktopSrc, mobileSrc, altText, isMobile }) => (
    <div className='banner'>
        <img src={isMobile ? mobileSrc : desktopSrc} alt={altText} />
    </div>
);

// Step 4: Create a reusable ProductSection component
const ProductSection = ({ title, link, products, responsive }) => (
    <section className={`home-features ${title.toLowerCase()}`}>
        <div className="section">
            <p>Check our variety of:&nbsp;</p>
            <a href={link}>
                <p>{title}</p>
            </a>
        </div>
        <Carousel responsive={responsive}>
            {products.map(product => (
                <Link to={`/product/${product.route}`} key={product.route}>
                    <CarouselItem
                        name={product.name}
                        imgSrc={product.imgSrc}
                        price={product.price}
                    />
                </Link>
            ))}
        </Carousel>
    </section>
);

// Add this debounce function at the top of your file
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


// Step 5: Implement the Home component
function Home() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 900);
        const debouncedResize = debounce(handleResize, 200);

        window.addEventListener('resize', debouncedResize);
        return () => window.removeEventListener('resize', debouncedResize);
    }, []);

    // Step 2: Define product categories and fetch data
    const whiskys = [
        'courage-conviction-cuvee-single-malt',
        'buchanans-master',
        'buchanans-18',
        'courage-conviction-bourbon-cask-single-malt',
        'chivas-regal-18',
        'glenlivet-14',
        'glenfidich-18',
        'macallan-15-double-cask',
        'kentucky-owl-bourbon-batch',
        'colonel-eh-taylor-single-barrel',
        'suntory-hibiki'
    ];

    const tequilas = [
        'maestro-dobel-diamante',
        '1800-cristalino',
        'don-julio-1942',
        'clase-azul-reposado',
        'patron-silver',
        'don-julio-reposado',
        'mijenta-blanco',
        'partida-reposado',
        'casamigos-blanco',
        'cincoro-gold',
        'herradura-reposado',
        'gran-coramino-cristalino-reposado',
    ];

    const vodkas = [
        'grey-goose-vodka',
        'ciroc-vodka',
        'au-vodka',
        'absolut-vodka',
        'monte-carlo-vodka',
        'titos-vodka',
        'avorza-vodka',
        'ketel-one-vodka',
        'new-amsterdam-vodka',
    ];

    const rums = [
        'bacardi-limon',
        'botran-12-year',
        'botran-18-year',
        'diplomatico-reserva-exclusiva',
        'diplomatico-planas',
        'diplomatico-vintage-2007',
        'flor-de-cana-7',
        'flor-de-cana-18',
        'brugal-1888'
    ];

    const wines = [
        'caymus-cabernet-sauvignon',
        'prisoner-red-blend',
        'silver-oak-cabernet-sauvignon',
        'belle-glos-pinot-noir',
        'bouchard-aine-fils-puligny-montrachet',
        'tignanello-toscana',
        'santa-margherita-pinot-grigio',
    ];

    const responsivee = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 9
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
        }
    };

    // Step 2: Fetch product data
    const whiskyProducts = getProductsByType("whiskey", whiskys);
    const tequilaProducts = getProductsByType("tequila", tequilas);
    const vodkaProducts = getProductsByType("vodka", vodkas);
    const rumProducts = getProductsByType("rum", rums);
    const wineProducts = getProductsByType("wine", wines);

    return (
        <>
            <Header />
            <div className="app-screen">
                <div className="home">
                    <div className='welcome'>
                        <div>
                            <img src={isMobile ? bannerWelcomeCel : welcomeBanner} alt="Welcome Banner" />
                        </div>
                    </div>

                    <div>
                        <section className='section-main-types'>
                            <Carousel responsive={responsivee}>
                                <div>
                                    <Link to="/catalog?type=whiskey">
                                        <p className='section-main-types-title'>Whiskey</p>
                                        <img src={mainWhiskey} alt="" />
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/catalog?type=tequila">
                                        <p className='section-main-types-title'>Tequila</p>
                                        <img src={mainTequila} alt="" />
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/catalog?type=rum">
                                        <p className='section-main-types-title'>Rum</p>
                                        <img src={mainRum} alt="" />
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/catalog?type=vodka">
                                        <p className='section-main-types-title'>Vodka</p>
                                        <img src={mainVodka} alt="" />
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/catalog?type=wine">
                                        <p className='section-main-types-title'>Wine</p>
                                        <img src={mainWine} alt="" />
                                    </Link>
                                </div>
                            </Carousel>
                        </section>
                    </div>
                    
                    <ProductSection title="Whiskeys" link="/catalog?type=whiskey" products={whiskyProducts} responsive={responsivee} />
                    <Banner desktopSrc={bannerJohnnieWalker} mobileSrc={bannerJohnnieWalkerCel} altText="Johnnie Walker Banner" isMobile={isMobile} />

                    <ProductSection title="Tequila" link="/catalog?type=tequila" products={tequilaProducts} responsive={responsivee} />
                    <Banner desktopSrc={bannerGranCentenario} mobileSrc={bannerGranCentenarioCel} altText="Gran Centenario Banner" isMobile={isMobile} />

                    <ProductSection title="Vodka" link="catalog?type=vodka" products={vodkaProducts} responsive={responsivee} />
                    <Banner desktopSrc={bannerSmirnoff} mobileSrc={bannerSmirnoffCel} altText="Smirnoff Banner" isMobile={isMobile} />

                    <ProductSection title="Rum" link="catalog?type=rum" products={rumProducts} responsive={responsivee} />
                    <Banner desktopSrc={bannerCointreau} mobileSrc={bannerCointreauCel} altText="Cointreau Banner" isMobile={isMobile} />

                    <ProductSection title="Wine" link="catalog?type=wine" products={wineProducts} responsive={responsivee} />
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Home;
