const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Note: For migrations, you might need the service role key instead of anon key
// If this fails, you'll need to use the Supabase dashboard SQL editor

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    try {
        console.log('🚀 Starting database migration...\n');

        // Read the SQL file
        const sqlPath = path.join(__dirname, 'migrations', '001_create_schools_admins.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 SQL Migration file loaded');
        console.log('⚠️  Note: This requires service_role key, not anon key\n');

        // Split SQL into individual statements
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`Found ${statements.length} SQL statements to execute\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';
            console.log(`Executing statement ${i + 1}/${statements.length}...`);

            const { data, error } = await supabase.rpc('exec_sql', {
                query: statement
            });

            if (error) {
                console.error(`❌ Error in statement ${i + 1}:`, error.message);
                console.log('\n⚠️  Migration failed. Please use Supabase Dashboard SQL Editor instead:');
                console.log('   1. Go to https://supabase.com/dashboard');
                console.log('   2. Select your project');
                console.log('   3. Go to SQL Editor');
                console.log('   4. Copy and paste the contents of migrations/001_create_schools_admins.sql');
                console.log('   5. Click Run\n');
                process.exit(1);
            }
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('   - schools table created');
        console.log('   - admins table created');
        console.log('   - Indexes created');
        console.log('   - Triggers created\n');

    } catch (error) {
        console.error('❌ Migration error:', error.message);
        console.log('\n📋 Manual Migration Instructions:');
        console.log('   Since automatic migration failed, please run the SQL manually:');
        console.log('   1. Open: https://supabase.com/dashboard/project/dfcxwtufzqijyhsonivw/sql');
        console.log('   2. Click "New Query"');
        console.log('   3. Copy contents from: backend/migrations/001_create_schools_admins.sql');
        console.log('   4. Paste and click "Run"\n');
        process.exit(1);
    }
}

// Run the migration
runMigration();
