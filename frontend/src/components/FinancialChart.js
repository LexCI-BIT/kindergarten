import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../services/api';

const FinancialChart = () => {
    const [selectedSchool, setSelectedSchool] = useState('All Schools');
    const [timeframe, setTimeframe] = useState('Yearly');
    const [schools, setSchools] = useState([]);
    const [fees, setFees] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schoolsData, feesData] = await Promise.all([
                    api.getSchools(),
                    api.getFees()
                ]);
                setSchools(schoolsData);
                setFees(feesData);
            } catch (error) {
                console.error("Error fetching data for chart:", error);
            }
        };
        fetchData();
    }, []);

    const chartData = useMemo(() => {
        // Helper to generate zero-filled data structure
        const generateZeroData = () => {
            if (timeframe === 'Yearly') {
                const currentYear = new Date().getFullYear();
                return Array.from({ length: 5 }, (_, i) => ({
                    year: (currentYear - 4 + i).toString(),
                    val: 0
                }));
            } else {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months.map(month => ({ month, val: 0 }));
            }
        };

        if (!fees.length) return generateZeroData();

        // Filter valid paid fees
        const paidFees = fees.filter(fee =>
            fee.status === 'Paid' &&
            (selectedSchool === 'All Schools' || fee.school_name === selectedSchool)
        );

        // If filtering results in no data, still return zero structure
        if (!paidFees.length) return generateZeroData();

        if (timeframe === 'Yearly') {
            const currentYear = new Date().getFullYear();
            // Generate last 5 years range
            const years = Array.from({ length: 5 }, (_, i) => (currentYear - 4 + i).toString());

            return years.map(year => {
                const total = paidFees
                    .filter(fee => new Date(fee.created_at || new Date()).getFullYear().toString() === year)
                    .reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);
                return { year, val: total };
            });
        } else {
            // Monthly - Jan to Dec of current year
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentYear = new Date().getFullYear();

            return months.map((month, index) => {
                const total = paidFees
                    .filter(fee => {
                        const date = new Date(fee.created_at || new Date());
                        return date.getMonth() === index && date.getFullYear() === currentYear;
                    })
                    .reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);
                return { month, val: total };
            });
        }
    }, [fees, selectedSchool, timeframe]);

    return (
        <div className="dashboard-card financial-chart-card">
            <div className="chart-header">
                <h3 className="card-title">Financial Overview</h3>
                <div className="chart-filters" style={{ display: 'flex', gap: '10px' }}>
                    <select
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                        style={{
                            padding: '5px 10px',
                            border: '1px solid #ddd',
                            borderRadius: '20px',
                            backgroundColor: '#fff',
                            color: '#666',
                            fontSize: '12px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All Schools">All Schools</option>
                        {schools.map((school) => (
                            <option key={school.id} value={school.name}>{school.name}</option>
                        ))}
                    </select>
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        style={{
                            padding: '5px 10px',
                            border: '1px solid #ddd',
                            borderRadius: '20px',
                            backgroundColor: '#fff',
                            color: '#666',
                            fontSize: '12px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="Yearly">Yearly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </div>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#2ECC71" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#E5E5E5" strokeDasharray="3 3" />
                        <XAxis
                            dataKey={timeframe === 'Yearly' ? 'year' : 'month'}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#999' }}
                            dy={10}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} tickFormatter={(value) => `${value}k`} />
                        <Tooltip />
                        <Area type="monotone" dataKey="val" stroke="#2ECC71" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FinancialChart;
