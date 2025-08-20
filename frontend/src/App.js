// App.js
import React, { useState, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import useGAPageViews from './components/extensions/useGAPageViews';
import AgeVerificationModal from './components/ui/AgeVerificationModal';

const Home = React.lazy(() => import('./components/pages/Home'));
const Catalog = React.lazy(() => import('./components/pages/Catalog'));
const Liquor = React.lazy(() => import("./components/pages/Liquor"));
const ContactUs = React.lazy(() => import("./components/pages/ContactUs"));
const PrivacyPolicy = React.lazy(() => import('./components/pages/PrivacyPolicy'));
const ReturnPolicy = React.lazy(() => import('./components/pages/ReturnPolicy'));
const productsData = React.lazy(() => import('./components/pages/products.json'));
const Checkout = React.lazy(() => import('./components/pages/Checkout'));
const TermsAndConditions = React.lazy(() => import('./components/pages/TermsAndConditions'));

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    useGAPageViews();
    return (
        <>
        <AgeVerificationModal /> 
            <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:item" element={<Liquor />} />
                <Route path="/catalog" element={<Catalog searchTerm={searchTerm} productsData={productsData} />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
            </Routes>
        </Suspense>
    </>
    );
}

export default App;
