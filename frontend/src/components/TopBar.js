import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdSearch,
    MdNotifications,
    MdHelp,
    MdKeyboardArrowDown,
    MdSettings,
    MdLogout
} from 'react-icons/md';

const TopBar = ({ title, showSearch = true }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState({ name: 'Nagarjuna', initials: 'TN' });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Define searchable pages and features
    const searchableItems = [
        { name: 'Dashboard', path: '/dashboard', keywords: ['home', 'overview', 'main', 'stats'] },
        { name: 'Schools', path: '/schools', keywords: ['school', 'institutions', 'manage schools'] },
        { name: 'Admins', path: '/admins', keywords: ['admin', 'administrators', 'manage admins'] },
        { name: 'Teachers', path: '/teachers', keywords: ['teacher', 'staff', 'faculty', 'manage teachers'] },
        { name: 'Students', path: '/students', keywords: ['student', 'pupils', 'manage students'] },
        { name: 'Parents', path: '/parents', keywords: ['parent', 'guardian', 'family', 'manage parents'] },
        { name: 'Fee Status', path: '/fee-status', keywords: ['fee', 'payment', 'finance', 'money', 'paid', 'unpaid', 'pending'] },
        { name: 'Inventory', path: '/inventory', keywords: ['inventory', 'stock', 'supplies', 'items'] },
        { name: 'Stock Report', path: '/stock-report', keywords: ['stock', 'report', 'inventory report'] },
        { name: 'Announcements', path: '/announcements', keywords: ['announcement', 'news', 'broadcast', 'message'] },
        { name: 'Support Tickets', path: '/support-tickets', keywords: ['support', 'ticket', 'help', 'issue', 'problem'] },
        { name: 'Notes', path: '/notes', keywords: ['note', 'documentation', 'memo'] },
        { name: 'Settings', path: '/settings', keywords: ['setting', 'preferences', 'configuration', 'profile'] },
        { name: 'Help & Support', path: '/help', keywords: ['help', 'support', 'faq', 'guide', 'documentation'] }
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem('kg_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleLogout = () => {
        localStorage.removeItem('kg_user');
        navigate('/login');
    };

    const handleSettings = () => {
        navigate('/settings');
        setIsDropdownOpen(false);
    };

    // Search functionality
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSelectedIndex(-1);

        if (query.trim() === '') {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        // Filter and rank results
        const results = searchableItems
            .filter(item => {
                const searchLower = query.toLowerCase();
                return (
                    item.name.toLowerCase().includes(searchLower) ||
                    item.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
                );
            })
            .slice(0, 6); // Limit to 6 results

        setSearchResults(results);
        setShowSearchResults(results.length > 0);
    };

    const handleSearchSelect = (path) => {
        navigate(path);
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const handleSearchKeyDown = (e) => {
        if (!showSearchResults) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < searchResults.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && searchResults[selectedIndex]) {
                handleSearchSelect(searchResults[selectedIndex].path);
            } else if (searchResults.length > 0) {
                handleSearchSelect(searchResults[0].path);
            }
        } else if (e.key === 'Escape') {
            setShowSearchResults(false);
            setSearchQuery('');
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getFirstName = () => {
        const name = user?.name || 'User';
        return typeof name === 'string' ? name.split(' ')[0] : 'User';
    };

    return (
        <div className="dashboard-top-bar">
            <div className="dashboard-header-text">
                <h2>{title}</h2>
                <p>Welcome back, {getFirstName()}! Here's an overview of your platform.</p>
            </div>

            {showSearch && (
                <div className="search-container" ref={searchRef}>
                    <div className="header-search">
                        <MdSearch size={22} color="#828282" />
                        <input
                            type="text"
                            placeholder="Search pages, features..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                            onFocus={() => searchQuery && setShowSearchResults(true)}
                        />
                    </div>

                    {showSearchResults && (
                        <div className="search-results-dropdown">
                            {searchResults.map((item, index) => (
                                <div
                                    key={item.path}
                                    className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                    onClick={() => handleSearchSelect(item.path)}
                                >
                                    <MdSearch size={18} color="#828282" />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="header-actions">
                <div className="icon-btn">
                    <MdNotifications size={22} />
                    <span className="dot"></span>
                </div>
                <div className="icon-btn" onClick={() => navigate('/help')}>
                    <MdHelp size={22} />
                </div>

                <div className="header-profile-container" ref={dropdownRef}>
                    <div className="header-profile" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
                        <div className="profile-image-container">
                            <img src={user?.photo || "/user.png"} alt="Profile" className="profile-image-circle" />
                        </div>
                        <span className="profile-name">{user?.name || 'User'}</span>
                        <MdKeyboardArrowDown
                            size={20}
                            style={{
                                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                            }}
                        />
                    </div>

                    {isDropdownOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-item" onClick={handleSettings}>
                                <MdSettings size={18} />
                                <span>Settings</span>
                            </div>
                            <div className="dropdown-item logout" onClick={handleLogout}>
                                <MdLogout size={18} />
                                <span>Log out</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
