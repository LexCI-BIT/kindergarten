const supabase = require('../config/supabase');
const { formatUser } = require('../utils/userUtils');

exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const { email, name, phoneNumber, currentPassword, newPassword } = req.body;
    try {
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updateData = {
            email: email || user.email,
            super_admin_name: name || user.super_admin_name,
            phone_number: phoneNumber || user.phone_number,
            updated_at: new Date().toISOString()
        };

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required to change password' });
            }

            const isMatch = (currentPassword === user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect current password' });
            }
            updateData.password = newPassword;
        }

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Database error during profile update:', error.message);
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user: formatUser(data)
        });
    } catch (err) {
        console.error('Unexpected error during profile update:', err.message);
        res.status(500).json({ error: err.message });
    }
};
