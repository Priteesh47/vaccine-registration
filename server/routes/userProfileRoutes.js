const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '..', 'uploads', 'profile-pictures');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Get user profile with all details
router.get('/', authenticateToken, async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        
        const query = `
            SELECT u.id, u.name, u.email, u.role, u.created_at,
                   up.*
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = ?
        `;
        
        const [results] = await connection.query(query, [req.user.id]);

        if (results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const profile = results[0];
        if (profile.notification_preferences) {
            try {
                profile.notification_preferences = JSON.parse(profile.notification_preferences);
            } catch (e) {
                profile.notification_preferences = null;
            }
        }

        if (profile.profile_picture) {
            profile.profile_picture = profile.profile_picture.replace(/\\/g, '/');
        }

        return res.json({ 
            success: true, 
            data: profile 
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error fetching user profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Update user profile
router.put('/', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const {
            name, email, currentPassword, newPassword,
            phone_number, address, city, state,
            date_of_birth, gender, blood_group,
            emergency_contact_name, emergency_contact_phone,
            medical_conditions, allergies,
            preferred_language, notification_preferences
        } = req.body;

        // Update basic user info
        if (name || email) {
            await connection.query(
                'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?',
                [name || null, email || null, req.user.id]
            );
        }

        // Handle password update if provided
        if (currentPassword && newPassword) {
            const [results] = await connection.query(
                'SELECT password FROM users WHERE id = ?',
                [req.user.id]
            );

            const isMatch = await bcrypt.compare(currentPassword, results[0].password);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await connection.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, req.user.id]
            );
        }

        // Update or insert profile data
        const profileData = {
            phone_number,
            address,
            city,
            state,
            date_of_birth,
            gender,
            blood_group,
            emergency_contact_name,
            emergency_contact_phone,
            medical_conditions,
            allergies,
            preferred_language,
            notification_preferences: notification_preferences ? JSON.stringify(notification_preferences) : null
        };

        if (req.file) {
            profileData.profile_picture = path.join('profile-pictures', req.file.filename).replace(/\\/g, '/');
        }

        // Check if profile exists
        const [profileExists] = await connection.query(
            'SELECT id FROM user_profiles WHERE user_id = ?',
            [req.user.id]
        );

        if (profileExists.length > 0) {
            await connection.query(
                'UPDATE user_profiles SET ? WHERE user_id = ?',
                [profileData, req.user.id]
            );
        } else {
            profileData.user_id = req.user.id;
            await connection.query(
                'INSERT INTO user_profiles SET ?',
                [profileData]
            );
        }

        await connection.commit();

        // Fetch updated profile
        const [updatedProfile] = await connection.query(`
            SELECT u.id, u.name, u.email, u.role, u.created_at,
                   up.*
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = ?
        `, [req.user.id]);

        return res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile[0]
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error updating profile:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error updating profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Delete profile picture
router.delete('/profile-picture', authenticateToken, (req, res) => {
    db.query(
        'UPDATE user_profiles SET profile_picture = NULL WHERE user_id = ?',
        [req.user.id],
        (error) => {
            if (error) {
                console.error('Error deleting profile picture:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error deleting profile picture'
                });
            }

            return res.json({
                success: true,
                message: 'Profile picture deleted successfully'
            });
        }
    );
});

module.exports = router; 