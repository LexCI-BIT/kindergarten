import React, { useState, useEffect } from 'react';
import { MdAdd, MdCampaign, MdMoreVert } from 'react-icons/md';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';

const Announcements = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const data = await api.getAnnouncements();
                setAnnouncements(data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <div className="dashboard-container">
            <TopBar title="Announcements" showSearch={true} />

            {/* Page Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <button className="add-admin-btn" onClick={() => navigate('/create-announcement')}>
                    <MdAdd size={20} /> Create New Announcement
                </button>
            </div>

            {/* Announcements List */}
            <div className="announcements-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#828282' }}>Loading announcements...</div>
                ) : announcements.length === 0 ? (
                    <div className="dashboard-card" style={{ textAlign: 'center', padding: '40px', color: '#828282' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <MdCampaign size={48} color="#E0E0E0" />
                        </div>
                        <h4 style={{ margin: '0 0 8px 0', color: '#4F4F4F' }}>No Announcements Yet</h4>
                        <p style={{ margin: 0, fontSize: '14px' }}>Create an announcement to notify parents and staff.</p>
                    </div>
                ) : (
                    announcements.map((item) => (
                        <div className="dashboard-card announcement-card-item" key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
                            <h3 className="card-title" style={{ margin: 0 }}>Previous Announcements</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div className="stat-icon" style={{ backgroundColor: '#f0f4ff', color: '#407BFF', width: '45px', height: '45px' }}>
                                    <MdCampaign size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: 'var(--text-primary)' }}>{item.title}</h4>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item.message}</p>
                                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#828282' }}>
                                        <span>To: {item.recipient}</span>
                                        <span>Date: {item.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <MdMoreVert size={20} style={{ cursor: 'pointer', color: '#828282' }} />
                                <span className={`status-badge ${item.status.toLowerCase()}`} style={{
                                    backgroundColor: item.status === 'Sent' ? '#EBF9F1' : '#FFF8E1',
                                    color: item.status === 'Sent' ? '#2ECC71' : '#FFB800',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                }}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    )))}
            </div>
        </div>
    );
};

export default Announcements;
