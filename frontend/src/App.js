import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import Home from './components/pages/Home';
import Catalog from './components/pages/Catalog';
import Liquor from "./components/pages/Liquor";
import GiftBox from "./components/pages/GiftBox";
import ContactUs from "./components/pages/ContactUs";
import productsData from './components/pages/products.json';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:item" element={<Liquor />} />
            <Route path="/catalog" element={<Catalog searchTerm={searchTerm} productsData={productsData} />} />
            <Route path="/gift-boxes" element={<GiftBox />} />
            <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
    );
}

export default App;
