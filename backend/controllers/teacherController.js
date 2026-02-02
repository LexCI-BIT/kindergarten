const supabase = require('../config/supabase');

exports.getAllTeachers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('teachers')
            .select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
