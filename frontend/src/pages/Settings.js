import React, { useState, useRef, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import api from '../services/api';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        superAdminName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [logo, setLogo] = useState({
        preview: null,
        filename: 'No file selected'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('kg_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData(prev => ({
                ...prev,
                superAdminName: parsedUser.name || '',
                email: parsedUser.email || '',
                phone: parsedUser.phoneNumber || ''
            }));
        }
    }, []);

    const fileInputRef = useRef(null);

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const validatePhone = (phone) => {
        return phone.match(/^\+?[1-9]\d{1,14}$/); // Basic international phone format
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.superAdminName) newErrors.superAdminName = 'Super Admin name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Invalid phone format (e.g. +918008980890)';
        }

        if (formData.currentPassword && formData.currentPassword.length < 6) {
            newErrors.currentPassword = 'Password must be at least 6 characters';
        }

        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'New password must be at least 6 characters';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit for settings
                alert('File size exceeds 2MB limit');
                return;
            }
            const previewUrl = URL.createObjectURL(file);
            setLogo({
                preview: previewUrl,
                filename: file.name
            });
        }
    };

    const handleRemoveLogo = () => {
        setLogo({
            preview: null,
            filename: 'No file selected'
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            if (!user?.id) {
                alert("User session not found. Please log in again.");
                return;
            }

            setLoading(true);
            try {
                const updatedData = {
                    name: formData.superAdminName,
                    email: formData.email,
                    phoneNumber: formData.phone
                };

                // Add password fields if changing password
                if (formData.newPassword) {
                    updatedData.currentPassword = formData.currentPassword;
                    updatedData.newPassword = formData.newPassword;
                }

                const response = await api.updateProfile(user.id, updatedData);

                // Update localStorage
                localStorage.setItem('kg_user', JSON.stringify(response.user));
                setUser(response.user);

                alert('Profile updated successfully!');
                window.location.reload();
            } catch (err) {
                setErrors({ submit: err.message });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="dashboard-container">
            <TopBar title="Super Admin Settings" showSearch={true} />

            <form className="settings-content" style={{ marginTop: '30px' }} onSubmit={handleSubmit} noValidate>
                {errors.submit && <div className="error-message" style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{errors.submit}</div>}
                {/* General Info Section */}
                <div className="settings-section">
                    <div className={`input-group ${errors.superAdminName ? 'has-error' : ''}`}>
                        <label>Super Admin Name</label>
                        <input
                            type="text"
                            name="superAdminName"
                            value={formData.superAdminName}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.superAdminName && <span className="error-message">{errors.superAdminName}</span>}
                    </div>

                    <div className="settings-row">
                        <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
                            <label>Email*</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className={`input-group ${errors.phone ? 'has-error' : ''}`}>
                            <label>Phone*</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>
                    </div>
                </div>

                {/* Password Section */}
                <div className="settings-section" style={{ marginTop: '20px' }}>
                    <h3 className="settings-section-title">Password</h3>
                    <div className="password-section-row">
                        <div className={`input-group password-input-group ${errors.currentPassword ? 'has-error' : ''}`}>
                            <label>Current password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword.current ? "text" : "password"}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button type="button" className="visibility-toggle" onClick={() => togglePasswordVisibility('current')}>
                                    {showPassword.current ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                            {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                        </div>
                        <div className={`input-group password-input-group ${errors.newPassword ? 'has-error' : ''}`}>
                            <label>New password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button type="button" className="visibility-toggle" onClick={() => togglePasswordVisibility('new')}>
                                    {showPassword.new ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                        </div>
                        <div className={`input-group password-input-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                            <label>Confirm password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button type="button" className="visibility-toggle" onClick={() => togglePasswordVisibility('confirm')}>
                                    {showPassword.confirm ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                        <button type="submit" className="save-changes-btn">Save Changes</button>
                    </div>
                </div>

                {/* Upload Logo Section */}
                <div className="settings-section" style={{ marginTop: '10px' }}>
                    <h3 className="settings-section-title">Upload Profile image</h3>
                    <div className="upload-logo-container">
                        <div className="upload-box">
                            <div className="logo-preview-circle">
                                {logo.preview || user?.photo ? (
                                    <img src={logo.preview || user?.photo || "/user.png"} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <img src="/user.png" alt="Default Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                            </div>
                            <span className="upload-filename">{logo.filename}</span>
                        </div>
                        <div className="upload-actions">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <button type="button" className="outline-btn" onClick={handleUploadClick}>Upload</button>
                            <button type="button" className="text-btn" onClick={handleRemoveLogo}>Remove</button>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '40px' }}>
                    <button type="submit" className="primary-save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
