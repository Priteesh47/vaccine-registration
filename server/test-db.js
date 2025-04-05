const db = require('./db');
require('dotenv').config();

async function testDatabase() {
    try {
        // Test database connection
        console.log('Testing database connection...');
        const [rows] = await db.query('SELECT 1');
        console.log('Database connection successful!');

        // Check users table structure
        console.log('\nChecking users table structure...');
        const [tableInfo] = await db.query('DESCRIBE users');
        console.log('Users table columns:');
        tableInfo.forEach(column => {
            console.log(`- ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : ''} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
        });

        // Check existing users
        console.log('\nChecking existing users...');
        const [users] = await db.query('SELECT * FROM users');
        console.log('Existing users:');
        users.forEach(user => {
            console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role || 'NOT SET'}`);
        });

        // Test inserting a user
        console.log('\nTesting user insertion...');
        const testUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'test123',
            role: 'User'
        };

        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [testUser.name, testUser.email, testUser.password, testUser.role]
        );
        console.log('Test user inserted successfully!');

        // Clean up test user
        await db.query('DELETE FROM users WHERE email = ?', [testUser.email]);
        console.log('Test user cleaned up.');

    } catch (error) {
        console.error('Error during database test:', error);
    } finally {
        // Close the database connection
        db.end();
    }
}

testDatabase(); 