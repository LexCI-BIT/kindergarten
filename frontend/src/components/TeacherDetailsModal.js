import React from 'react';
import { MdClose, MdEventNote, MdAssignment } from 'react-icons/md';

const TeacherDetailsModal = ({ teacher, onClose }) => {
    if (!teacher) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: '15px', width: '450px',
                padding: '25px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '20px', right: '20px',
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#828282'
                    }}
                >
                    <MdClose />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                    <img
                        src={teacher.photo}
                        alt={teacher.name}
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                        <div style={{ fontSize: '12px', color: '#828282' }}>{teacher.id}</div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '2px 0' }}>{teacher.name}</h2>
                        <div style={{ fontSize: '12px', color: '#828282' }}>Joined in {teacher.enrolledYear}</div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#EEF2FF', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Contact info</h3>
                    <div style={{ fontSize: '13px', color: '#4F4F4F', marginBottom: '8px' }}>{teacher.phone}</div>
                    <div style={{ fontSize: '13px', color: '#828282', lineHeight: '1.4' }}>{teacher.address}</div>

                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginTop: '20px', marginBottom: '5px' }}>Qualification</h3>
                    <div style={{ fontSize: '13px', color: '#4F4F4F' }}>{teacher.qualification}</div>

                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginTop: '20px', marginBottom: '5px' }}>Salary</h3>
                    <div style={{ fontSize: '13px', color: '#4F4F4F' }}>₹{teacher.salary}</div>
                </div>

                <div style={{ backgroundColor: '#EEF2FF', borderRadius: '12px', padding: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '15px' }}>Statistics</h3>
                    <div style={{ fontSize: '10px', color: '#828282', marginBottom: '15px' }}>January - June 2025</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                backgroundColor: '#2F80ED', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <MdEventNote size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>Attendance</div>
                                <div style={{ fontSize: '13px', fontWeight: '700' }}>{teacher.stats.attendance}%</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                backgroundColor: '#27AE60', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <MdAssignment size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600' }}>Tasks & Exam</div>
                                <div style={{ fontSize: '13px', fontWeight: '700' }}>{teacher.stats.tasks}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDetailsModal;
