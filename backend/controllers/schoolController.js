const supabase = require('../config/supabase');

exports.getAllSchools = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('schools')
            .select('*')
            .order('name');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSchool = async (req, res) => {
    try {
        const { schoolData, adminData } = req.body;

        // Create school record with admin info
        const schoolWithAdminInfo = {
            ...schoolData,
            admin_name: adminData.name,
            admins_count: 1
        };

        const { data: schoolRecord, error: schoolError } = await supabase
            .from('schools')
            .insert([schoolWithAdminInfo])
            .select();

        if (schoolError) throw schoolError;

        // Create admin record with reference to the school
        const adminWithSchool = {
            ...adminData,
            school_id: schoolRecord[0].id,
            school_name: schoolRecord[0].name
        };

        const { data: adminRecord, error: adminError } = await supabase
            .from('admins')
            .insert([adminWithSchool])
            .select();

        if (adminError) {
            // Rollback: delete the school if admin creation fails
            await supabase.from('schools').delete().eq('id', schoolRecord[0].id);
            throw adminError;
        }

        res.status(201).json({
            school: schoolRecord[0],
            admin: adminRecord[0],
            message: 'School and admin created successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
