import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ placeholder }) => {
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.target.blur(); // Hide the keyboard
            navigate(`/catalog?search=${inputValue}`);
        }
    };

    return (
        <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className='search-bar'
        />
    );
};

export default SearchBar;
