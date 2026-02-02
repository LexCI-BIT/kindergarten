import React from 'react';

const DeleteConfirmationModal = ({ itemName, itemType = 'Teacher', onConfirm, onCancel }) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: '12px', padding: '30px',
                width: '400px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>Delete {itemType}</h3>
                <p style={{ fontSize: '14px', color: '#828282', marginBottom: '25px', lineHeight: '1.5' }}>
                    Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '10px 25px', borderRadius: '8px', border: '1px solid #E0E0E0',
                            backgroundColor: '#fff', color: '#828282', fontSize: '14px', cursor: 'pointer', fontWeight: '600'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '10px 25px', borderRadius: '8px', border: 'none',
                            backgroundColor: '#FF5B5B', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '600'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
