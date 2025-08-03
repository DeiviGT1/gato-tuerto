// src/components/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './Home.css';
import CarouselItem from "../ui/CarouselItem";
import { Link } from 'react-router-dom';
import productData from './products.json';

const generateImagePaths = (basePath) => {
  const base = basePath.replace('.webp', '');
  return {
    small: `${base}-480w.webp`,
    large: `${base}-1024w.webp`,
  };
};


const johnnieWalkerBannerPaths = generateImagePaths("/images/banners/banner-johnnie-walker.webp");
const granCentenarioBannerPaths = generateImagePaths("/images/banners/banner-gran-centenario.webp");
const smirnoffBannerPaths = generateImagePaths("/images/banners/banner-smirnoff.webp");
const cointreauBannerPaths = generateImagePaths("/images/banners/banner-cointreau.webp");
const caymusBannerPaths = generateImagePaths("/images/banners/banner-caymus.webp");
const welcomeBannerPaths = generateImagePaths("/images/banners/banner-welcome.webp");

// Rutas a las imágenes (ahora usando el helper)
const mainWhiskeyPaths = generateImagePaths("/images/liquors-webp/whiskey/scotch/macallan/macallan-18-double-oak/macallan-18-double-oak-750ml.webp");
const mainTequilaPaths = generateImagePaths("/images/liquors-webp/tequila/jalisco/clase-azul/clase-azul-reposado/clase-azul-reposado-750ml.webp");
const mainRumPaths = generateImagePaths("/images/liquors-webp/rum/guatemalan/zacapa/zacapa-23/zacapa-23-750ml.webp");
const mainVodkaPaths = generateImagePaths("/images/liquors-webp/vodka/french/ciroc/ciroc-vodka/ciroc-vodka-750ml.webp");
const mainWinePaths = generateImagePaths("/images/liquors-webp/wine/american/caymus/caymus-cabernet-sauvignon/caymus-cabernet-sauvignon-750ml.webp");
const mainGinPaths = generateImagePaths("/images/liquors-webp/gin/netherlands/nolets/nolets-silver/nolets-silver-750ml.webp");
const mainBeerPaths = generateImagePaths("/images/liquors-webp/beer/mexican/corona/corona-extra/corona-extra-24oz-bottle.webp");
const mainCognacPaths = generateImagePaths("/images/liquors-webp/cognac-brandy/french/hennessy/hennessy-vs/hennessy-vs-750ml.webp");


// Array de frases aleatorias
const phrases = [
    "Explore Our Selection of:",
    "Discover the Best in:",
    "Top Picks for:",
    "Browse Our Collection of:",
    "Handpicked Selection of:",
    "Explore Our Premium Range of:",
    "Shop Our Exclusive:"
];

// Función para obtener una frase aleatoria
const getRandomPhrase = () => {
    return phrases[Math.floor(Math.random() * phrases.length)];
};

// ------ NUEVO getProductsByType (sin require.context) ------
const getProductsByType = (type, productRoutes) => {
  return productData.types
    .find(t => t.type === type)
    .subtypes.flatMap(subtype => subtype.products)
    .flatMap(brand => brand.products)
    .filter(product => productRoutes.includes(product.route))
    .map(product => {
      const preferredSize = product.sizes.find(size => size.size === "750ml") || product.sizes[0];
      const basePath = "/images/" + preferredSize.img;

      // Usamos el helper para generar las rutas en lugar de un solo imgSrc
      const imagePaths = generateImagePaths(basePath);
      
      return { ...product, imagePaths, price: preferredSize.price };
    });
};

// Componente reutilizable Banner
const Banner = ({ imagePaths, altText }) => (
  <div className='banner'>
    <img
      src={imagePaths.large}
      srcSet={`${imagePaths.small} 480w, ${imagePaths.large} 1024w`}
      sizes="(max-width: 464px) 50vw, (max-width: 1024px) 33vw, 20vw"
      alt={altText}
      loading="lazy"
    />
  </div>
);

// Componente reutilizable ProductSection
const ProductSection = ({ title, link, products, responsive }) => {
  const [randomPhrase, setRandomPhrase] = useState("");

  useEffect(() => {
    setRandomPhrase(getRandomPhrase());
  }, []);

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
            <CarouselItem
              name={product.name}
              imagePaths={product.imagePaths} 
              price={product.price}
            />
          </Link>
        ))}
      </Carousel>
    </section>
  );
};

// Función debounce
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

