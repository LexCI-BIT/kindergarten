const supabase = require('../config/supabase');
const { formatUser } = require('../utils/userUtils');

exports.login = async (req, res) => {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    console.log(`Login attempt for: [${email}]`);

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (error || !data) {
            console.warn('No user found with email:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValid = (password === data.password);
        if (!isValid) {
            console.warn('Invalid password for user:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log('Login successful for:', email);
        res.status(200).json({
            message: 'Login successful',
            user: formatUser(data)
        });
    } catch (err) {
        console.error('Unexpected error during login:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.healthCheck = (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running' });
};
