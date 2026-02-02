const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
    console.warn('SUPABASE_URL is not configured in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
