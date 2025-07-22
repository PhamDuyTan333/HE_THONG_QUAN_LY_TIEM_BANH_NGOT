// Test Supabase connection script
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    const client = await pool.connect();
    console.log('✅ Connected to Supabase successfully!');
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database query successful:', result.rows[0]);
    
    // Test tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('✅ Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Test sample data
    const accountsResult = await client.query('SELECT COUNT(*) as count FROM accounts');
    console.log(`✅ Accounts table has ${accountsResult.rows[0].count} records`);
    
    const categoriesResult = await client.query('SELECT COUNT(*) as count FROM categories');
    console.log(`✅ Categories table has ${categoriesResult.rows[0].count} records`);
    
    client.release();
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
