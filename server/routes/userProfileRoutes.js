const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Get user profile
router.get('/', authenticateToken, (req, res) => {
    db.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [req.user.id],
        (error, results) => {
            if (error) {
                console.error('Error fetching user profile:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error fetching user profile',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }

            if (results.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            return res.json({ 
                success: true, 
                data: results[0] 
            });
        }
    );
});

// Update user profile
router.put('/', authenticateToken, (req, res) => {
    const { name, email, currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!name || !email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Name and email are required' 
        });
    }

    // Check if email is already taken by another user
    db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.id],
        (error, results) => {
            if (error) {
                console.error('Error checking email:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error checking email',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }

            if (results.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email is already taken' 
                });
            }

            // If password change is requested
            if (currentPassword && newPassword) {
                // Verify current password
                db.query(
                    'SELECT password FROM users WHERE id = ?',
                    [req.user.id],
                    async (error, results) => {
                        if (error) {
                            console.error('Error verifying password:', error);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Error verifying password',
                                error: process.env.NODE_ENV === 'development' ? error.message : undefined
                            });
                        }

                        if (results.length === 0) {
                            return res.status(404).json({ 
                                success: false, 
                                message: 'User not found' 
                            });
                        }

                        const isMatch = await bcrypt.compare(currentPassword, results[0].password);
                        if (!isMatch) {
                            return res.status(400).json({ 
                                success: false, 
                                message: 'Current password is incorrect' 
                            });
                        }

                        // Hash new password
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(newPassword, salt);

                        // Update user with new password
                        db.query(
                            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
                            [name, email, hashedPassword, req.user.id],
                            (error) => {
                                if (error) {
                                    console.error('Error updating profile:', error);
                                    return res.status(500).json({ 
                                        success: false, 
                                        message: 'Error updating profile',
                                        error: process.env.NODE_ENV === 'development' ? error.message : undefined
                                    });
                                }

                                // Get updated user data
                                db.query(
                                    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
                                    [req.user.id],
                                    (error, results) => {
                                        if (error) {
                                            console.error('Error fetching updated profile:', error);
                                            return res.status(500).json({ 
                                                success: false, 
                                                message: 'Error fetching updated profile',
                                                error: process.env.NODE_ENV === 'development' ? error.message : undefined
                                            });
                                        }

                                        return res.json({ 
                                            success: true, 
                                            message: 'Profile updated successfully',
                                            data: results[0]
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            } else {
                // Update user without changing password
                db.query(
                    'UPDATE users SET name = ?, email = ? WHERE id = ?',
                    [name, email, req.user.id],
                    (error) => {
                        if (error) {
                            console.error('Error updating profile:', error);
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Error updating profile',
                                error: process.env.NODE_ENV === 'development' ? error.message : undefined
                            });
                        }

                        // Get updated user data
                        db.query(
                            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
                            [req.user.id],
                            (error, results) => {
                                if (error) {
                                    console.error('Error fetching updated profile:', error);
                                    return res.status(500).json({ 
                                        success: false, 
                                        message: 'Error fetching updated profile',
                                        error: process.env.NODE_ENV === 'development' ? error.message : undefined
                                    });
                                }

                                return res.json({ 
                                    success: true, 
                                    message: 'Profile updated successfully',
                                    data: results[0]
                                });
                            }
                        );
                    }
                );
            }
        }
    );
});

module.exports = router; 