import React from 'react';

const StatCard = ({ icon, bg, label, value, growth }) => {
    return (
        <div className="stat-card dashboard-card">
            <div className="stat-card-top">
                <div className="stat-icon" style={{ backgroundColor: bg }}>
                    {icon}
                </div>
                <div className="stat-info">
                    <span className="stat-label">{label}</span>
                    <h3 className="stat-value">{value}</h3>
                </div>
            </div>
            {growth && (
                <div className="stat-growth">
                    <span className="growth-indicator">↑ {growth} from last month</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
