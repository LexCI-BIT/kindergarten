import React, { useState, useEffect } from 'react';
import { MdWarning, MdShoppingBag, MdCollections } from 'react-icons/md';
import api from '../services/api';

const InventoryItem = ({ icon, bg, color, label, value }) => (
    <div className="inventory-card">
        <div className="inv-icon" style={{ backgroundColor: bg, color: color }}>
            {icon}
        </div>
        <div className="inv-info">
            <span className="inv-label">{label}</span>
            <h3 className="inv-value">{value}</h3>
        </div>
    </div>
);

const InventorySection = () => {
    const [stats, setStats] = useState({ totalQuantity: 0, totalItems: 0, lowStockCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const data = await api.getInventory();
                const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
                const lowStockItems = data.filter(item => (item.quantity || 0) < 500);

                setStats({
                    totalQuantity,
                    totalItems: data.length,
                    lowStockCount: lowStockItems.length
                });
            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const items = [
        {
            id: 1,
            icon: <MdShoppingBag size={24} />,
            bg: '#EBF2FF',
            color: '#407BFF',
            label: 'Total Stock Quantity',
            value: stats.totalQuantity.toLocaleString()
        },
        {
            id: 2,
            icon: <MdCollections size={24} />,
            bg: '#EBF9F1',
            color: '#2ECC71',
            label: 'Categories in Stock',
            value: stats.totalItems.toString()
        }
    ];

    return (
        <div className="inventory-wrapper">
            <h3 className="section-title" style={{ marginBottom: '15px' }}>Inventory Summary</h3>

            <div className="inventory-top-row">
                {items.map((item) => (
                    <InventoryItem
                        key={item.id}
                        icon={item.icon}
                        bg={item.bg}
                        color={item.color}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </div>

            <div className="inventory-alert-card">
                <div className="alert-icon-wrapper">
                    <MdWarning size={24} color="#EA5455" />
                </div>
                <div className="alert-info">
                    <span className="alert-label">Low Stock Alerts</span>
                    <h3 className="alert-count">{loading ? '...' : `${stats.lowStockCount} Items`}</h3>
                </div>
                <div className="alert-priority">
                    <span className="priority-dot"></span> {loading ? '...' : `${stats.lowStockCount > 10 ? 'high' : 'medium'} priority`}
                </div>
            </div>
        </div>
    );
};

export default InventorySection;
