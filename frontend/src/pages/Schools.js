import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdClose } from 'react-icons/md';
import api from '../services/api';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const growthData = [
    { year: '2020', val: 0 }, { year: '2021', val: 0 }, { year: '2022', val: 0 },
    { year: '2023', val: 0 }, { year: '2024', val: 0 }, { year: '2025', val: 0 },
];

const Schools = () => {
    const navigate = useNavigate();
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const data = await api.getSchools();
            // Map DB fields to frontend expectations if necessary
            const formattedData = data.map(s => ({
                ...s,
                adminName: s.admin_name || 'N/A',
                admins: s.admins_count ? s.admins_count.toLocaleString() : '0',
            }));
            setSchools(formattedData);
            if (formattedData.length > 0) {
                setSelectedSchool(formattedData[0]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [showActivePopup, setShowActivePopup] = useState(false);
    const [showInactivePopup, setShowInactivePopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [schoolToEdit, setSchoolToEdit] = useState(null);
    const [schoolToDelete, setSchoolToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const schoolsPerPage = 6;

    const activeSchools = schools.filter(school => school.status === 'Active');
    const inactiveSchools = schools.filter(school => school.status === 'Inactive');

    const dynamicStats = {
        total: schools.length,
        active: activeSchools.length,
        inactive: inactiveSchools.length
    };



    // Filtering logic
    const filteredSchoolsList = schools.filter(school => {
        if (statusFilter === 'All') return true;
        return school.status === statusFilter;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredSchoolsList.length / schoolsPerPage);
    const startIndex = (currentPage - 1) * schoolsPerPage;
    const endIndex = startIndex + schoolsPerPage;
    const currentSchools = filteredSchoolsList.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };



    const handleSchoolChange = (e) => {
        const school = schools.find(s => s.id === e.target.value);
        if (school) {
            setSelectedSchool(school);
        }
    };

    // Calculate gauge arc path based on performance percentage
    const getGaugeArc = (percentage) => {
        const angle = (percentage / 100) * 180;
        const radians = (angle * Math.PI) / 180;
        const centerX = 90;
        const centerY = 110;
        const radius = 60;
        const endX = centerX - radius * Math.cos(radians);
        const endY = centerY - radius * Math.sin(radians);
        const largeArcFlag = angle > 180 ? 1 : 0;
        return `M 30 110 A 60 60 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    };

    // Get color based on performance level
    const getPerformanceColor = (percentage) => {
        if (percentage < 50) return '#EB5757'; // Red for low performance
        if (percentage < 75) return '#F2C94C'; // Yellow for medium performance
        return '#27AE60'; // Green for high performance
    };

    const handleEditClick = (school) => {
        setSchoolToEdit({ ...school });
        setShowEditModal(true);
    };

    const handleDeleteClick = (school) => {
        setSchoolToDelete(school);
        setShowDeleteModal(true);
    };

    const handleEditSave = () => {
        const updatedSchools = schools.map(s => s.id === schoolToEdit.id ? schoolToEdit : s);
        setSchools(updatedSchools);
        setShowEditModal(false);
        setSchoolToEdit(null);
    };

    const handleDeleteConfirm = () => {
        const updatedSchools = schools.filter(s => s.id !== schoolToDelete.id);
        setSchools(updatedSchools);
        setShowDeleteModal(false);
        setSchoolToDelete(null);
    };


    if (loading) return <div className="dashboard-container"><TopBar title="Manage Schools" /><div style={{ padding: '20px' }}>Loading schools...</div></div>;
    if (error) return <div className="dashboard-container"><TopBar title="Manage Schools" /><div style={{ padding: '20px', color: 'red' }}>Error: {error}</div></div>;

    return (
        <div className="dashboard-container">
            <TopBar title="Manage Schools" showSearch={true} />

            <div className="admins-header-actions" style={{ marginBottom: '20px', textAlign: 'right' }}>
                <button className="add-admin-btn" style={{ backgroundColor: '#2F80ED' }} onClick={() => navigate('/add-school')}>
                    <MdAdd size={20} /> Add New School
                </button>
            </div>

            <div className="admins-top-grid">
                <div className="dashboard-card admins-stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: '#EBF2FF' }}>
                            <span style={{ fontSize: '20px' }}>🏫</span>
                        </div>
                        <div className="stat-text-block">
                            <span className="stat-label">Total Schools</span>
                            <h3 className="stat-value">{dynamicStats.total}</h3>
                        </div>
                    </div>

                    <div className="stat-progress-section">
                        <div
                            className="progress-row"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowActivePopup(true)}
                        >
                            <div className="progress-info">
                                <span>Active</span>
                                <span>{dynamicStats.active}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill active"
                                    style={{
                                        width: `${dynamicStats.total > 0 ? (dynamicStats.active / dynamicStats.total) * 100 : 0}%`,
                                        backgroundColor: '#27AE60',
                                        transition: 'all 0.3s ease'
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div
                            className="progress-row"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowInactivePopup(true)}
                        >
                            <div className="progress-info">
                                <span>Inactive</span>
                                <span>{dynamicStats.inactive}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill inactive"
                                    style={{
                                        width: `${dynamicStats.total > 0 ? (dynamicStats.inactive / dynamicStats.total) * 100 : 0}%`,
                                        backgroundColor: '#EB5757',
                                        transition: 'all 0.3s ease'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Growth Chart */}
                <div className="dashboard-card schools-growth-card" style={{ flex: 2 }}>
                    <div className="card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 className="card-title">Schools Growth</h3>
                        <div className="chart-filters" style={{ display: 'flex', gap: '10px' }}>
                            <select className="chart-select">
                                <option>All Schools</option>
                                {schools.map((school) => (
                                    <option key={school.id} value={school.id}>{school.name}</option>
                                ))}
                            </select>
                            <select className="chart-select">
                                <option>Yearly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '180px' }}>
                        <ResponsiveContainer>
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F2C94C" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#F2C94C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#828282' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#828282' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="val" stroke="#F2C94C" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performance Card */}
                <div className="dashboard-card performance-card" style={{ flex: 1, backgroundColor: '#E8F5F7', padding: '20px' }}>
                    <h3 className="card-title" style={{ marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>Performance</h3>

                    {selectedSchool ? (
                        <>
                            {/* Gauge Chart */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', position: 'relative', height: '140px' }}>
                                <svg width="180" height="140" viewBox="0 0 180 140">
                                    {/* Background arc */}
                                    <path
                                        d="M 30 110 A 60 60 0 0 1 150 110"
                                        fill="none"
                                        stroke="#E0E0E0"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                    />
                                    {/* Dynamic Progress arc based on performance */}
                                    <path
                                        d={getGaugeArc(selectedSchool.performance)}
                                        fill="none"
                                        stroke={getPerformanceColor(selectedSchool.performance)}
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                    />
                                    {/* Center circle */}
                                    <circle cx="90" cy="110" r="8" fill="#2F80ED" />
                                    {/* Needle - positioned based on performance */}
                                    <line
                                        x1="90"
                                        y1="110"
                                        x2={90 - 60 * Math.cos((selectedSchool.performance / 100 * 180) * Math.PI / 180)}
                                        y2={110 - 60 * Math.sin((selectedSchool.performance / 100 * 180) * Math.PI / 180)}
                                        stroke="#F2994A"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <span style={{ color: '#333', fontSize: '20px', fontWeight: '700' }}>{selectedSchool.performance}%</span>
                                </div>
                            </div>

                            {/* Legend and Dropdown */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                                <select
                                    className="chart-select"
                                    value={selectedSchool.id}
                                    onChange={handleSchoolChange}
                                    style={{
                                        backgroundColor: '#333',
                                        color: 'white',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '500'
                                    }}
                                >
                                    <option value="">Schools</option>
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>{school.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#828282', padding: '20px' }}>
                            No active schools to display
                        </div>
                    )}
                </div>
            </div>

            <div className="dashboard-card admins-table-card">
                <div className="table-header-row">
                    <h3 className="card-title">Schools List</h3>
                    <div className="table-actions">
                        <div className="table-search">
                            <MdSearch size={18} color="#828282" />
                            <input type="text" placeholder="Search..." />
                        </div>
                        <select
                            className="chart-select"
                            style={{ backgroundColor: '#F2F2F2', border: '1px solid #E0E0E0', color: '#333' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admins-table">
                        <thead>
                            <tr>
                                <th>SCHOOL ID</th>
                                <th>SCHOOL NAME</th>
                                <th>ADMIN NAME</th>
                                <th>STUDENTS</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSchools.map((school, index) => (
                                <tr key={index}>
                                    <td className="admin-id">{school.id}</td>
                                    <td>
                                        <span className="school-name-text" style={{ fontWeight: '500' }}>{school.name}</span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: '500' }}>{school.adminName || 'Not Assigned'}</span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: '600', color: '#27AE60' }}>{school.admins}</span>
                                    </td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: school.status === 'Active' ? '#EBF9F1' : '#FFEAEA',
                                                color: school.status === 'Active' ? '#27AE60' : '#EB5757'
                                            }}
                                        >
                                            {school.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-icons">
                                            <MdEdit
                                                className="action-icon-btn edit"
                                                style={{ color: '#2F80ED', cursor: 'pointer' }}
                                                onClick={() => handleEditClick(school)}
                                            />
                                            <MdDelete
                                                className="action-icon-btn delete"
                                                style={{ color: '#EB5757', cursor: 'pointer' }}
                                                onClick={() => handleDeleteClick(school)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <span>Showing {filteredSchoolsList.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredSchoolsList.length)} of {filteredSchoolsList.length} Schools</span>
                    <div className="page-arrows">
                        {currentPage > 1 && (
                            <span
                                className="page-arrow"
                                onClick={handlePreviousPage}
                                style={{ cursor: 'pointer', marginRight: '10px', backgroundColor: '#2F80ED', color: '#fff', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', fontSize: '12px', fontWeight: '600' }}
                            >
                                {'<'}
                            </span>
                        )}
                        {currentPage < totalPages && (
                            <span
                                className="page-arrow"
                                onClick={handleNextPage}
                                style={{ cursor: 'pointer', marginRight: '10px', backgroundColor: '#2F80ED', color: '#fff', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', fontSize: '12px', fontWeight: '600' }}
                            >
                                {'>'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Announcement Card */}
            <div className="dashboard-card create-announcement-card" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px' }}>
                <div className="announcement-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="target-icon-wrapper" style={{ backgroundColor: 'white', border: '1px solid #E0E0E0', padding: '5px', borderRadius: '50%' }}>🎯</div>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>Create Announcement</span>
                </div>
                <button className="compose-btn" onClick={() => navigate('/create-announcement')} style={{ backgroundColor: '#2F80ED', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: '600', cursor: 'pointer' }}>+ Compose</button>
            </div>

            {/* Active Schools Popup */}
            {showActivePopup && (
                <div className="popup-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="popup-content" style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '25px',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        position: 'relative',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#27AE60', fontSize: '20px', fontWeight: '600' }}>
                                Active Schools ({activeSchools.length})
                            </h3>
                            <MdClose
                                size={24}
                                style={{ cursor: 'pointer', color: '#828282' }}
                                onClick={() => setShowActivePopup(false)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeSchools.map((school) => (
                                <div
                                    key={school.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 15px',
                                        backgroundColor: '#F9F9F9',
                                        borderRadius: '8px',
                                        border: '1px solid #E0E0E0'
                                    }}
                                >
                                    <div
                                        className="admin-avatar"
                                        style={{
                                            backgroundColor: school.bg,
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            marginRight: '15px'
                                        }}
                                    >
                                        {school.initials}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                                            {school.name}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#828282' }}>
                                            ID: {school.id}
                                        </div>
                                    </div>
                                    <span
                                        className="status-badge"
                                        style={{
                                            backgroundColor: '#EBF9F1',
                                            color: '#27AE60',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {school.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Inactive Schools Popup */}
            {showInactivePopup && (
                <div className="popup-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="popup-content" style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '25px',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        position: 'relative',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#EB5757', fontSize: '20px', fontWeight: '600' }}>
                                Inactive Schools ({inactiveSchools.length})
                            </h3>
                            <MdClose
                                size={24}
                                style={{ cursor: 'pointer', color: '#828282' }}
                                onClick={() => setShowInactivePopup(false)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {inactiveSchools.map((school) => (
                                <div
                                    key={school.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 15px',
                                        backgroundColor: '#F9F9F9',
                                        borderRadius: '8px',
                                        border: '1px solid #E0E0E0'
                                    }}
                                >
                                    <div
                                        className="admin-avatar"
                                        style={{
                                            backgroundColor: school.bg,
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            marginRight: '15px'
                                        }}
                                    >
                                        {school.initials}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                                            {school.name}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#828282' }}>
                                            ID: {school.id}
                                        </div>
                                    </div>
                                    <span
                                        className="status-badge"
                                        style={{
                                            backgroundColor: '#FFEAEA',
                                            color: '#EB5757',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {school.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit School Modal */}
            {showEditModal && schoolToEdit && (
                <div className="popup-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="popup-content" style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '30px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, color: '#333', fontSize: '20px', fontWeight: '600' }}>
                                Edit School
                            </h3>
                            <MdClose
                                size={24}
                                style={{ cursor: 'pointer', color: '#828282' }}
                                onClick={() => setShowEditModal(false)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4F4F4F' }}>School Name</label>
                                <input
                                    type="text"
                                    value={schoolToEdit.name}
                                    onChange={(e) => setSchoolToEdit({ ...schoolToEdit, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E0E0E0',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4F4F4F' }}>Students</label>
                                <input
                                    type="text"
                                    value={schoolToEdit.admins}
                                    onChange={(e) => setSchoolToEdit({ ...schoolToEdit, admins: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E0E0E0',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4F4F4F' }}>Status</label>
                                <select
                                    value={schoolToEdit.status}
                                    onChange={(e) => setSchoolToEdit({ ...schoolToEdit, status: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E0E0E0',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E0E0E0',
                                        backgroundColor: 'white',
                                        color: '#4F4F4F',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSave}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#2F80ED',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && schoolToDelete && (
                <div className="popup-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="popup-content" style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '30px',
                        width: '90%',
                        maxWidth: '450px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: '#FFEAEA',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <MdDelete size={32} color="#EB5757" />
                            </div>
                            <h3 style={{ margin: '0 0 12px', color: '#333', fontSize: '20px', fontWeight: '600' }}>
                                Delete School?
                            </h3>
                            <p style={{ margin: '0 0 25px', color: '#828282', fontSize: '14px', lineHeight: '1.5' }}>
                                Are you sure you want to delete <strong>{schoolToDelete.name}</strong>? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E0E0E0',
                                        backgroundColor: 'white',
                                        color: '#4F4F4F',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#EB5757',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schools;
