import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNotifications, MdRecordVoiceOver } from 'react-icons/md';
import api from '../services/api';

const TicketItem = ({ icon, label }) => (
    <div className="ticket-row">
        <div className="t-icon">{icon}</div>
        <span className="t-text" style={{ fontSize: '13px' }}>{label}</span>
    </div>
);

const SupportTickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [summary, setSummary] = useState({ total: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await api.getComplaints();
                setTickets(data.slice(0, 3));
                setSummary({
                    total: data.length,
                    pending: data.filter(c => c.status === 'Pending').length
                });
            } catch (error) {
                console.error("Error fetching complaints:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    return (
        <div className="dashboard-card support-card">
            <div className="support-header">
                <div className="support-icon-main">
                    <MdNotifications size={24} color="#FFCA28" />
                </div>
                <div className="support-title-block">
                    <span className="support-label">Support Tickets</span>
                    <h3 className="support-count">{loading ? '...' : summary.total}</h3>
                    <span className="support-priority">{loading ? '...' : `${summary.pending} pending tickets`}</span>
                </div>
            </div>

            <div className="tickets-list">
                {tickets.map((ticket) => (
                    <TicketItem
                        key={ticket.id}
                        icon={<MdRecordVoiceOver size={18} color="#407BFF" />}
                        label={`${ticket.parent_name}: ${ticket.subject}`}
                    />
                ))}
                {!loading && tickets.length === 0 && (
                    <div style={{ fontSize: '12px', color: '#999', padding: '10px' }}>No pending tickets</div>
                )}
            </div>

            <div className="view-all-wrapper">
                <button
                    className="view-all-btn"
                    onClick={() => navigate('/support-tickets')}
                >
                    + View All Tickets
                </button>
            </div>
        </div>
    );
};

export default SupportTickets;
