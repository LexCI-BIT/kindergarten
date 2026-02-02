import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import api from '../services/api';

const useSchools = () => {
    const [schools, setSchools] = useState(['Select School']);
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const data = await api.getSchools();
                setSchools(['Select School', ...data.map(s => s.name)]);
            } catch (error) {
                console.error("Error fetching schools in stock modals:", error);
            }
        };
        fetchSchools();
    }, []);
    return schools;
};

const ModalOverlay = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                width: '500px',
                maxWidth: '90%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                {children}
            </div>
        </div>
    );
};

const ModalHeader = ({ title, onClose }) => (
    <div style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
        <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px'
        }}>
            <MdClose />
        </button>
    </div>
);

const InputField = ({ label, type = 'text', value, onChange, options = [], error }) => (
    <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>{label}</label>
        {type === 'select' ? (
            <select
                value={value}
                onChange={onChange}
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: error ? '1px solid #EA5455' : '1px solid #ddd',
                    fontSize: '14px',
                    outline: 'none'
                }}
            >
                {options.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                value={value}
                onChange={onChange}
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: error ? '1px solid #EA5455' : '1px solid #ddd',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                }}
            />
        )}
        {error && <span style={{ color: '#EA5455', fontSize: '12px', marginTop: '4px', display: 'block' }}>{error}</span>}
    </div>
);

const ActionButtons = ({ savedText = 'Add', onCancel, onSave, saveColor = '#407BFF' }) => (
    <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px' }}>
        <button onClick={onSave} style={{
            flex: 1,
            padding: '10px',
            backgroundColor: saveColor,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
        }}>
            {savedText}
        </button>
        <button onClick={onCancel} style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
        }}>
            Cancel
        </button>
    </div>
);

export const AddStockModal = ({ isOpen, onClose, type }) => {
    const schoolOptions = useSchools();
    const [quantity, setQuantity] = useState('80');
    const [school, setSchool] = useState('Select School');
    const [errors, setErrors] = useState({});

    const handleSave = () => {
        const newErrors = {};
        if (school === 'Select School') {
            newErrors.school = 'Please select a school';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (onClose) onClose({ type, quantity, school });
        setSchool('Select School');
        setQuantity('80');
        setErrors({});
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={() => onClose()}>
            <ModalHeader title={`Add ${type} Stock`} onClose={() => onClose()} />
            <div style={{ padding: '0 20px' }}>
                <InputField
                    label="Quantity"
                    type="select"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    options={['80', '100', '200', '500']}
                />
                <InputField
                    label="Select School"
                    type="select"
                    value={school}
                    onChange={(e) => {
                        setSchool(e.target.value);
                        if (errors.school) setErrors({ ...errors, school: null });
                    }}
                    options={schoolOptions}
                    error={errors.school}
                />
            </div>
            <ActionButtons onCancel={() => onClose()} onSave={handleSave} />
        </ModalOverlay>
    );
};

export const LowStockModal = ({ isOpen, onClose }) => {
    const schoolOptions = useSchools();
    const [itemType, setItemType] = useState('Book');
    const [quantity, setQuantity] = useState('80');
    const [school, setSchool] = useState('Select School');
    const [errors, setErrors] = useState({});

    const handleSave = () => {
        const newErrors = {};
        if (school === 'Select School') {
            newErrors.school = 'Please select a school';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (onClose) onClose({ type: itemType, quantity, school });
        setSchool('Select School');
        setQuantity('80');
        setItemType('Books');
        setErrors({});
    }

    return (
        <ModalOverlay isOpen={isOpen} onClose={() => onClose()}>
            <ModalHeader title="Issue Low Stock Items" onClose={() => onClose()} />
            <div style={{ padding: '0 20px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <InputField
                            label="Item type"
                            type="select"
                            value={itemType}
                            onChange={(e) => setItemType(e.target.value)}
                            options={['Book', 'Uniform', 'Supplies']}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <InputField
                            label="Quantity"
                            type="select"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            options={['80', '100', '200']}
                        />
                    </div>
                </div>
                <InputField
                    label="Select School"
                    type="select"
                    value={school}
                    onChange={(e) => {
                        setSchool(e.target.value);
                        if (errors.school) setErrors({ ...errors, school: null });
                    }}
                    options={schoolOptions}
                    error={errors.school}
                />
            </div>
            <ActionButtons onCancel={() => onClose()} onSave={handleSave} />
        </ModalOverlay>
    );
};

export const EditStockModal = ({ isOpen, onClose, item }) => {
    const schoolOptions = useSchools();
    const type = item?.itemName || 'Stock';
    const [quantity, setQuantity] = useState(item?.quantity || '80');
    const [school, setSchool] = useState(item?.school || 'Select School');
    const [errors, setErrors] = useState({});

    React.useEffect(() => {
        if (item) {
            setQuantity(item.quantity);
            setSchool(item.school);
            setErrors({});
        }
    }, [item]);

    const handleSave = () => {
        const newErrors = {};
        if (school === 'Select School') {
            newErrors.school = 'Please select a school';
        }
        if (!quantity || isNaN(quantity) || Number(quantity) < 0) {
            newErrors.quantity = 'Please enter a valid quantity';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (onClose) onClose({ ...item, quantity, school });
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={() => onClose()}>
            <ModalHeader title={`Edit ${type} Stock`} onClose={() => onClose()} />
            <div style={{ padding: '0 20px' }}>
                <InputField
                    label="Quantity"
                    value={quantity}
                    onChange={(e) => {
                        setQuantity(e.target.value);
                        if (errors.quantity) setErrors({ ...errors, quantity: null });
                    }}
                    error={errors.quantity}
                />
                <InputField
                    label="Select School"
                    type="select"
                    value={school}
                    onChange={(e) => {
                        setSchool(e.target.value);
                        if (errors.school) setErrors({ ...errors, school: null });
                    }}
                    options={schoolOptions}
                    error={errors.school}
                />
            </div>
            <ActionButtons onCancel={() => onClose()} onSave={handleSave} savedText="Update" />
        </ModalOverlay>
    );
};

export const DeleteStockConfirmation = ({ isOpen, onClose, onDelete }) => (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <ModalHeader title="Delete Stock Item" onClose={onClose} />
        <div style={{ padding: '0 20px 20px' }}>
            <p>Are you sure you want to delete this stock item? This action cannot be undone.</p>
        </div>
        <ActionButtons onCancel={onClose} onSave={onDelete} savedText="Delete" saveColor="#EA5455" />
    </ModalOverlay>
);
