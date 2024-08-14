import React from 'react';
import './FilterModal.css';

function FilterModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    console.log(children);
    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="filter-modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default FilterModal;
