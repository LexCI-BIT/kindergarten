import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { MdPerson, MdPayment } from 'react-icons/md';
import TopBar from '../components/TopBar';
import api from '../services/api';
import TeacherManagement from '../components/TeacherManagement';

const Teachers = () => {
    const [selectedSchool, setSelectedSchool] = useState('overall');
    const [salaryFilter, setSalaryFilter] = useState('All Schools');
    const [activeMetric, setActiveMetric] = useState('lessons');
    const [showManagement, setShowManagement] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [schools, setSchools] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teachersData, schoolsData] = await Promise.all([
                    api.getTeachers(),
                    api.getSchools()
                ]);
                setTeachers(teachersData);
                setSchools(schoolsData);
            } catch (error) {
                console.error("Error fetching teachers data:", error);
            }
        };
        fetchData();
    }, []);

    const totalSalaryPayout = useMemo(() => {
        let filtered = teachers;
        if (salaryFilter !== 'All Schools') {
            filtered = teachers.filter(t => t.school_name === salaryFilter);
        }
        const total = filtered.reduce((sum, t) => sum + (parseInt(t.salary) || 0), 0);
        return total.toLocaleString('en-IN');
    }, [teachers, salaryFilter]);

    const stats = useMemo(() => {
        let filtered = teachers;
        if (selectedSchool !== 'overall') {
            filtered = teachers.filter(t => t.school_name === selectedSchool);
        }

        const total = filtered.length;
        // In real app, status would come from DB. Mocking for now.
        const active = Math.floor(total * 0.9);
        const leaf = total - active;

        return {
            totalTeachers: total.toLocaleString(),
            activeTeachers: active.toLocaleString(),
            onLeave: leaf.toLocaleString(),
            activePercentage: total > 0 ? (active / total) * 100 : 0,
            onLeavePercentage: total > 0 ? (leaf / total) * 100 : 0
        };
    }, [teachers, selectedSchool]);

    // Zero-filled data for charts as DB doesn't have this data yet
    const performanceData = [
        { name: '01 Jan', lessons: 0, evaluations: 0 }, { name: '05 Jan', lessons: 0, evaluations: 0 },
        { name: '10 Jan', lessons: 0, evaluations: 0 }, { name: '15 Jan', lessons: 0, evaluations: 0 },
        { name: '20 Jan', lessons: 0, evaluations: 0 }, { name: '25 Jan', lessons: 0, evaluations: 0 },
        { name: '30 Jan', lessons: 0, evaluations: 0 },
    ];

    const attendanceData = [
        { name: 'Mon', count: 0 }, { name: 'Tue', count: 0 }, { name: 'Wed', count: 0 },
        { name: 'Thu', count: 0 }, { name: 'Fri', count: 0 }, { name: 'Sat', count: 0 },
        { name: 'Sun', count: 0 },
    ];

    const allSchoolNames = schools.map(s => s.name);
    const schoolOptions = ['overall', ...allSchoolNames];

    return (
        <div className="dashboard-container">
            <TopBar
                title={selectedSchool === 'overall' ? "Teachers Overview" : `Teachers Overview - ${selectedSchool}`}
                showSearch={true}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', marginTop: '-15px', marginBottom: '25px' }}>
                {/* Stats Cards Row */}
                <div className="dashboard-card" style={{ padding: '20px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px', flex: '0 1 350px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: '#F0EFFF', color: '#6C5DD3',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <MdPerson size={20} />
                        </div>
                        <div>
                            <div style={{ color: '#828282', fontSize: '13px' }}>Total teachers</div>
                            <div style={{ fontSize: '20px', fontWeight: '700' }}>{stats.totalTeachers}</div>
                        </div>
                    </div>

                    <div className="progress-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="progress-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                <span style={{ color: '#828282' }}>Active</span>
                                <span style={{ fontWeight: '600' }}>{stats.activeTeachers}</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#F2F2F2', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.activePercentage}%`, height: '100%', backgroundColor: '#6C5DD3' }}></div>
                            </div>
                        </div>
                        <div className="progress-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                <span style={{ color: '#828282' }}>On Leave</span>
                                <span style={{ fontWeight: '600' }}>{stats.onLeave}</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#F2F2F2', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.onLeavePercentage}%`, height: '100%', backgroundColor: '#FF9F43' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card" style={{ padding: '5px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px', flex: '0 1 250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: '#EBF9F1', color: '#27AE60',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <MdPerson size={20} />
                        </div>
                        <div>
                            <div style={{ color: '#828282', fontSize: '13px' }}>Total number of Teachers</div>
                            <div style={{ fontSize: '20px', fontWeight: '700' }}>{stats.totalTeachers}</div>
                        </div>
                    </div>

                </div>

                <div className="dashboard-card" style={{ padding: '5px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px', flex: '0 1 250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: '#FFF8E1', color: '#FFB800',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <MdPayment size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: '#828282', fontSize: '13px' }}>Total Salary Payout</div>
                            <div style={{ fontSize: '20px', fontWeight: '700' }}>₹{totalSalaryPayout}</div>
                        </div>
                    </div>

                    <select
                        value={salaryFilter}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #E0E0E0',
                            fontSize: '12px',
                            width: '100%',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="All Schools">All Schools Overview</option>
                        {allSchoolNames.map(school => (
                            <option key={school} value={school}>
                                {school}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filter - Pushed to right or beside cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '5px 0', marginLeft: 'auto' }}>
                    <span style={{ fontSize: '13px', color: '#828282', fontWeight: '500' }}>Filter by School</span>
                    <select
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid #E0E0E0',
                            fontSize: '13px',
                            outline: 'none',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            minWidth: '220px'
                        }}
                    >
                        {schoolOptions.map(school => (
                            <option key={school} value={school}>
                                {school.charAt(0).toUpperCase() + school.slice(1)}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowManagement(!showManagement)}
                        style={{
                            marginTop: '10px',
                            padding: '10px',
                            backgroundColor: showManagement ? '#E0E0E0' : '#407BFF', // Highlight if active
                            color: showManagement ? '#333' : '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {showManagement ? 'Show Overview' : 'Manage Teachers'}
                    </button>
                </div>
            </div>

            {showManagement ? (
                <TeacherManagement selectedSchool={selectedSchool} />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {/* Bottom Row - Charts Side by Side */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px' }}>
                        <div className="dashboard-card" style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 className="card-title" style={{ margin: 0 }}>Teachers performance</h3>
                                <div style={{ display: 'flex', backgroundColor: '#F5F6FA', borderRadius: '8px', padding: '4px' }}>
                                    <button
                                        onClick={() => setActiveMetric('lessons')}
                                        style={{
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            backgroundColor: activeMetric === 'lessons' ? '#fff' : 'transparent',
                                            color: activeMetric === 'lessons' ? '#1A1A1A' : '#828282',
                                            fontSize: '12px',
                                            fontWeight: activeMetric === 'lessons' ? '600' : '400',
                                            cursor: 'pointer',
                                            boxShadow: activeMetric === 'lessons' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        Lessons completed
                                    </button>
                                    <button
                                        onClick={() => setActiveMetric('evaluations')}
                                        style={{
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            backgroundColor: activeMetric === 'evaluations' ? '#fff' : 'transparent',
                                            color: activeMetric === 'evaluations' ? '#1A1A1A' : '#828282',
                                            fontSize: '12px',
                                            fontWeight: activeMetric === 'evaluations' ? '600' : '400',
                                            cursor: 'pointer',
                                            boxShadow: activeMetric === 'evaluations' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        Evaluations scores
                                    </button>
                                </div>
                            </div>
                            <p style={{ color: '#828282', fontSize: '12px', marginTop: '-15px', marginBottom: '20px' }}>
                                Track how your teachers have performed in the last 15 days.
                            </p>
                            <div style={{ height: '250px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#BDBDBD' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#BDBDBD' }} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey={activeMetric}
                                            stroke={activeMetric === 'lessons' ? '#6C5DD3' : '#FF9F43'}
                                            strokeWidth={2}
                                            dot={{ r: 4, fill: activeMetric === 'lessons' ? '#6C5DD3' : '#FF9F43', strokeWidth: 0 }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                            animationDuration={1000}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activeMetric === 'lessons' ? '#6C5DD3' : '#FF9F43' }}></div>
                                    <span style={{ fontSize: '10px', color: '#828282' }}>01 Jan - 30 Jan</span>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-card" style={{ padding: '25px' }}>
                            <h3 className="card-title" style={{ marginBottom: '5px' }}>Teachers Attendance metrics (Last 15 days)</h3>
                            <p style={{ color: '#828282', fontSize: '12px', marginBottom: '25px' }}>
                                Check how many teachers attended in the last 15 days.
                            </p>
                            <div style={{ height: '250px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={attendanceData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }} barSize={20}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#BDBDBD' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#BDBDBD' }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {attendanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill="#6C5DD3" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6C5DD3' }}></div>
                                    <span style={{ fontSize: '10px', color: '#828282' }}>01 Jan - 15 Jan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teachers;
