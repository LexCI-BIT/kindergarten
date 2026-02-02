import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    MdDashboard,
    MdPeople,
    MdSchool,
    MdAdminPanelSettings,
    MdCampaign,
    MdInventory2,
    MdSettings,
    MdLogout,
    MdBusiness,
    MdPerson,
    MdSupervisorAccount,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdAttachMoney
} from 'react-icons/md';

const Sidebar = ({ isOpen, onClose }) => {
    const [isPeopleOpen, setIsPeopleOpen] = useState(false);
    const [user, setUser] = useState({ name: 'Nagarjuna', initials: 'TN' });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('kg_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user data in Sidebar", e);
            }
        }
    }, []);

    const togglePeople = () => setIsPeopleOpen(!isPeopleOpen);

    const handleItemClick = () => {
        if (window.innerWidth <= 768 && onClose) {
            onClose();
        }
    };

    return (
        <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
                <img src="/kindies_logo.png" alt="Kindies Logo" className="sidebar-logo" style={{ maxHeight: '100px', width: '100%', objectFit: 'contain' }} />
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    onClick={handleItemClick}
                >
                    <MdDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <div className="nav-item-group">
                    <div className={`nav-item ${isPeopleOpen ? 'active-group' : ''}`} onClick={togglePeople}>
                        <MdPeople size={20} />
                        <span>People</span>
                        <span className="arrow-icon">
                            {isPeopleOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                        </span>
                    </div>

                    {isPeopleOpen && (
                        <div className="submenu">
                            <NavLink
                                to="/students"
                                className={({ isActive }) => isActive ? 'nav-item submenu-item active' : 'nav-item submenu-item'}
                                onClick={handleItemClick}
                            >
                                <MdBusiness size={18} />
                                <span>Students</span>
                            </NavLink>
                            <NavLink
                                to="/teachers"
                                className={({ isActive }) => isActive ? 'nav-item submenu-item active' : 'nav-item submenu-item'}
                                onClick={handleItemClick}
                            >
                                <MdPerson size={18} />
                                <span>Teachers</span>
                            </NavLink>
                            <NavLink
                                to="/parents"
                                className={({ isActive }) => isActive ? 'nav-item submenu-item active' : 'nav-item submenu-item'}
                                onClick={handleItemClick}
                            >
                                <MdSupervisorAccount size={18} />
                                <span>Parents</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink
                    to="/schools"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    onClick={handleItemClick}
                >
                    <MdSchool size={20} />
                    <span>Schools</span>
                </NavLink>

                <NavLink
                    to="/admins"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    onClick={handleItemClick}
                >
                    <MdAdminPanelSettings size={20} />
                    <span>Admins</span>
                </NavLink>

                <NavLink
                    to="/fee-status"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    onClick={handleItemClick}
                >
                    <MdAttachMoney size={20} />
                    <span>Fee Status</span>
                </NavLink>

                <NavLink
                    to="/announcements"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    onClick={handleItemClick}
                >
                    <MdCampaign size={20} />
                    <span>Announcements</span>
                </NavLink>

                <NavLink
                    to="/stock-report"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    onClick={handleItemClick}
                >
                    <MdInventory2 size={20} />
                    <span>Stock Report</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="profile-image-container">
                        <img src={user?.photo || "/user.png"} alt="Profile" className="sidebar-profile-image" />
                    </div>
                    <div className="user-info">
                        <h4>{user?.name || 'User'}</h4>
                        <span className="badge">Super Admin</span>
                    </div>
                </div>

                <div className="footer-links">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => isActive ? 'footer-item active' : 'footer-item'}
                        onClick={handleItemClick}
                        style={{ textDecoration: 'none' }}
                    >
                        <MdSettings size={18} />
                        <span>Settings</span>
                    </NavLink>
                    <div
                        className="footer-item logout"
                        onClick={() => {
                            handleItemClick();
                            localStorage.removeItem('kg_user');
                            navigate('/login');
                        }}
                    >
                        <MdLogout size={18} />
                        <span>Log out</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
