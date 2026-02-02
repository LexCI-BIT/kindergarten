import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { MdArrowBack } from 'react-icons/md';
import api from '../services/api';


const AddSchool = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        schoolName: '',
        schoolWebsite: '',
        establishmentYear: '',
        schoolEmail: '',
        schoolPhone: '',
        schoolAddress: '',
        city: '',
        state: '',
        adminFirstName: '',
        adminMiddleName: '',
        adminLastName: '',
        adminDob: '',
        adminGender: '',
        adminEmail: '',
        adminPhone: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleCancel = () => {
        navigate(-1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        const requiredFields = [
            'schoolName', 'establishmentYear',
            'schoolEmail', 'schoolPhone', 'schoolAddress', 'city', 'state',
            'adminFirstName', 'adminLastName', 'adminDob', 'adminGender',
            'adminEmail', 'adminPhone'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.schoolEmail && !emailRegex.test(formData.schoolEmail)) {
            newErrors.schoolEmail = 'Please enter a valid school email';
        }
        if (formData.adminEmail && !emailRegex.test(formData.adminEmail)) {
            newErrors.adminEmail = 'Please enter a valid admin email';
        }

        // Website validation
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (formData.schoolWebsite && !urlRegex.test(formData.schoolWebsite)) {
            newErrors.schoolWebsite = 'Please enter a valid website URL';
        }

        // Phone validation
        const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
        if (formData.schoolPhone && !phoneRegex.test(formData.schoolPhone)) {
            newErrors.schoolPhone = 'Please enter a valid phone number';
        }
        if (formData.adminPhone && !phoneRegex.test(formData.adminPhone)) {
            newErrors.adminPhone = 'Please enter a valid phone number';
        }

        // Date validation (Simple check for DD/MM/YY or DD/MM/YYYY)
        const dateRegex = /^\d{2}\/\d{2}\/\d{2,4}$/;
        if (formData.establishmentYear && !dateRegex.test(formData.establishmentYear)) {
            newErrors.establishmentYear = 'Use format DD/MM/YY';
        }
        if (formData.adminDob && !dateRegex.test(formData.adminDob)) {
            newErrors.adminDob = 'Use format DD/MM/YY';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // Prepare school data
            const schoolData = {
                name: formData.schoolName,
                website: formData.schoolWebsite || null,
                establishment_year: formData.establishmentYear,
                email: formData.schoolEmail,
                phone: formData.schoolPhone,
                address: formData.schoolAddress,
                city: formData.city,
                state: formData.state,
                status: 'Active'
            };

            // Prepare admin data
            const adminFullName = `${formData.adminFirstName} ${formData.adminMiddleName ? formData.adminMiddleName + ' ' : ''}${formData.adminLastName}`.trim();

            const adminData = {
                name: adminFullName,
                first_name: formData.adminFirstName,
                middle_name: formData.adminMiddleName || null,
                last_name: formData.adminLastName,
                dob: formData.adminDob,
                gender: formData.adminGender,
                email: formData.adminEmail,
                phone: formData.adminPhone,
                status: 'Active',
                modules: 'Exams'
            };

            // Call API to create school and admin
            const result = await api.createSchool(schoolData, adminData);

            alert('School and Admin added successfully!');
            navigate('/schools');
        } catch (error) {
            console.error('Error creating school:', error);
            alert(`Failed to create school: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dashboard-container">
            <TopBar title="Add School" subtitle="Add school of your choice" showSearch={true} />

            <div className="add-school-container" style={{ marginTop: '30px', position: 'relative' }}>
                <button className="back-nav-btn" onClick={() => navigate('/schools')}>
                    <MdArrowBack size={20} color="white" />
                </button>

                <form className="add-school-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-section-rows">
                        <div className="form-row">
                            <div className={`input-group ${errors.schoolName ? 'has-error' : ''}`}>
                                <label>School Full name*</label>
                                <input
                                    type="text"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.schoolName && <span className="error-message">{errors.schoolName}</span>}
                            </div>
                            <div className={`input-group ${errors.schoolWebsite ? 'has-error' : ''}`}>
                                <label>School Website</label>
                                <input
                                    type="text"
                                    name="schoolWebsite"
                                    value={formData.schoolWebsite}
                                    onChange={handleInputChange}
                                />
                                {errors.schoolWebsite && <span className="error-message">{errors.schoolWebsite}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className={`input-group ${errors.establishmentYear ? 'has-error' : ''}`}>
                                <label>Year of Establishment*</label>
                                <input
                                    type="text"
                                    name="establishmentYear"
                                    value={formData.establishmentYear}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.establishmentYear && <span className="error-message">{errors.establishmentYear}</span>}
                            </div>

                        </div>

                        <div className="form-row">
                            <div className={`input-group ${errors.schoolEmail ? 'has-error' : ''}`}>
                                <label>School Email*</label>
                                <input
                                    type="email"
                                    name="schoolEmail"
                                    value={formData.schoolEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.schoolEmail && <span className="error-message">{errors.schoolEmail}</span>}
                            </div>
                            <div className={`input-group ${errors.schoolPhone ? 'has-error' : ''}`}>
                                <label>School Phone*</label>
                                <input
                                    type="text"
                                    name="schoolPhone"
                                    value={formData.schoolPhone}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.schoolPhone && <span className="error-message">{errors.schoolPhone}</span>}
                            </div>
                        </div>

                        <div className="form-row three-col-mixed">
                            <div className={`input-group address-col ${errors.schoolAddress ? 'has-error' : ''}`}>
                                <label>School Address*</label>
                                <input
                                    type="text"
                                    name="schoolAddress"
                                    value={formData.schoolAddress}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.schoolAddress && <span className="error-message">{errors.schoolAddress}</span>}
                            </div>
                            <div className={`input-group ${errors.city ? 'has-error' : ''}`}>
                                <label>City*</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.city && <span className="error-message">{errors.city}</span>}
                            </div>
                            <div className={`input-group ${errors.state ? 'has-error' : ''}`}>
                                <label>State*</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.state && <span className="error-message">{errors.state}</span>}
                            </div>
                        </div>
                    </div>

                    <h3 className="form-section-header" style={{ marginTop: '40px' }}>Admin Information</h3>

                    <div className="form-section-rows">
                        <div className="form-row three-col">
                            <div className={`input-group ${errors.adminFirstName ? 'has-error' : ''}`}>
                                <label>First name*</label>
                                <input
                                    type="text"
                                    name="adminFirstName"
                                    value={formData.adminFirstName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.adminFirstName && <span className="error-message">{errors.adminFirstName}</span>}
                            </div>
                            <div className="input-group">
                                <label>Middle name</label>
                                <input
                                    type="text"
                                    name="adminMiddleName"
                                    value={formData.adminMiddleName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={`input-group ${errors.adminLastName ? 'has-error' : ''}`}>
                                <label>Last name*</label>
                                <input
                                    type="text"
                                    name="adminLastName"
                                    value={formData.adminLastName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.adminLastName && <span className="error-message">{errors.adminLastName}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className={`input-group ${errors.adminDob ? 'has-error' : ''}`}>
                                <label>Date Of Birth*</label>
                                <input
                                    type="text"
                                    name="adminDob"
                                    value={formData.adminDob}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.adminDob && <span className="error-message">{errors.adminDob}</span>}
                            </div>
                            <div className={`input-group ${errors.adminGender ? 'has-error' : ''}`}>
                                <label>Gender*</label>
                                <select
                                    name="adminGender"
                                    value={formData.adminGender}
                                    onChange={handleInputChange}
                                    className="form-select-input"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.adminGender && <span className="error-message">{errors.adminGender}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className={`input-group ${errors.adminEmail ? 'has-error' : ''}`}>
                                <label>Email*</label>
                                <input
                                    type="email"
                                    name="adminEmail"
                                    value={formData.adminEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.adminEmail && <span className="error-message">{errors.adminEmail}</span>}
                            </div>
                            <div className={`input-group ${errors.adminPhone ? 'has-error' : ''}`}>
                                <label>Phone*</label>
                                <input
                                    type="text"
                                    name="adminPhone"
                                    value={formData.adminPhone}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.adminPhone && <span className="error-message">{errors.adminPhone}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-action-btn submit-school-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding School...' : 'Add School'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSchool;
