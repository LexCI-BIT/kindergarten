const supabase = require('../config/supabase');

exports.getAllAnnouncements = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAnnouncement = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('announcements')
            .insert([req.body])
            .select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { error } = await supabase
            .from('announcements')
            .delete()
            .eq('id', req.params.id);
        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
