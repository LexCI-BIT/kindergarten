const supabase = require('../config/supabase');

exports.getAllNotes = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .insert([req.body])
            .select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .update(req.body)
            .eq('id', req.params.id)
            .select();
        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', req.params.id);
        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
