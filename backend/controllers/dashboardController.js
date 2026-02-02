const supabase = require('../config/supabase');

exports.getStats = async (req, res) => {
    try {
        const [schools, students, teachers, admins] = await Promise.all([
            supabase.from('schools').select('id', { count: 'exact' }),
            supabase.from('students').select('id', { count: 'exact' }),
            supabase.from('teachers').select('id', { count: 'exact' }),
            supabase.from('admins').select('id', { count: 'exact' })
        ]);

        res.status(200).json({
            totalSchools: schools.count || 0,
            totalStudents: students.count || 0,
            totalTeachers: teachers.count || 0,
            totalAdmins: admins.count || 0,
            growth: {
                schools: null,
                students: null,
                teachers: null,
                admins: null
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
