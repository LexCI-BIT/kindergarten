import React from 'react';
import { MdEditDocument } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const FloatingButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/notes')}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#407BFF',
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 10px rgba(64, 123, 255, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            title="Create Note"
        >
            <MdEditDocument size={28} />
        </button>
    );
};

export default FloatingButton;
