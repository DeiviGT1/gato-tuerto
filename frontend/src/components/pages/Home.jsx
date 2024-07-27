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

const importAll = (r) => {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
};

const images = importAll(require.context('./liquors', true, /\.(png|jpe?g|svg)$/));

function Home() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const whiskys = [
        'buchanans-12',
        'buchanans-pineapple',
        'buchanans-master',
        'buchanans-18',
        'johnnie-walker-black-label',
        'johnnie-walker-double-black',
        'johnnie-walker-gold-label',
        'johnnie-walker-green-label',
        'johnnie-walker-blue-label',
        'johnnie-walker-18-years',
    ];

    const tequilas = [
        'don-julio-70',
        'don-julio-1942',
        'don-julio-reposado',
        'don-julio-anejo',
        'don-julio-blanco',
        'patron-silver',
        'patron-reposado',
        'patron-anejo',
        'patron-extra-anejo',
        'maestro-dobel-diamante',
    ];

    const vodkas = [
        'belvedere',
        'grey-goose',
        'ciroc-vodka',
        'ciroc-apple',
        'ciroc-peach',
        'ciroc-red-berry',
        'ciroc-mango',
        'ciroc-pineapple',
        'ciroc-coconut',
        'ciroc-french-vanilla',
    ];

    const rums = [
        'bacardi-limon',
        'bacardi-superior',
        'bacardi-gold',
        'bacardi-anejo',
        'bacardi-8',
        'bacardi-pineapple',
        'bacardi-coconut',
        'diplomatico-reserva-exclusiva',
        'diplomatico-planas',
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
    ]

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

    const whiskyProducts = productData.types
        .find(type => type.type === "whiskey")
        .subtypes.flatMap(subtype => subtype.products)
        .flatMap(brand => brand.products)
        .filter(product => whiskys.includes(product.route))
        .map(product => {
            const preferredSize = product.sizes.find(size => size.size === "750ml") || product.sizes[0];
            const imgSrc = images[preferredSize.img.replace('liquors/', '')];
            return { ...product, imgSrc, price: preferredSize.price };
        });

    const tequilaProducts = productData.types
        .find(type => type.type === "tequila")
        .subtypes.flatMap(subtype => subtype.products)
        .flatMap(brand => brand.products)
        .filter(product => tequilas.includes(product.route))
        .map(product => {
            const preferredSize = product.sizes.find(size => size.size === "750ml") || product.sizes[0];
            const imgSrc = images[preferredSize.img.replace('liquors/', '')];
            return { ...product, imgSrc, price: preferredSize.price };
        });

    const vodkaProducts = productData.types
        .find(type => type.type === "vodka")
        .subtypes.flatMap(subtype => subtype.products)
        .flatMap(brand => brand.products)
        .filter(product => vodkas.includes(product.route))
        .map(product => {
            const preferredSize = product.sizes.find(size => size.size === "750ml") || product.sizes[0];
            const imgSrc = images[preferredSize.img.replace('liquors/', '')];
            return { ...product, imgSrc, price: preferredSize.price };
        });

    const rumProducts = productData.types
        .find(type => type.type === "rum")
        .subtypes.flatMap(subtype => subtype.products)
        .flatMap(brand => brand.products)
        .filter(product => rums.includes(product.route))
        .map(product => {
            const preferredSize = product.sizes.find(size => size.size === "750ml") || product.sizes[0];
            const imgSrc = images[preferredSize.img.replace('liquors/', '')];
            return { ...product, imgSrc, price: preferredSize.price };
        });

    const wineProducts = productData.types
        .find(type => type.type === "wine")
        .subtypes.flatMap(subtype => subtype.products)
        .flatMap(brand => brand.products)
        .filter(product => wines.includes(product.route))
        .map(product => {
            const preferredSize = product.sizes.find(size => size.size === "750ml") || product.sizes[0];
            const imgSrc = images[preferredSize.img.replace('liquors/', '')];
            return { ...product, imgSrc, price: preferredSize.price };
        });

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
                    <section className="home-features whisky">
                        <div className="section">
                            <p>Check our variety of:&nbsp;</p>
                            <a href="/catalog?type=whiskey">
                                <p>
                                    Whiskeys
                                </p>
                            </a>
                        </div>
                        <Carousel responsive={responsivee}>
                            {whiskyProducts.map(whisky => (
                                <Link to={`/product/${whisky.route}`} key={whisky.route}>
                                    <CarouselItem
                                        name={whisky.name}
                                        imgSrc={whisky.imgSrc}
                                        price={whisky.price}
                                    />
                                </Link>
                            ))}
                        </Carousel>
                    </section>
                    <div className='banner'>
                        <img src={isMobile ? bannerSmirnoffCel : bannerSmirnoff} alt="Smirnoff Banner" />
                    </div>
                    <section className="home-features tequila">
                        <div className="section">
                            <p>Check our variety of:&nbsp;</p>
                            <a href="/catalog?type=tequila">
                                <p>
                                    Tequila
                                </p>
                            </a>
                        </div>
                        <Carousel responsive={responsivee}>
                            {tequilaProducts.map(tequilas => (
                                <Link to={`/product/${tequilas.route}`} key={tequilas.route}>
                                    <CarouselItem
                                        name={tequilas.name}
                                        imgSrc={tequilas.imgSrc}
                                        price={tequilas.price}
                                    />
                                </Link>
                            ))}
                        </Carousel>
                    </section>
                    <div className='banner'>
                        <img src={isMobile ? bannerCointreauCel : bannerCointreau} alt="Cointreau Banner" />
                    </div>
                    <section className="home-features vodka">
                        <div className="section">
                            <p>Check our variety of:&nbsp;</p>
                            <a href="catalog?type=vodka">
                                <p>
                                    Vodka
                                </p>
                            </a>
                        </div>
                        <Carousel responsive={responsivee}>
                            {vodkaProducts.map(vodkas => (
                                <Link to={`/product/${vodkas.route}`} key={vodkas.route}>
                                    <CarouselItem
                                        name={vodkas.name}
                                        imgSrc={vodkas.imgSrc}
                                        price={vodkas.price}
                                    />
                                </Link>
                            ))}
                        </Carousel>
                    </section>
                    <div className='banner'>
                        <img src={isMobile ? bannerGranCentenarioCel : bannerGranCentenario} alt="Gran Centenario Banner" />
                    </div>
                    <section className="home-features rum">
                        <div className="section">
                            <p>Check our variety of:&nbsp;</p>
                            <a href="catalog?type=rum">
                                <p>
                                    Rum
                                </p>
                            </a>
                        </div>
                        <Carousel responsive={responsivee}>
                            {rumProducts.map(rums => (
                                <Link to={`/product/${rums.route}`} key={rums.route}>
                                    <CarouselItem
                                        name={rums.name}
                                        imgSrc={rums.imgSrc}
                                        price={rums.price}
                                    />
                                </Link>
                            ))}
                        </Carousel>
                    </section>
                    <div className='banner'>
                        <img src={isMobile ? bannerJohnnieWalkerCel : bannerJohnnieWalker} alt="Johnnie Walker Banner" />
                    </div>
                    <section className="home-features wine">
                        <div className="section">
                            <p>Check our variety of:&nbsp;</p>
                            <a href="catalog?type=wine">
                                <p>
                                    Wine
                                </p>
                            </a>
                        </div>
                        <Carousel responsive={responsivee}>
                            {wineProducts.map(wines => (
                                <Link to={`/product/${wines.route}`} key={wines.route}>
                                    <CarouselItem
                                        name={wines.name}
                                        imgSrc={wines.imgSrc}
                                        price={wines.price}
                                    />
                                </Link>
                            ))}
                        </Carousel>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Home;
