import React, { useState, useEffect } from 'react';
import { MdArrowBack, MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import TopBar from '../components/TopBar';
import api from '../services/api';

const Notes = () => {
    const [view, setView] = useState('list'); // 'list' or 'create'
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const data = await api.getNotes();
                setNotes(data);
            } catch (error) {
                console.error("Error fetching notes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const handleSave = () => {
        if (!newNote.title || !newNote.content) return;
        const note = {
            id: Date.now(),
            ...newNote,
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        // TODO: Implement api.createNote(note)
        setNotes([note, ...notes]);
        setNewNote({ title: '', content: '' });
        setView('list');
    };

    const handleDelete = (id) => {
        // TODO: Implement api.deleteNote(id)
        setNotes(notes.filter(n => n.id !== id));
    };

    return (
        <div className="dashboard-container">
            <TopBar title={view === 'list' ? "My Notes" : "Create Note"} showSearch={false} />

            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                {view === 'list' ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', margin: 0 }}>All Notes</h2>
                            <button
                                onClick={() => setView('create')}
                                style={{
                                    backgroundColor: '#407BFF',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: '500'
                                }}
                            >
                                <MdAdd size={20} /> New Note
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '15px' }}>
                            {notes.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                                    No notes yet. Create your first one!
                                </div>
                            ) : (
                                notes.map(note => (
                                    <div key={note.id} style={{
                                        backgroundColor: '#fff',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        border: '1px solid #eee'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{note.title}</h3>
                                            <span style={{ fontSize: '12px', color: '#888' }}>{note.date}</span>
                                        </div>
                                        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                                            {note.content}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                style={{ color: '#EA5455', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                                            >
                                                <MdDelete size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <button
                            onClick={() => setView('list')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}
                        >
                            <MdArrowBack /> Back to list
                        </button>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
                            <input
                                type="text"
                                value={newNote.title}
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Enter note title..."
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Content</label>
                            <textarea
                                value={newNote.content}
                                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                style={{
                                    width: '100%',
                                    minHeight: '200px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="Write your note here..."
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!newNote.title || !newNote.content}
                            style={{
                                width: '100%',
                                backgroundColor: (!newNote.title || !newNote.content) ? '#ccc' : '#407BFF',
                                color: '#fff',
                                border: 'none',
                                padding: '15px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: (!newNote.title || !newNote.content) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Save Note
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;
