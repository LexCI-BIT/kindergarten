import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdMoreVert, MdConfirmationNumber } from 'react-icons/md';
import TopBar from '../components/TopBar';
import api from '../services/api';

const SupportTicketsPage = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const data = await api.getComplaints();
                // Map complaints to UI structure
                const formatted = data.map(c => ({
                    id: c.id,
                    label: c.subject,
                    date: c.date,
                    status: c.status,
                    school: 'N/A', // Joining with school name would be better later
                    description: c.description
                }));
                setTickets(formatted);
            } catch (error) {
                console.error("Error fetching support tickets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    return (
        <div className="dashboard-container">
            <TopBar title="Support Tickets" showSearch={true} />

            {/* Tickets Table/List */}
            <div className="dashboard-card" style={{ marginTop: '20px' }}>
                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table className="admins-table" style={{ width: '100%', minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Subject</th>
                                <th>School</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>
                                        <span style={{ fontWeight: '600', color: 'var(--primary-blue)' }}>
                                            #TK-{ticket.id?.substring(0, 6)}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                backgroundColor: '#f5f6fa',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <MdConfirmationNumber color="#407BFF" size={18} />
                                            </div>
                                            <span style={{ fontWeight: '500' }}>{ticket.label}</span>
                                        </div>
                                    </td>
                                    <td>{ticket.school}</td>
                                    <td>{ticket.date}</td>
                                    <td>
                                        <span className={`status-badge ${ticket.status ? ticket.status.toLowerCase().replace(' ', '-') : 'open'}`}>
                                            {ticket.status || 'Open'}
                                        </span>
                                    </td>
                                    <td>
                                        <MdMoreVert size={20} color="#828282" style={{ cursor: 'pointer' }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketsPage;