// Componente Home
function Home() {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  // Verificar si se está procesando un pedido y mostrar modal
  useEffect(() => {
    if (location.state?.showProcessingModal && location.state.fromCheckout) {
      setShowModal(true);
    }
  }, [location.state]);

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
  };

    // Definir categorías de productos
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

    // Llamar al helper para obtener productos
    const tequilaProducts = getProductsByType("tequila", tequilas);
    const whiskyProducts = getProductsByType("whiskey", whiskys);
    const vodkaProducts = getProductsByType("vodka", vodkas);
    const rumProducts = getProductsByType("rum", rums);
    const wineProducts = getProductsByType("wine", wines);
    

    // Configuraciones responsivas para el carrusel
    const responsivee = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 9 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 2 }
    };

    return (
        <>
          <Header />
          <div className="app-screen" style={{ position: "relative", top: "10vh" }}>
            <div className="home">
              <div className='welcome'>
                <img
                  src={welcomeBannerPaths.large}
                  srcSet={`${welcomeBannerPaths.small} 480w, ${welcomeBannerPaths.large} 1024w`}
                  sizes="(max-width: 464px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  alt="Welcome Banner"
                  fetchpriority="high"
                />
              </div>

              <section className='section-main-types'>
                <Carousel responsive={responsivee} infinite={true}>
                  <div>
                    <Link to="/catalog?type=whiskey">
                      <p className='section-main-types-title'>Whiskey</p>
                      <img 
                        src={mainWhiskeyPaths.large} /* Fallback para navegadores antiguos */
                        srcSet={`${mainWhiskeyPaths.small} 480w, ${mainWhiskeyPaths.large} 1024w`}
                        sizes="(max-width: 464px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        alt="Whiskey" 
                        loading="lazy" 
                      />
                    </Link>
                  </div>
                  <div>
                    <Link to="/catalog?type=tequila">
                      <p className='section-main-types-title'>Tequila</p>
                      <img 
                        src={mainTequilaPaths.large} /* Fallback para navegadores antiguos */
                        srcSet={`${mainTequilaPaths.small} 480w, ${mainTequilaPaths.large} 1024w`}
                        sizes="(max-width: 1024px) 33vw, 20vw" /* Pista para el navegador */
                        alt="Tequila" 
                        loading="lazy" 
                      />
                    </Link>
                  </div>
                  <div>
                    <Link to="/catalog?type=rum">
                      <p className='section-main-types-title'>Rum</p>
                      <img 
                        src={mainRumPaths.large} /* Fallback para navegadores antiguos */
                        srcSet={`${mainRumPaths.small} 480w, ${mainRumPaths.large} 1024w`}
                        sizes="(max-width: 1024px) 33vw, 20vw" /* Pista para el navegador */
                        alt="Rum" 
                        loading="lazy" 
                      />
                    </Link>
                  </div>
                  <div>
                    <Link to="/catalog?type=vodka">
                      <p className='section-main-types-title'>Vodka</p>
                      <img 
                        src={mainVodkaPaths.large} /* Fallback para navegadores antiguos */
                        srcSet={`${mainVodkaPaths.small} 480w, ${mainVodkaPaths.large} 1024w`}
                        sizes="(max-width: 1024px) 33vw, 20vw" /* Pista para el navegador */
                        alt="Vodka" 
                        loading="lazy" 
                      />
                    </Link>
                  </div>
                  <div>
                    <Link to="/catalog?type=wine">
                      <p className='section-main-types-title'>Wine</p>
                      <img 
                        src={mainWinePaths.large} /* Fallback para navegadores antiguos */
                        srcSet={`${mainWinePaths.small} 480w, ${mainWinePaths.large} 1024w`}
                        sizes="(max-width: 1024px) 33vw, 20vw" /* Pista para el navegador */
                        alt="Wine" 
                        loading="lazy" 
                      />
                    </Link>
                  </div>
                  <div>
                    <Link to="/catalog?type=gin">
                      <p className='section-main-types-title'>Gin</p>
                      <img 
                        src={mainGinPaths.large} /* Fallback para navegadores antiguos */
                        srcSet={`${mainGinPaths.small} 480w, ${mainGinPaths.large} 1024w`}
                        sizes="(max-width: 1024px) 33vw, 20vw" /* Pista para el navegador */
                        alt="Gin" 
                        loading="lazy" 
                      />
                    </Link>
                  </div>
                  <div>
                    <Link to="/catalog?type=cognac">
                      <p className='section-main-types-title'>Cognac/Brandy</p>
                        <img 
                        src={mainCognacPaths.large} /* Fallback para navegadores antiguos */
                        srcSet={`${mainCognacPaths.small} 480w, ${mainCognacPaths.large} 1024w`}
                        sizes="(max-width: 1024px) 33vw, 20vw" /* Pista para el navegador */
                        alt="Cognac" 
                        loading="lazy" 
                      />
                    </Link>
                  </div>
                  <div>
                    <Link to="/catalog?type=beer">
                      <p className='section-main-types-title'>Beer</p>
                        <img 
                        src={mainBeerPaths.large} /* Fallback para navegadores antiguos */
                        srcSet={`${mainBeerPaths.small} 480w, ${mainBeerPaths.large} 1024w`}
                        sizes="(max-width: 1024px) 33vw, 20vw" /* Pista para el navegador */
                        alt="Beer" 
                        loading="lazy" 
                      />
                    </Link>
                  </div>
                </Carousel>
              </section>

              <ProductSection
                title="Whiskeys"
                link="/catalog?type=whiskey"
                products={whiskyProducts}
                responsive={responsivee}
              />
              <Banner
                imagePaths={johnnieWalkerBannerPaths}
                altText="Johnnie Walker Banner"
              />

              <ProductSection
                title="Tequila"
                link="/catalog?type=tequila"
                products={tequilaProducts}
                responsive={responsivee}
              />
              <Banner
                imagePaths={granCentenarioBannerPaths}
                altText="Gran Centenario Banner"
              />

              <ProductSection
                title="Vodka"
                link="/catalog?type=vodka"
                products={vodkaProducts}
                responsive={responsivee}
              />
              <Banner
                imagePaths={smirnoffBannerPaths}
                altText="Smirnoff Banner"
              />

              <ProductSection
                title="Rum"
                link="/catalog?type=rum"
                products={rumProducts}
                responsive={responsivee}
              />
              <Banner
                imagePaths={cointreauBannerPaths}
                altText="Cointreau Banner"
              />
              <ProductSection
                title="Wine"
                link="/catalog?type=wine"
                products={wineProducts}
                responsive={responsivee}
              />
              <Banner
                imagePaths={caymusBannerPaths}
                altText="Caymus Banner"
              />
            </div>
            <Footer />
          </div>

          {showModal && (
            <div className="modal-order-success">
              <div className="modal-order-success-content">
                <p>Your order has been sent</p>
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          )}
        </>
      );
}

export default Home;