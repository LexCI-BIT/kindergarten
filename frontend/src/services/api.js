const API_URL = 'http://localhost:5000/api';

const api = {
    // Schools
    getSchools: async () => {
        const response = await fetch(`${API_URL}/schools`);
        if (!response.ok) throw new Error('Failed to fetch schools');
        return response.json();
    },

    createSchool: async (schoolData, adminData) => {
        const response = await fetch(`${API_URL}/schools`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ schoolData, adminData })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create school');
        return data;
    },

    // Admins
    getAdmins: async () => {
        const response = await fetch(`${API_URL}/admins`);
        if (!response.ok) throw new Error('Failed to fetch admins');
        return response.json();
    },

    // Teachers
    getTeachers: async () => {
        const response = await fetch(`${API_URL}/teachers`);
        if (!response.ok) throw new Error('Failed to fetch teachers');
        return response.json();
    },

    // Students
    getStudents: async () => {
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        return response.json();
    },

    // Login
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        return data;
    },

    // Users
    updateProfile: async (id, userData) => {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update profile');
        return data;
    },

    // Dashboard
    getDashboardStats: async () => {
        const response = await fetch(`${API_URL}/dashboard/stats`);
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        return response.json();
    },

    // Announcements
    getAnnouncements: async () => {
        const response = await fetch(`${API_URL}/announcements`);
        if (!response.ok) throw new Error('Failed to fetch announcements');
        return response.json();
    },
    createAnnouncement: async (announcement) => {
        const response = await fetch(`${API_URL}/announcements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(announcement)
        });
        if (!response.ok) throw new Error('Failed to create announcement');
        return response.json();
    },
    deleteAnnouncement: async (id) => {
        const response = await fetch(`${API_URL}/announcements/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete announcement');
        return true;
    },

    // Inventory
    getInventory: async () => {
        const response = await fetch(`${API_URL}/inventory`);
        if (!response.ok) throw new Error('Failed to fetch inventory');
        return response.json();
    },
    updateInventory: async (id, itemData) => {
        const response = await fetch(`${API_URL}/inventory/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });
        if (!response.ok) throw new Error('Failed to update inventory');
        return response.json();
    },

    // Fees
    getFees: async () => {
        const response = await fetch(`${API_URL}/fees`);
        if (!response.ok) throw new Error('Failed to fetch fees');
        return response.json();
    },

    // Notes
    getNotes: async () => {
        const response = await fetch(`${API_URL}/notes`);
        if (!response.ok) throw new Error('Failed to fetch notes');
        return response.json();
    },
    createNote: async (note) => {
        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        if (!response.ok) throw new Error('Failed to create note');
        return response.json();
    },
    updateNote: async (id, note) => {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        if (!response.ok) throw new Error('Failed to update note');
        return response.json();
    },
    deleteNote: async (id) => {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete note');
        return true;
    },

    // Complaints
    getComplaints: async () => {
        const response = await fetch(`${API_URL}/complaints`);
        if (!response.ok) throw new Error('Failed to fetch complaints');
        return response.json();
    },
    updateComplaint: async (id, complaintData) => {
        const response = await fetch(`${API_URL}/complaints/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(complaintData)
        });
        if (!response.ok) throw new Error('Failed to update complaint');
        return response.json();
    }
};

export default api;
