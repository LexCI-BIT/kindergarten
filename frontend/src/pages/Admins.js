import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdNotifications, MdErrorOutline, MdError, MdConfirmationNumber, MdClose } from 'react-icons/md';
import api from '../services/api';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const growthData = [
    { year: '2020', val: 0 }, { year: '2021', val: 0 }, { year: '2022', val: 0 },
    { year: '2023', val: 0 }, { year: '2024', val: 0 }, { year: '2025', val: 0 },
];


const Admins = () => {
    const navigate = useNavigate();

    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [complaints, setComplaints] = useState([]);
    const [complaintsSummary, setComplaintsSummary] = useState({ total: 0, priority: 'Normal' });

    useEffect(() => {
        fetchAdmins();
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const data = await api.getComplaints();
            setComplaints(data);
            const pending = data.filter(c => c.status === 'Pending').length;
            setComplaintsSummary({
                total: data.length,
                priority: pending > 10 ? 'High Priority' : 'Normal Priority'
            });
        } catch (err) {
            console.error("Error fetching complaints for admins:", err);
        }
    };

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const data = await api.getAdmins();
            const formattedData = data.map(a => ({
                ...a,
                id: a.admin_id,
                schoolName: a.school_name,
            }));
            setAdmins(formattedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const [showActivePopup, setShowActivePopup] = useState(false);
    const [showInactivePopup, setShowInactivePopup] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adminToEdit, setAdminToEdit] = useState(null);
    const [adminToDelete, setAdminToDelete] = useState(null);

    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const adminsPerPage = 6;

    const activeAdmins = admins.filter(admin => admin.status === 'Active');
    const inactiveAdmins = admins.filter(admin => admin.status === 'Inactive');

    const dynamicStats = {
        total: admins.length,
        active: activeAdmins.length,
        inactive: inactiveAdmins.length
    };

    // Filtering logic
    const filteredAdminsList = admins.filter(admin => {
        if (statusFilter === 'All') return true;
        return admin.status === statusFilter;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredAdminsList.length / adminsPerPage);
    const startIndex = (currentPage - 1) * adminsPerPage;
    const endIndex = startIndex + adminsPerPage;
    const currentAdmins = filteredAdminsList.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleEditClick = (admin) => {
        setAdminToEdit({ ...admin });
        setShowEditModal(true);
    };

    const handleDeleteClick = (admin) => {
        setAdminToDelete(admin);
        setShowDeleteModal(true);
    };

    const handleEditSave = () => {
        const updatedAdmins = admins.map(a => a.id === adminToEdit.id ? adminToEdit : a);
        setAdmins(updatedAdmins);
        setShowEditModal(false);
        setAdminToEdit(null);
    };

    const handleDeleteConfirm = () => {
        const updatedAdmins = admins.filter(a => a.id !== adminToDelete.id);
        setAdmins(updatedAdmins);
        setShowDeleteModal(false);
        setAdminToDelete(null);
    };




    if (loading) return <div className="dashboard-container"><TopBar title="Manage Admins" /><div style={{ padding: '20px' }}>Loading admins...</div></div>;
    if (error) return <div className="dashboard-container"><TopBar title="Manage Admins" /><div style={{ padding: '20px', color: 'red' }}>Error: {error}</div></div>;

    return (
        <div className="dashboard-container">
            <TopBar title="Manage Admins" showSearch={true} />

            <div className="admins-header-actions" style={{ marginBottom: '20px', textAlign: 'right' }}>
                <button className="add-admin-btn" style={{ backgroundColor: '#2F80ED' }} onClick={() => navigate('/add-school')}>
                    <MdAdd size={20} /> Add New Admin
                </button>
            </div>

            <div className="admins-top-grid">
                <div className="dashboard-card admins-stat-card" style={{ padding: '15px' }}>
                    <div className="stat-card-header">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: '#EBF2FF' }}>
                            <span style={{ fontSize: '20px' }}>👤</span>
                        </div>
                        <div className="stat-text-block">
                            <span className="stat-label">Total Admins</span>
                            <h3 className="stat-value">{dynamicStats.total}</h3>
                        </div>
                    </div>

                    <div className="stat-progress-section">
                        <div className="progress-row">
                            <div className="progress-info">
                                <span>Active</span>
                                <span>{dynamicStats.active}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill active"
                                    onClick={() => setShowActivePopup(true)}
                                    style={{
                                        width: `${dynamicStats.total > 0 ? (dynamicStats.active / dynamicStats.total) * 100 : 0}%`,
                                        backgroundColor: '#27AE60',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="progress-row">
                            <div className="progress-info">
                                <span>Inactive</span>
                                <span>{dynamicStats.inactive}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill inactive"
                                    onClick={() => setShowInactivePopup(true)}
                                    style={{
                                        width: `${dynamicStats.total > 0 ? (dynamicStats.inactive / dynamicStats.total) * 100 : 0}%`,
                                        backgroundColor: '#EB5757',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card schools-growth-card" style={{ flex: 2 }}>
                    <div className="card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="card-title">Admin Performance</h3>
                        <div className="chart-filters" style={{ display: 'flex', gap: '10px' }}>
                            <select className="chart-select">
                                <option>All Admins</option>
                            </select>
                            <select className="chart-select">
                                <option>Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '150px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -15 }}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#407BFF" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#407BFF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#828282' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#828282' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="val" stroke="#407BFF" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-card support-tickets-card" style={{ flex: 1, padding: '15px' }}>
                    <div className="support-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
                        <div className="ticket-icon-wrapper" style={{
                            backgroundColor: '#FFF8E1',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#F2C94C'
                        }}>
                            <MdConfirmationNumber size={24} />
                        </div>
                        <div className="support-title-block">
                            <span style={{ fontSize: '13px', color: '#828282', display: 'block' }}>Support Tickets</span>
                            <h3 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{complaintsSummary.total}</h3>
                        </div>
                    </div>

                    <div className="priority-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <MdError size={18} color="#EB5757" />
                        <span style={{ color: '#EB5757', fontSize: '13px', fontWeight: '500' }}>{complaintsSummary.priority}</span>
                    </div>

                    <div className="tickets-mini-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                        {complaints.slice(0, 3).map((ticket, idx) => (
                            <div key={ticket.id} className="ticket-mini-item" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '8px 15px',
                                border: '1px solid #F2F2F2',
                                borderRadius: '10px',
                                backgroundColor: '#fff'
                            }}>
                                <div className="ticket-mini-icon">
                                    {idx === 0 && <MdNotifications size={20} color="#FF9F43" />}
                                    {idx === 1 && <MdErrorOutline size={20} color="#EB5757" />}
                                    {idx === 2 && (
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontSize: '20px' }}>🎫</span>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '-2px',
                                                right: '-2px',
                                                width: '10px',
                                                height: '10px',
                                                backgroundColor: '#EB5757',
                                                borderRadius: '50%',
                                                border: '1.5px solid #fff'
                                            }}></div>
                                        </div>
                                    )}
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{ticket.subject}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        className="view-tickets-btn"
                        onClick={() => navigate('/support-tickets')}
                        style={{
                            backgroundColor: '#2F80ED',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        View All Tickets
                    </button>
                </div>
            </div>

            <div className="dashboard-card admins-table-card">
                <div className="table-header-row">
                    <h3 className="card-title">Admins List</h3>
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
                                <th>ADMIN ID</th>
                                <th>ADMIN NAME</th>
                                <th>SCHOOL NAME</th>
                                <th>STATUS</th>
                                <th>SALARY (₹)</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAdmins.map((admin) => (
                                <tr key={admin.id}>
                                    <td className="admin-id">{admin.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="admin-avatar" style={{ backgroundColor: admin.bg, width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '600' }}>
                                                {admin.initials}
                                            </div>
                                            <span style={{ fontWeight: '500' }}>{admin.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ color: '#2F80ED', fontWeight: '500' }}>{admin.schoolName || 'Not Assigned'}</span>
                                    </td>

                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: admin.status === 'Active' ? '#EBF9F1' : '#FFEAEA',
                                                color: admin.status === 'Active' ? '#27AE60' : '#EB5757',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: '600', color: '#333' }}>₹{admin.salary}</span>
                                    </td>
                                    <td>
                                        <div className="action-icons">
                                            <MdEdit
                                                className="action-icon-btn edit"
                                                style={{ color: '#2F80ED', cursor: 'pointer', marginRight: '10px' }}
                                                onClick={() => handleEditClick(admin)}
                                            />
                                            <MdDelete
                                                className="action-icon-btn delete"
                                                style={{ color: '#EB5757', cursor: 'pointer' }}
                                                onClick={() => handleDeleteClick(admin)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <span>Showing {filteredAdminsList.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredAdminsList.length)} of {filteredAdminsList.length} admins</span>
                    <div className="page-arrows">
                        {currentPage > 1 && (
                            <span className="page-arrow" onClick={handlePreviousPage} style={{ cursor: 'pointer', marginRight: '10px', backgroundColor: '#2F80ED', color: '#fff', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', fontSize: '12px', fontWeight: '600' }}>{'<'}</span>
                        )}
                        {currentPage < totalPages && (
                            <span className="page-arrow" onClick={handleNextPage} style={{ cursor: 'pointer', marginRight: '10px', backgroundColor: '#2F80ED', color: '#fff', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', fontSize: '12px', fontWeight: '600' }}>{'>'}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-card create-announcement-card" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px' }}>
                <div className="announcement-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="target-icon-wrapper" style={{ fontSize: '20px' }}>🎯</div>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>Create Announcement</span>
                </div>
                <button className="compose-btn" style={{ backgroundColor: '#2F80ED', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/create-announcement')}>+ Compose</button>
            </div>

            {/* Active Admins Popup */}
            {showActivePopup && (
                <div className="popup-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="popup-content" style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>Active Admins ({activeAdmins.length})</h3>
                            <MdClose style={{ cursor: 'pointer', fontSize: '24px', color: '#828282' }} onClick={() => setShowActivePopup(false)} />
                        </div>
                        <div className="popup-scroll-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {activeAdmins.map(admin => (
                                <div key={admin.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: admin.bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{admin.initials}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{admin.name}</div>
                                        <div style={{ fontSize: '12px', color: '#828282' }}>{admin.schoolName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Inactive Admins Popup */}
            {showInactivePopup && (
                <div className="popup-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="popup-content" style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>Inactive Admins ({inactiveAdmins.length})</h3>
                            <MdClose style={{ cursor: 'pointer', fontSize: '24px', color: '#828282' }} onClick={() => setShowInactivePopup(false)} />
                        </div>
                        <div className="popup-scroll-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {inactiveAdmins.map(admin => (
                                <div key={admin.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: admin.bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{admin.initials}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{admin.name}</div>
                                        <div style={{ fontSize: '12px', color: '#828282' }}>{admin.schoolName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {showEditModal && adminToEdit && (
                <div className="popup-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="popup-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Edit Admin Details</h3>
                        <div className="edit-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={adminToEdit.name}
                                    onChange={(e) => setAdminToEdit({ ...adminToEdit, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E0E0E0' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>School Name</label>
                                <input
                                    type="text"
                                    value={adminToEdit.schoolName}
                                    onChange={(e) => setAdminToEdit({ ...adminToEdit, schoolName: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E0E0E0' }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>Status</label>
                                <select
                                    value={adminToEdit.status}
                                    onChange={(e) => setAdminToEdit({ ...adminToEdit, status: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E0E0E0', backgroundColor: 'white' }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>Salary (₹)</label>
                                <input
                                    type="text"
                                    value={adminToEdit.salary || ''}
                                    onChange={(e) => setAdminToEdit({ ...adminToEdit, salary: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E0E0E0' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E0E0E0', backgroundColor: 'white', color: '#4F4F4F', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleEditSave} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2F80ED', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && adminToDelete && (
                <div className="popup-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="popup-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#FFEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <MdDelete size={32} color="#EB5757" />
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Delete Admin?</h3>
                        <p style={{ color: '#828282', fontSize: '14px', marginBottom: '25px' }}>Are you sure you want to delete <strong>{adminToDelete.name}</strong>? This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E0E0E0', backgroundColor: 'white', color: '#4F4F4F', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleDeleteConfirm} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#EB5757', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins;
