import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/TopBar';
import api from '../services/api';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import EditParentModal from '../components/EditParentModal';

const Parents = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') === 'complaints' ? 'complaints' : 'list';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [allParents, setAllParents] = useState([]);
    const [parents, setParents] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtering & Pagination State
    const [selectedSchool, setSelectedSchool] = useState('overall');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);

    // Modal State
    const [editingParent, setEditingParent] = useState(null);
    const [deletingParent, setDeletingParent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [studentsData, complaintsData, schoolsData] = await Promise.all([
                    api.getStudents(),
                    api.getComplaints(),
                    api.getSchools()
                ]);

                // Map students to parent-like structure
                const pData = studentsData.map(s => ({
                    id: s.id,
                    studentId: s.student_id,
                    name: s.parent_name || 'Guardian',
                    studentName: s.name,
                    school: s.school_name,
                    phone: s.phone || 'N/A'
                }));

                setAllParents(pData);
                setComplaints(complaintsData.map(c => ({
                    ...c,
                    parentName: c.parent_id // Migrated data put name here
                })));
                setSchools(schoolsData.map(sch => sch.name));
            } catch (error) {
                console.error("Error fetching parents data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Update tab if URL changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab === 'complaints') setActiveTab('complaints');
        else if (tab === 'list') setActiveTab('list');
    }, [location.search]);

    // Filter parents when selectedSchool or allParents changes
    useEffect(() => {
        if (selectedSchool === 'overall') {
            setParents(allParents);
        } else {
            setParents(allParents.filter(p => p.school === selectedSchool));
        }
        setCurrentPage(1);
    }, [selectedSchool, allParents]);

    // Pagination Logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = parents.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(parents.length / rowsPerPage);

    // Action Handlers
    const handleEdit = (parent) => {
        setEditingParent(parent);
    };

    const handleDelete = (parent) => {
        setDeletingParent(parent);
    };

    const handleSaveEdit = (updatedParent) => {
        setParents(parents.map(p => p.id === updatedParent.id ? updatedParent : p));
        setEditingParent(null);
    };

    const confirmDelete = () => {
        if (deletingParent) {
            setParents(parents.filter(p => p.id !== deletingParent.id));
            setDeletingParent(null);
        }
    };

    return (
        <div className="dashboard-container">
            <TopBar title="Parents & Complaints" showSearch={true} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '10px', borderBottom: '1px solid #E0E0E0' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button
                        onClick={() => setActiveTab('list')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'list' ? '3px solid #6C5DD3' : '3px solid transparent',
                            color: activeTab === 'list' ? '#6C5DD3' : '#828282',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Parents List
                    </button>
                    <button
                        onClick={() => setActiveTab('complaints')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'complaints' ? '3px solid #6C5DD3' : '3px solid transparent',
                            color: activeTab === 'complaints' ? '#6C5DD3' : '#828282',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Complaints
                    </button>
                </div>

                {/* Filter Dropdown */}
                {activeTab === 'list' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Filter by School:</span>
                        <select
                            value={selectedSchool}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #E0E0E0',
                                fontSize: '14px',
                                outline: 'none',
                                cursor: 'pointer',
                                minWidth: '200px'
                            }}
                        >
                            <option value="overall">Overall</option>
                            {schools.map(school => (
                                <option key={school} value={school}>{school}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {activeTab === 'list' && (
                <div>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#2D2D2D', color: '#fff' }}>
                                <tr>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Student ID</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Parent Name</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Student Name</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>School</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Phone</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((parent, index) => (
                                    <tr key={parent.id} style={{ backgroundColor: index % 2 === 0 ? '#F5F7FF' : '#fff', borderBottom: '1px solid #EDF2F7' }}>
                                        <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333', fontWeight: '500' }}>{parent.studentId}</td>
                                        <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333' }}>{parent.name}</td>
                                        <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333' }}>{parent.studentName}</td>
                                        <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333' }}>{parent.school}</td>
                                        <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333' }}>{parent.phone}</td>
                                        <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                <button
                                                    onClick={() => handleEdit(parent)}
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: '#2F80ED', fontSize: '18px', display: 'flex', alignItems: 'center'
                                                    }}
                                                    title="Edit"
                                                >
                                                    <MdModeEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(parent)}
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: '#EB5757', fontSize: '18px', display: 'flex', alignItems: 'center'
                                                    }}
                                                    title="Delete"
                                                >
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', backgroundColor: '#F5F5F5', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                            >
                                &lt;
                            </button>
                            {(() => {
                                const maxButtons = 8;
                                let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                                let endPage = Math.min(totalPages, startPage + maxButtons - 1);

                                if (endPage - startPage + 1 < maxButtons) {
                                    startPage = Math.max(1, endPage - maxButtons + 1);
                                }

                                return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        style={{
                                            width: '32px', height: '32px', borderRadius: '6px', border: 'none',
                                            backgroundColor: currentPage === page ? '#14B8A6' : '#fff',
                                            color: currentPage === page ? '#fff' : '#333',
                                            cursor: 'pointer', fontWeight: '600'
                                        }}
                                    >
                                        {page}
                                    </button>
                                ));
                            })()}
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', backgroundColor: '#F5F5F5', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {activeTab === 'complaints' && (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#2D2D2D', color: '#fff' }}>
                            <tr>
                                <th style={{ padding: '15px 25px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>ID</th>
                                <th style={{ padding: '15px 25px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Parent</th>
                                <th style={{ padding: '15px 25px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Subject</th>
                                <th style={{ padding: '15px 25px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Date</th>
                                <th style={{ padding: '15px 25px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '15px 25px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((complaint, index) => (
                                <tr key={complaint.id} style={{ backgroundColor: index % 2 === 0 ? '#F5F7FF' : '#fff', borderBottom: '1px solid #EDF2F7' }}>
                                    <td style={{ padding: '15px 25px', fontSize: '14px', color: '#333', fontWeight: '500' }}>{complaint.id}</td>
                                    <td style={{ padding: '15px 25px', fontSize: '14px', color: '#333' }}>{complaint.parentName}</td>
                                    <td style={{ padding: '15px 25px', fontSize: '14px', color: '#333', fontWeight: '500' }}>{complaint.subject}</td>
                                    <td style={{ padding: '15px 25px', fontSize: '14px', color: '#333' }}>{complaint.date}</td>
                                    <td style={{ padding: '15px 25px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                            backgroundColor: complaint.status === 'Resolved' ? '#EBF9F1' : complaint.status === 'Pending' ? '#FFF5E5' : '#EBF3FF',
                                            color: complaint.status === 'Resolved' ? '#27AE60' : complaint.status === 'Pending' ? '#F2994A' : '#2F80ED'
                                        }}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 25px', fontSize: '13px', color: '#555', maxWidth: '300px' }}>{complaint.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            {editingParent && (
                <EditParentModal
                    parent={editingParent}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingParent(null)}
                />
            )}

            {deletingParent && (
                <DeleteConfirmationModal
                    itemName={deletingParent.name}
                    itemType="Parent"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingParent(null)}
                />
            )}
        </div>
    );
};

export default Parents;
