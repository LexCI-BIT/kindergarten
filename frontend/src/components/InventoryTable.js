import React, { useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
const InventoryTable = ({ data = [], onEdit, onDelete }) => {
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const formattedData = data.map(item => ({
        ...item,
        stockId: item.id?.substring(0, 8),
        itemName: item.name,
        school: item.school_name
    }));

    const filteredData = formattedData.filter(item => {
        if (filterType === 'All') return true;
        return item.category === filterType;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}>
                        Inventory
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#333'
                        }}
                    >
                        <option value="All">All Items</option>
                        <option value="Book">Books</option>
                        <option value="Uniform">Uniforms</option>
                        <option value="Supplies">Supplies</option>
                    </select>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                <thead>
                    <tr style={{ backgroundColor: '#2D2D2D', color: '#fff' }}>
                        <th style={{ padding: '15px', textAlign: 'left', borderTopLeftRadius: '8px' }}>Stock ID</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Item name</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Quantity</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>School</th>
                        <th style={{ padding: '15px', textAlign: 'left', borderTopRightRadius: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#EBF2FF' : '#F8F9FA' }}>
                            <td style={{ padding: '15px', color: '#333' }}>{item.stockId}</td>
                            <td style={{ padding: '15px', color: '#333' }}>{item.itemName}</td>
                            <td style={{ padding: '15px', color: '#333' }}>{item.quantity}</td>
                            <td style={{ padding: '15px', color: '#333' }}>{item.school}</td>
                            <td style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <MdEdit
                                        size={20}
                                        color="#407BFF"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => onEdit(item)}
                                    />
                                    <MdDelete
                                        size={20}
                                        color="#407BFF"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => onDelete(item)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '5px 10px', border: 'none', background: 'transparent', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        &lt;
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{
                                padding: '5px 10px',
                                border: 'none',
                                backgroundColor: currentPage === i + 1 ? '#00BCD4' : 'transparent',
                                color: currentPage === i + 1 ? '#fff' : '#333',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '5px 10px', border: 'none', background: 'transparent', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryTable;
