const supabase = require('../config/supabase');

exports.getAllComplaints = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateComplaint = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .update(req.body)
            .eq('id', req.params.id)
            .select();
        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
