import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import {
    MdPerson
} from 'react-icons/md';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    LabelList
} from 'recharts';
import api from '../services/api';


const FeeStatus = () => {
    const navigate = useNavigate();
    const [fees, setFees] = useState([]);


    useEffect(() => {
        const fetchFees = async () => {
            try {
                const data = await api.getFees();
                setFees(data);
            } catch (error) {
                console.error("Error fetching fees:", error);
            }
        };
        fetchFees();
    }, []);

    const statsData = useMemo(() => {
        const total = fees.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
        const collected = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
        const pending = total - collected;

        const pendingCount = fees.filter(f => f.status !== 'Paid').length;
        const highPriority = fees.filter(f => f.status === 'Unpaid').length;

        return {
            total: total.toLocaleString(),
            collected: collected.toLocaleString(),
            pending: pending.toLocaleString(),
            pendingCount,
            highPriority
        };
    }, [fees]);

    const stats = [
        { id: 1, label: 'Collected Fees', value: `₹${statsData.collected}`, icon: '💰', bg: '#EBF9F1' },
        { id: 2, label: 'Pending Fees', value: `₹${statsData.pending}`, icon: '⏳', bg: '#FFF8E1' },
        { id: 3, label: 'High Priority', value: statsData.highPriority, icon: '❗', bg: '#FFEAEA' },
    ];

    const chartData = useMemo(() => {
        // Zero-filled structure for empty state to keep axes visible
        if (!fees.length) {
            return {
                bar: [
                    { name: 'Collected', value: 0, color: '#27AE60' },
                    { name: 'Pending', value: 0, color: '#F2994A' },
                    { name: 'Unpaid', value: 0, color: '#EB5757' },
                ],
                // Show a gray ring to simulate an "outline" when no data
                pie: [
                    { name: 'No Data', value: 1, color: '#F0F0F0' }
                ]
            };
        }
        return {
            bar: [
                { name: 'Collected', value: fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0), color: '#27AE60' },
                { name: 'Pending', value: fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0), color: '#F2994A' },
                { name: 'Unpaid', value: fees.filter(f => f.status === 'Unpaid').reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0), color: '#EB5757' },
            ],
            pie: [
                { name: 'Paid', value: fees.filter(f => f.status === 'Paid').length, color: '#27AE60' },
                { name: 'Pending', value: fees.filter(f => f.status === 'Pending').length, color: '#F2994A' },
                { name: 'Unpaid', value: fees.filter(f => f.status === 'Unpaid').length, color: '#EB5757' },
            ]
        };
    }, [fees]);

    const pendingStudents = {
        count: statsData.pendingCount,
        priorityCount: statsData.highPriority,
        list: fees.filter(f => f.status !== 'Paid').slice(0, 5).map(f => ({
            id: f.id,
            name: f.student_name,
            school: f.school_name
        }))
    };

    return (
        <div className="dashboard-container">
            <TopBar title="Fee Status" showSearch={true} />

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat) => (
                    <div className="dashboard-card fee-stat-card" key={stat.id}>
                        <div className="stat-card-top" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div className="stat-icon" style={{ backgroundColor: stat.bg, width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                {stat.icon}
                            </div>
                            <div className="stat-info">
                                <span className="stat-label" style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>{stat.label}</span>
                                <h3 className="stat-value" style={{ fontSize: '24px', fontWeight: '700', marginTop: '5px' }}>{stat.value}</h3>
                            </div>
                        </div>
                        {stat.growth && (
                            <div className="stat-growth" style={{ marginTop: '10px', fontSize: '12px', color: '#2ECC71', fontWeight: '600' }}>
                                <span>↑ {stat.growth} from last month</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="fee-content-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px', marginTop: '25px' }}>
                <div className="dashboard-card fee-chart-main-card">
                    <h3 className="card-title" style={{ textAlign: 'center', marginBottom: '20px' }}>Fee Status</h3>
                    <div className="fee-charts-split" style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '350px' }}>
                        {/* Bar Chart */}
                        <div style={{ flex: 1.2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ flex: 1, minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData.bar}
                                        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: '#828282' }}
                                            tickFormatter={(value) => `₹${value / 1000}k`}
                                            domain={[0, 340000]}
                                            ticks={[0, 85000, 170000, 255000, 340000]}
                                        />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                                            {chartData.bar.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                            <LabelList dataKey="value" position="top" formatter={(value) => `₹${(value / 1000).toLocaleString()}k`} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="chart-labels-row" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                                {chartData.bar.map((item, idx) => (
                                    <div key={idx} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                            {item.value >= 1000
                                                ? `₹${(item.value / 1000).toFixed(1)}k`
                                                : `₹${item.value}`}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#828282' }}>{item.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div style={{ flex: 1, height: '100%', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.pie}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="white"
                                        strokeWidth={2}
                                    >
                                        {chartData.pie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#333' }}>₹{statsData.collected}</div>
                                <div style={{ fontSize: '11px', color: '#828282', fontWeight: '500' }}>Collected Fees</div>
                            </div>
                        </div>
                    </div>
                    {/* Integrated Legend */}
                    <div className="unified-legend" style={{ display: 'flex', justifyContent: 'space-around', gap: '30px', marginTop: '30px', paddingBottom: '10px' }}>
                        {chartData.pie.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'space-around', gap: '10px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color }}></div>
                                <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Pending List */}
                <div className="dashboard-card pending-fees-sidebar">
                    <div className="pending-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', position: 'relative' }}>
                        <div className="stat-icon" style={{ backgroundColor: '#FFF8E1', color: '#FFB800', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ⏳
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', color: '#828282' }}>Pending fee students</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{pendingStudents.count}</div>
                        </div>
                    </div>
                    <div style={{ color: '#EA5455', fontSize: '11px', fontWeight: '600', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>❗</span> {pendingStudents.priorityCount} high priority
                    </div>

                    <div className="pending-students-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {pendingStudents.list.map((student) => (
                            <div className="pending-student-item" key={student.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                border: '1px solid #f0f0f0',
                                borderRadius: '8px'
                            }}>
                                <MdPerson size={20} color="#828282" />
                                <div style={{ fontSize: '12px' }}>
                                    <span style={{ fontWeight: '600' }}>{student.name}</span>
                                    <span style={{ margin: '0 5px', color: '#ccc' }}>-</span>
                                    <span style={{ color: '#828282' }}>{student.school}</span>
                                </div>
                            </div>
                        ))}
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
        </div>
    );
};

export default FeeStatus;
