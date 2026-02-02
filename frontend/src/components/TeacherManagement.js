import React, { useState, useEffect } from 'react';
import { MdVisibility, MdDelete } from 'react-icons/md';
import api from '../services/api';
import TeacherDetailsModal from './TeacherDetailsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const TeacherManagement = ({ selectedSchool }) => {
    const [allTeachers, setAllTeachers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [selectedTeacher, setSelectedTeacher] = useState(null); // For details modal
    const [teacherToDelete, setTeacherToDelete] = useState(null); // For delete modal

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                const data = await api.getTeachers();
                const formatted = data.map(t => ({
                    ...t,
                    school: t.school_name,
                    enrolledYear: t.enrolled_year,
                    salary: t.salary?.toLocaleString() || '0'
                }));
                setAllTeachers(formatted);
            } catch (error) {
                console.error("Error fetching teachers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

    // Filter teachers when selectedSchool or allTeachers changes
    useEffect(() => {
        if (selectedSchool === 'overall') {
            setTeachers(allTeachers);
        } else {
            setTeachers(allTeachers.filter(t => t.school === selectedSchool));
        }
        setCurrentPage(1); // Reset to first page on filter change
    }, [selectedSchool, allTeachers]);

    // Pagination Logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = teachers.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(teachers.length / rowsPerPage);

    const handleDelete = () => {
        if (teacherToDelete) {
            setTeachers(teachers.filter(t => t.id !== teacherToDelete.id));
            setTeacherToDelete(null);
            // Reset to page 1 if current page becomes empty
            if (currentRows.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    return (
        <div>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#2D2D2D', color: '#fff' }}>
                        <tr>
                            <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>User ID</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>School</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Enrolled year</th>
                            <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Salary (₹)</th>
                            <th style={{ padding: '12px 15px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((teacher, index) => (
                            <tr key={teacher.id} style={{ backgroundColor: index % 2 === 0 ? '#F5F7FF' : '#fff', borderBottom: '1px solid="#EDF2F7"' }}>
                                <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333', fontWeight: '500' }}>{teacher.id}</td>
                                <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333', fontWeight: '500' }}>{teacher.name}</td>
                                <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333' }}>{teacher.school}</td>
                                <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333' }}>{teacher.enrolledYear}</td>
                                <td style={{ padding: '12px 15px', fontSize: '14px', color: '#333', fontWeight: '500' }}>₹{teacher.salary}</td>
                                <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                        <button
                                            onClick={() => setSelectedTeacher(teacher)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#407BFF' }}
                                        >
                                            <MdVisibility size={20} />
                                        </button>
                                        <button
                                            onClick={() => setTeacherToDelete(teacher)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#407BFF' }}
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
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

            {/* Modals */}
            {selectedTeacher && (
                <TeacherDetailsModal
                    teacher={selectedTeacher}
                    onClose={() => setSelectedTeacher(null)}
                />
            )}

            {teacherToDelete && (
                <DeleteConfirmationModal
                    itemName={teacherToDelete.name}
                    itemType="Teacher"
                    onConfirm={handleDelete}
                    onCancel={() => setTeacherToDelete(null)}
                />
            )}
        </div>
    );
};

export default TeacherManagement;
