import React, { useState, useEffect } from 'react';
import { MdAttachFile, MdCalendarToday, MdInsertDriveFile } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import api from '../services/api';

const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [sendImmediately, setSendImmediately] = useState(false);
    const [scheduleForLater, setScheduleForLater] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [attachedFile, setAttachedFile] = useState(null);
    const [allSchoolAdmins, setAllSchoolAdmins] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                setLoading(true);
                const data = await api.getSchools();
                setSchools(data);
            } catch (error) {
                console.error("Error fetching schools:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchools();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters long';
        }
        if (message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters long';
        }
        if (!allSchoolAdmins && !selectedSchool) {
            newErrors.recipients = 'Please select at least one recipient type';
        }
        if (scheduleForLater) {
            if (!selectedDate) newErrors.date = 'Please select a date';
            if (!selectedTime) newErrors.time = 'Please select a time';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert('File exceeds 10MB limit');
                return;
            }
            setAttachedFile(file);
            setErrors(prev => ({ ...prev, file: '' }));
        }
    };

    const handleRemoveFile = () => {
        setAttachedFile(null);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Sending announcement...');
            alert('Announcement sent successfully!');
            navigate('/announcements');
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="dashboard-container">
            <TopBar title="Create Announcements" showSearch={true} />

            {/* Main Form */}
            <form className="announcement-form-container" onSubmit={handleSend} noValidate>
                <div className="dashboard-card announcement-form-card">
                    {/* Title Section */}
                    <div className={`form-section ${errors.title ? 'has-error' : ''}`}>
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="announcement-input"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                            }}
                            required
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    {/* Message Section */}
                    <div className={`form-section ${errors.message ? 'has-error' : ''}`}>
                        <label className="form-label">Message</label>
                        <textarea
                            className="announcement-textarea"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                            }}
                            rows={6}
                            required
                        />
                        {errors.message && <span className="error-message">{errors.message}</span>}
                    </div>

                    <div className="form-section">
                        <label className="form-label">Send To</label>
                        <div className="recipient-selection-row">
                            <label className="checkbox-label" style={{ whiteSpace: 'nowrap' }}>
                                <input
                                    type="checkbox"
                                    checked={allSchoolAdmins}
                                    onChange={(e) => {
                                        setAllSchoolAdmins(e.target.checked);
                                        setErrors(prev => ({ ...prev, recipients: '' }));
                                    }}
                                />
                                <span>All School Admins</span>
                            </label>

                            <div className="school-select-wrapper">
                                <select
                                    value={selectedSchool}
                                    onChange={(e) => {
                                        setSelectedSchool(e.target.value);
                                        setErrors(prev => ({ ...prev, recipients: '' }));
                                    }}
                                    className="announcement-select"
                                >
                                    <option value="">Select Specific School</option>
                                    {schools.map((school, index) => (
                                        <option key={index} value={school.name}>{school.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {errors.recipients && <span className="error-message">{errors.recipients}</span>}
                    </div>

                    {/* Schedule Section */}
                    <div className="form-section">
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={sendImmediately}
                                    onChange={(e) => {
                                        setSendImmediately(e.target.checked);
                                        if (e.target.checked) {
                                            setScheduleForLater(false);
                                            setErrors(prev => ({ ...prev, date: '', time: '' }));
                                        }
                                    }}
                                />
                                <span>Send Immediately</span>
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={scheduleForLater}
                                    onChange={(e) => {
                                        setScheduleForLater(e.target.checked);
                                        if (e.target.checked) setSendImmediately(false);
                                    }}
                                />
                                <span>Schedule for later</span>
                            </label>
                        </div>

                        {scheduleForLater && (
                            <div className="schedule-inputs">
                                <div className={`date-time-picker ${errors.date ? 'has-error' : ''}`}>
                                    <MdCalendarToday size={18} color="#828282" />
                                    <input
                                        type="date"
                                        className="date-input"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
                                        }}
                                        required={scheduleForLater}
                                    />
                                    {errors.date && <span className="error-message">{errors.date}</span>}
                                </div>
                                <div className={`date-time-picker ${errors.time ? 'has-error' : ''}`}>
                                    <input
                                        type="time"
                                        className="time-input"
                                        value={selectedTime}
                                        onChange={(e) => {
                                            setSelectedTime(e.target.value);
                                            if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
                                        }}
                                        required={scheduleForLater}
                                    />
                                    {errors.time && <span className="error-message">{errors.time}</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Attachments Section */}
                    <div className="form-section">
                        <label className="form-label">Add Attachments</label>
                        <div className="attachment-area">
                            {!attachedFile ? (
                                <label className="file-upload-label">
                                    <MdAttachFile size={20} />
                                    <span>Click to upload or drag and drop</span>
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            ) : (
                                <div className="attached-file">
                                    <div className="file-icon"><MdInsertDriveFile size={24} /></div>
                                    <div className="file-info">
                                        <span className="file-name">{attachedFile.name}</span>
                                        <div className="file-actions">
                                            <button type="button" className="file-action-btn">Upload</button>
                                            <button type="button" className="file-action-btn" onClick={handleRemoveFile}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="attachment-note">
                            <MdAttachFile size={14} style={{ marginRight: '5px' }} /> Attachments size<br />
                            Don't exceed 10MB in size. Check if<br />
                            there are double uploads in the forms portal.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button type="submit" className="btn-send">Send</button>
                        <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateAnnouncement;
