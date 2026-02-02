import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { MdPeople } from 'react-icons/md';
import TopBar from '../components/TopBar';
import api from '../services/api';

const Students = () => {
    const [selectedSchool, setSelectedSchool] = useState('overall');
    const [activeMetric, setActiveMetric] = useState('assignments'); // 'assignments' or 'courses'
    const [students, setStudents] = useState([]);
    const [schools, setSchools] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, schoolsData] = await Promise.all([
                    api.getStudents(),
                    api.getSchools()
                ]);
                setStudents(studentsData);
                setSchools(schoolsData);
            } catch (error) {
                console.error("Error fetching students data:", error);
            }
        };
        fetchData();
    }, []);

    const stats = useMemo(() => {
        let filtered = students;
        if (selectedSchool !== 'overall') {
            filtered = students.filter(s => s.school_name === selectedSchool);
        }

        const total = filtered.length;
        const active = Math.floor(total * 0.95);
        const inactive = total - active;

        return {
            total: total.toLocaleString(),
            active: active.toLocaleString(),
            inactive: inactive.toLocaleString(),
            activePercentage: total > 0 ? (active / total) * 100 : 0,
            inactivePercentage: total > 0 ? (inactive / total) * 100 : 0
        };
    }, [students, selectedSchool]);

    // Zero-filled data for charts as DB doesn't have this data yet
    const performanceData = [
        { name: '01 Jan', assignments: 0, courses: 0 }, { name: '05 Jan', assignments: 0, courses: 0 },
        { name: '10 Jan', assignments: 0, courses: 0 }, { name: '15 Jan', assignments: 0, courses: 0 },
        { name: '20 Jan', assignments: 0, courses: 0 }, { name: '25 Jan', assignments: 0, courses: 0 },
        { name: '30 Jan', assignments: 0, courses: 0 },
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
                title={selectedSchool === 'overall' ? "Student Overview" : `Student Overview - ${selectedSchool}`}
                showSearch={true}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', marginTop: '-15px', marginBottom: '25px' }}>
                {/* Stats Cards Row */}
                <div className="dashboard-card" style={{ padding: '20px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px', flex: '0 1 350px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: '#EBF2FF', color: '#407BFF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <MdPeople size={20} />
                        </div>
                        <div>
                            <div style={{ color: '#828282', fontSize: '13px' }}>Total students</div>
                            <div style={{ fontSize: '20px', fontWeight: '700' }}>{stats.total}</div>
                        </div>
                    </div>

                    <div className="progress-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="progress-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                <span style={{ color: '#828282' }}>Active</span>
                                <span style={{ fontWeight: '600' }}>{stats.active}</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#F2F2F2', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.activePercentage}%`, height: '100%', backgroundColor: '#27AE60' }}></div>
                            </div>
                        </div>
                        <div className="progress-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                <span style={{ color: '#828282' }}>Inactive</span>
                                <span style={{ fontWeight: '600' }}>{stats.inactive}</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#F2F2F2', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.inactivePercentage}%`, height: '100%', backgroundColor: '#EB5757' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card" style={{ padding: '20px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px', flex: '0 1 350px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: '#EBF9F1', color: '#27AE60',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <MdPeople size={20} />
                        </div>
                        <div>
                            <div style={{ color: '#828282', fontSize: '13px' }}>Total number of Students</div>
                            <div style={{ fontSize: '20px', fontWeight: '700' }}>{stats.total}</div>
                        </div>
                    </div>

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
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {/* Bottom Row - Charts Side by Side */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '25px' }}>
                    <div className="dashboard-card" style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 className="card-title" style={{ margin: 0 }}>Student performance</h3>
                            <div style={{ display: 'flex', backgroundColor: '#F5F6FA', borderRadius: '8px', padding: '4px' }}>
                                <button
                                    onClick={() => setActiveMetric('assignments')}
                                    style={{
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        backgroundColor: activeMetric === 'assignments' ? '#fff' : 'transparent',
                                        color: activeMetric === 'assignments' ? '#1A1A1A' : '#828282',
                                        fontSize: '12px',
                                        fontWeight: activeMetric === 'assignments' ? '600' : '400',
                                        cursor: 'pointer',
                                        boxShadow: activeMetric === 'assignments' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Assignments
                                </button>
                                <button
                                    onClick={() => setActiveMetric('courses')}
                                    style={{
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        backgroundColor: activeMetric === 'courses' ? '#fff' : 'transparent',
                                        color: activeMetric === 'courses' ? '#1A1A1A' : '#828282',
                                        fontSize: '12px',
                                        fontWeight: activeMetric === 'courses' ? '600' : '400',
                                        cursor: 'pointer',
                                        boxShadow: activeMetric === 'courses' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Courses
                                </button>
                            </div>
                        </div>
                        <p style={{ color: '#828282', fontSize: '12px', marginTop: '-15px', marginBottom: '20px' }}>
                            Track how your student has performed in the last 15 days.
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
                                        stroke={activeMetric === 'assignments' ? '#407BFF' : '#FF9F43'}
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: activeMetric === 'assignments' ? '#407BFF' : '#FF9F43', strokeWidth: 0 }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                        animationDuration={1000}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activeMetric === 'assignments' ? '#407BFF' : '#FF9F43' }}></div>
                                <span style={{ fontSize: '10px', color: '#828282' }}>01 Jan - 30 Jan</span>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card" style={{ padding: '25px' }}>
                        <h3 className="card-title" style={{ marginBottom: '5px' }}>Student Attendance metrics (Last 30 days)</h3>
                        <p style={{ color: '#828282', fontSize: '12px', marginBottom: '25px' }}>
                            Check how many students attended in the last 15 days.
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
                                            <Cell key={`cell-${index}`} fill="#2F80ED" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2F80ED' }}></div>
                                <span style={{ fontSize: '10px', color: '#828282' }}>01 Jan - 30 Jan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Students;
