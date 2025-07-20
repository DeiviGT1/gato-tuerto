// App.js
import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import useGAPageViews from './components/extensions/useGAPageViews';
import Home from './components/pages/Home';
import Catalog from './components/pages/Catalog';
import Liquor from "./components/pages/Liquor";
import ContactUs from "./components/pages/ContactUs";
import productsData from './components/pages/products.json';
import Checkout from './components/pages/Checkout';
import AgeVerificationModal from './components/ui/AgeVerificationModal'; // Import the component
import PrivacyPolicy from './components/pages/privacypolicy';
import TermsAndConditions from './components/pages/termsandconditions';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    useGAPageViews();
    return (
        <>
            <AgeVerificationModal /> 
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:item" element={<Liquor />} />
                <Route path="/catalog" element={<Catalog searchTerm={searchTerm} productsData={productsData} />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

            </Routes>
        </>
    );
}

export default App;
