const supabase = require('../config/supabase');

exports.getAllFees = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('fees')
            .select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
