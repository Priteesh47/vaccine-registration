const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register new user
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide all required fields',
                missing: {
                    name: !name,
                    email: !email,
                    password: !password,
                    role: !role
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate role
        const validRoles = ['User', 'Admin', 'Staff'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid role. Must be one of: User, Admin, Staff'
            });
        }

        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user with exact column names
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
            [name, email, hashedPassword, role]
        );
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: result.insertId,
                email: email,
                role: role,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
            },
            process.env.JWT_SECRET
        );

        res.status(201).json({ 
            success: true,
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
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            console.log('Missing fields:', { email: !email, password: !password });
            return res.status(400).json({ 
                message: 'Please provide email and password',
                missing: {
                    email: !email,
                    password: !password
                }
            });
        }
        
        // Find user with explicit column selection
        const [users] = await db.query(
            'SELECT id, name, email, password, role FROM users WHERE email = ?',
            [email]
        );
        console.log('User found:', users[0]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Ensure role exists, default to 'User' if not
        const userRole = user.role || 'User';
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: userRole,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
            },
            process.env.JWT_SECRET
        );
        
        res.json({ 
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: userRole
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Error during login',
            error: error.message 
        });
    }
});

module.exports = router; 