import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import api from '../services/api';

const EditParentModal = ({ parent, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        studentName: '',
        phone: '',
        school: ''
    });
    const [schools, setSchools] = useState([]);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const data = await api.getSchools();
                setSchools(data.map(s => s.name));
            } catch (error) {
                console.error("Error fetching schools in modal:", error);
            }
        };
        fetchSchools();
    }, []);

    useEffect(() => {
        if (parent) {
            setFormData({
                name: parent.name,
                studentName: parent.studentName,
                phone: parent.phone,
                school: parent.school
            });
        }
    }, [parent]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...parent, ...formData });
    };

    if (!parent) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: '15px', width: '450px',
                padding: '25px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '20px', right: '20px',
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#828282'
                    }}
                >
                    <MdClose />
                </button>

                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '25px' }}>Edit Parent Details</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: '#333' }}>Parent Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E0E0E0',
                                fontSize: '14px', outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: '#333' }}>Student Name</label>
                        <input
                            type="text"
                            value={formData.studentName}
                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E0E0E0',
                                fontSize: '14px', outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: '#333' }}>School</label>
                        <select
                            value={formData.school}
                            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E0E0E0',
                                fontSize: '14px', outline: 'none', backgroundColor: '#fff'
                            }}
                        >
                            {schools.map(school => (
                                <option key={school} value={school}>{school}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: '#333' }}>Phone</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E0E0E0',
                                fontSize: '14px', outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 25px', borderRadius: '8px', border: '1px solid #E0E0E0',
                                backgroundColor: '#fff', color: '#828282', fontSize: '14px', cursor: 'pointer', fontWeight: '600'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 25px', borderRadius: '8px', border: 'none',
                                backgroundColor: '#6C5DD3', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '600'
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditParentModal;
