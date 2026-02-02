import React, { useState, useEffect, useMemo } from 'react';
import { MdTrendingUp, MdMenuBook, MdCheckroom, MdInventory, MdWarning } from 'react-icons/md';
import TopBar from '../components/TopBar';
import InventoryTable from '../components/InventoryTable';
import { AddStockModal, LowStockModal, EditStockModal, DeleteStockConfirmation } from '../components/StockModals';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fontSize: '13px', fontWeight: 'bold' }}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const QuickActionItem = ({ icon, label, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            backgroundColor: '#fff',
            border: '1px solid #eee',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'center',
            gap: '12px',
            transition: 'all 0.2s ease',
            minHeight: '120px'
        }}
    >
        <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: label.includes('Uniform') ? '#E8F0FF' : label.includes('Book') ? '#E8F0FF' : '#FFEAEA',
            color: label.includes('Uniform') ? '#407BFF' : label.includes('Book') ? '#407BFF' : '#EA5455',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
        }}>
            {icon}
        </div>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{label}</span>
    </div>
);

const StockReport = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('report');
    const [activeModal, setActiveModal] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true);
                const data = await api.getInventory();
                setInventory(data);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const statsData = useMemo(() => {
        const totalStock = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const lowStockItems = inventory.filter(item => (item.quantity || 0) < 20).length;
        const categories = [...new Set(inventory.map(item => item.category))].length;

        return {
            totalStock: totalStock.toLocaleString(),
            lowStockItems: lowStockItems.toString(),
            categories: categories.toString()
        };
    }, [inventory]);

    const stats = [
        { id: 1, label: 'Total Stock items', value: statsData.totalStock, icon: <MdInventory />, bg: '#E8F0FF', color: '#407BFF', growth: '12%' },
        { id: 2, label: 'Low stock items', value: statsData.lowStockItems, icon: <MdWarning />, bg: '#FFEAEA', color: '#EA5455' },
        { id: 3, label: 'Total categories', value: statsData.categories, icon: <MdCheckroom />, bg: '#E8F0FF', color: '#407BFF' },
    ];

    const chartData = {
        bar: [
            { label: 'Uniforms', value: inventory.filter(i => i.category === 'Uniform').reduce((sum, i) => sum + (i.quantity || 0), 0), color: '#407BFF' },
            { label: 'Books', value: inventory.filter(i => i.category === 'Book').reduce((sum, i) => sum + (i.quantity || 0), 0), color: '#6C5DD3' },
            { label: 'Others', value: inventory.filter(i => i.category !== 'Uniform' && i.category !== 'Book').reduce((sum, i) => sum + (i.quantity || 0), 0), color: '#FF9F43' },
        ],
        pie: [
            { label: 'Uniforms', value: inventory.filter(i => i.category === 'Uniform').length, color: '#407BFF' },
            { label: 'Books', value: inventory.filter(i => i.category === 'Book').length, color: '#6C5DD3' },
            { label: 'Others', value: inventory.filter(i => i.category !== 'Uniform' && i.category !== 'Book').length, color: '#FF9F43' },
        ]
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setActiveModal('edit');
    };

    const handleDelete = (item) => {
        setSelectedItem(item);
        setActiveModal('delete');
    };

    const handleConfirmDelete = () => {
        setActiveModal(null);
        setSelectedItem(null);
    };

    const handleSaveStock = (data) => {
        if (data) {
            const message = `${data.type || 'Items'} added for ${data.school || 'School'} - ${data.quantity}`;
            setToastMessage(message);
            setTimeout(() => setToastMessage(null), 3000);
        }

        setActiveModal(null);
        setView('inventory');
    };


    return (
        <div className="dashboard-container" style={{ position: 'relative' }}>
            <TopBar title={view === 'report' ? "Stock Report" : "Manage Inventory"} showSearch={true} />

            {view === 'report' ? (
                <>

                    {/* Summary Cards */}
                    <div className="stats-grid">
                        {stats.map((stat) => (
                            <div className="dashboard-card stat-card" key={stat.id}>
                                <div className="stat-card-top">
                                    <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                                        {stat.icon}
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-label">{stat.label}</span>
                                        <h3 className="stat-value">{stat.value}</h3>
                                    </div>
                                </div>
                                {stat.growth && (
                                    <div className="stat-growth">
                                        <MdTrendingUp /> {stat.growth} from last month
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px', marginBottom: '20px' }}>
                        {/* Charts Section */}
                        <div className="dashboard-card" style={{ flex: 2, padding: '20px', paddingBottom: '20px' }}>
                            <h3 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '20px' }}>Stock Reports</h3>
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: 1.5 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={chartData.bar} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="label" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                                                {chartData.bar.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                                        {chartData.bar.map((entry, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
                                                <div style={{ width: '8px', height: '8px', backgroundColor: entry.color }}></div>
                                                {entry.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={chartData.pie}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={0}
                                                outerRadius={80}
                                                dataKey="value"
                                                label={renderCustomizedLabel}
                                                labelLine={false}
                                            >
                                                {chartData.pie.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                                        {chartData.pie.map((entry, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
                                                <div style={{ width: '8px', height: '8px', backgroundColor: entry.color, borderRadius: '2px' }}></div>
                                                {entry.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Section */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <h3 style={{ fontSize: '16px', color: '#333', margin: '0 0 5px 0' }}>Quick Actions</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <QuickActionItem
                                    icon={<MdCheckroom />}
                                    label="Add Uniform Stock"
                                    onClick={() => setActiveModal('addUniform')}
                                />
                                <QuickActionItem
                                    icon={<MdMenuBook />}
                                    label="Add Book Stock"
                                    onClick={() => setActiveModal('addBook')}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                <QuickActionItem
                                    icon={<MdWarning />}
                                    label="Add Low Stock Items"
                                    onClick={() => setActiveModal('lowStock')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock Inventory Banner */}
                    <div style={{
                        marginTop: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #eee',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <MdInventory size={20} />
                            </div>
                            <span style={{ fontWeight: '500', color: '#333' }}>Stock Inventory</span>
                        </div>
                        <button
                            onClick={() => setView('inventory')}
                            style={{
                                backgroundColor: '#2F65F8',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '10px 24px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}>
                            View Inventory
                        </button>
                    </div>
                </>
            ) : (
                <div className="inventory-view-container">
                    <InventoryTable data={inventory} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            )}

            {/* Toast Message */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    zIndex: 2000,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    animation: 'fadeIn 0.3s ease-in-out'
                }}>
                    {toastMessage}
                </div>
            )}


            {/* Modals */}
            <AddStockModal
                isOpen={activeModal === 'addUniform'}
                onClose={(data) => {
                    if (data && data.type) handleSaveStock(data);
                    else setActiveModal(null);
                }}
                type="Uniform"
            />
            <AddStockModal
                isOpen={activeModal === 'addBook'}
                onClose={(data) => {
                    if (data && data.type) handleSaveStock(data);
                    else setActiveModal(null);
                }}
                type="Book"
            />
            <LowStockModal
                isOpen={activeModal === 'lowStock'}
                onClose={(data) => {
                    if (data && data.type) handleSaveStock(data);
                    else setActiveModal(null);
                }}
            />
            <EditStockModal
                isOpen={activeModal === 'edit'}
                onClose={() => { setActiveModal(null); setSelectedItem(null); }}
                item={selectedItem}
            />
            <DeleteStockConfirmation
                isOpen={activeModal === 'delete'}
                onClose={() => { setActiveModal(null); setSelectedItem(null); }}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
};

export default StockReport;
