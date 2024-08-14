import React from 'react';
import './FilterModal.css';

function FilterModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
                <div className="filter-modal-content">
                    {children}
                    <button className="close-button-filter" onClick={onClose}>Aceptar</button>
                </div>
            </div>
        </div>
    );
}

export default FilterModal;
