import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdVisibilityOff, MdVisibility } from 'react-icons/md';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters long';
        }
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user type
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                const response = await api.login(formData.username, formData.password);
                console.log('Login successful', response);
                // Store user data in localStorage
                localStorage.setItem('kg_user', JSON.stringify(response.user));
                navigate('/dashboard');
            } catch (err) {
                setErrors({ submit: err.message });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-form-section">
                    <div className="login-header">
                        <h2 className="welcome-text">Welcome !</h2>
                        <div className="login-title-block">
                            <h1 className="login-title">Login</h1>
                            <p className="login-subtitle">Login to get started!</p>
                        </div>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        {errors.submit && <div className="error-message" style={{ marginBottom: '15px', color: '#EB5757', textAlign: 'center' }}>{errors.submit}</div>}
                        <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
                            <label>User name</label>
                            <input
                                type="text"
                                name="username"
                                className="form-input"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>

                        <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                            <label>Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                    {showPassword ? <MdVisibility className="password-icon" /> : <MdVisibilityOff className="password-icon" />}
                                </div>
                            </div>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>Rememebr me</span>
                            </label>
                            <span className="forgot-password">Forgot Password ?</span>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>

                <div className="login-illustration-section">
                    <img src="/login.png" alt="Login illustration" />
                </div>
            </div>
        </div>
    );
};

export default Login;
