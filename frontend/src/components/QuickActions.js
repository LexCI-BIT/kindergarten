import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAddBusiness, MdPersonAdd, MdAnnouncement, MdReport, MdEventNote, MdHistoryEdu } from 'react-icons/md';

const ActionButton = ({ icon, label, bg, color, onClick }) => (
    <button className="action-btn-new" onClick={onClick} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 10px',
        backgroundColor: '#fff',
        border: '1px solid #F0F0F0',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        gap: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
        <div className="action-icon-circle" style={{
            backgroundColor: bg,
            color: color,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
        }}>
            {icon}
        </div>
        <span className="action-label" style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            textAlign: 'center'
        }}>{label}</span>
    </button>
);

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        { id: 1, icon: <MdAddBusiness />, label: 'Add School', bg: '#EBF2FF', color: '#407BFF', path: '/add-school' },
        { id: 2, icon: <MdPersonAdd />, label: 'Add Admin', bg: '#EBF9F1', color: '#2ECC71', path: '/admins' },
        { id: 3, icon: <MdAnnouncement />, label: 'Announcement', bg: '#FFF5EB', color: '#FF9F43', path: '/create-announcement' },
        { id: 4, icon: <MdReport />, label: 'Manage Complaints', bg: '#FFF0F1', color: '#EA5455', path: '/parents?tab=complaints' },
        { id: 5, icon: <MdEventNote />, label: 'Add Notes', bg: '#F3EFFF', color: '#7367F0', path: '/notes' },
        { id: 6, icon: <MdHistoryEdu />, label: 'Fee Status', bg: '#EBF2FF', color: '#407BFF', path: '/fees' }
    ];

    return (
        <div className="dashboard-card quick-actions-card" style={{ padding: '10px' }}>
            <h3 className="card-title" style={{ marginBottom: '10px', fontSize: '18px', color: '#1A1A1A' }}>Quick Actions</h3>
            <div className="actions-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px'
            }}>
                {actions.map((action) => (
                    <ActionButton
                        key={action.id}
                        icon={action.icon}
                        label={action.label}
                        bg={action.bg}
                        color={action.color}
                        onClick={() => navigate(action.path)}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
