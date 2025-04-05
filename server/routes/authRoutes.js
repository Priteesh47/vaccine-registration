const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request body:', req.body);
        const { name, email, password, role } = req.body;
        
        // Validate required fields
        if (!name || !email || !password || !role) {
            console.log('Missing required fields:', { name, email, password, role });
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate role
        const validRoles = ['User', 'Admin', 'Staff'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be one of: User, Admin, Staff' });
        }

        // Check if user already exists
        console.log('Checking for existing user with email:', email);
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        console.log('Hashing password');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        console.log('Inserting new user with role:', role);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        console.log('User inserted successfully, ID:', result.insertId);

        // Generate JWT token
        console.log('Generating JWT token');
        const token = jwt.sign(
            { id: result.insertId, email, role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                name,
                email,
                role
            }
        });
    } catch (error) {
        console.error('Registration error details:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sqlState: error.sqlState,
            stack: error.stack
        });
        
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.error('Database table might not exist. Please check your database setup.');
        } else if (error.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry error');
        } else if (error.code === 'ER_BAD_FIELD_ERROR') {
            console.error('Invalid column name error');
        }
        
        res.status(500).json({ 
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request received:', { email });

        // Validate required fields
        if (!email || !password) {
            console.log('Missing required fields:', { email: !!email, password: !!password });
            return res.status(400).json({ 
                message: 'Email and password are required',
                details: {
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined
                }
            });
        }

        // Check if user exists with explicit column selection
        const [users] = await db.query(
            'SELECT id, name, email, password, role FROM users WHERE email = ?',
            [email]
        );
        console.log('User found:', users[0]);

        if (users.length === 0) {
            console.log('No user found with email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        console.log('User role from database:', user.role);

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Ensure role exists, default to 'User' if not
        const userRole = user.role || 'User';
        console.log('Final user role:', userRole);

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                role: userRole
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Create user object for response
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: userRole
        };

        console.log('User response object:', userResponse);

        const response = {
            message: 'Login successful',
            token,
            user: userResponse
        };

        console.log('Full response:', response);
        res.json(response);
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ 
            message: 'Error logging in',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router; 