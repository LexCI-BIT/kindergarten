import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import FinancialChart from '../components/FinancialChart';
import QuickActions from '../components/QuickActions';
import InventorySection from '../components/InventorySection';
import SupportTickets from '../components/SupportTickets';
import TopBar from '../components/TopBar';
import api from '../services/api';
import {
    MdSchool,
    MdPerson,
    MdGroups,
    MdFamilyRestroom
} from 'react-icons/md';

const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getDashboardStats();

                // Map API data to the format used by StatCard
                const formattedStats = [
                    {
                        id: 1,
                        icon: <MdSchool size={30} color="#407BFF" />,
                        bg: "#EBF2FF",
                        label: "Total Schools",
                        value: data.totalSchools.toString(),
                        growth: data.growth.schools
                    },
                    {
                        id: 2,
                        icon: <MdPerson size={30} color="#2ECC71" />,
                        bg: "#EBF9F1",
                        label: "Total number of Students",
                        value: data.totalStudents.toLocaleString(),
                        growth: data.growth.students
                    },
                    {
                        id: 3,
                        icon: <MdGroups size={30} color="#FF9F43" />,
                        bg: "#FFF5eb",
                        label: "Total number of Teachers",
                        value: data.totalTeachers.toLocaleString(),
                        growth: data.growth.teachers
                    },
                    {
                        id: 4,
                        icon: <MdFamilyRestroom size={30} color="#407BFF" />,
                        bg: "#EBF2FF",
                        label: "Total number of Admins",
                        value: data.totalAdmins.toString(),
                        growth: data.growth.admins
                    }
                ];
                setStats(formattedStats);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-container">
            <TopBar title="Super Admin Dashboard" showSearch={true} />

            <div className="stats-grid">
                {loading ? (
                    <div style={{ textAlign: 'center', gridColumn: 'span 4', padding: '20px' }}>Loading statistics...</div>
                ) : (
                    stats.map((stat) => (
                        <StatCard
                            key={stat.id}
                            icon={stat.icon}
                            bg={stat.bg}
                            label={stat.label}
                            value={stat.value}
                            growth={stat.growth}
                        />
                    ))
                )}
            </div>

            <div className="main-grid">
                <div className="left-column">
                    <FinancialChart />
                    <InventorySection />
                </div>
                <div className="right-column">
                    <QuickActions />
                    <SupportTickets />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
