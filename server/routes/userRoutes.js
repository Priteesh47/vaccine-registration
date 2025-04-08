const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-pictures')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

// Get user statistics
router.get('/stats', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    // Get total appointments
    db.query(
        'SELECT COUNT(*) as total_appointments FROM appointments WHERE user_id = ?',
        [userId],
        (error, appointmentResults) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error fetching appointment stats'
                });
            }

            // Get completed vaccinations
            db.query(
                'SELECT COUNT(*) as completed_vaccinations FROM appointments WHERE user_id = ? AND status = "completed"',
                [userId],
                (error, completedResults) => {
                    if (error) {
                        return res.status(500).json({
                            success: false,
                            message: 'Error fetching completed vaccinations'
                        });
                    }

                    // Get upcoming appointments
                    db.query(
                        'SELECT COUNT(*) as upcoming_appointments FROM appointments WHERE user_id = ? AND status = "scheduled" AND appointment_date > NOW()',
                        [userId],
                        (error, upcomingResults) => {
                            if (error) {
                                return res.status(500).json({
                                    success: false,
                                    message: 'Error fetching upcoming appointments'
                                });
                            }

                            res.json({
                                success: true,
                                data: {
                                    total_appointments: appointmentResults[0].total_appointments,
                                    completed_vaccinations: completedResults[0].completed_vaccinations,
                                    upcoming_appointments: upcomingResults[0].upcoming_appointments
                                }
                            });
                        }
                    );
                }
            );
        }
    );
});

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
    const query = `
        SELECT u.id, u.name, u.email, u.role, u.created_at,
               up.*
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id = ?
    `;
    
    db.query(query, [req.user.id], (error, results) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching user profile'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const profile = results[0];
        if (profile.notification_preferences) {
            profile.notification_preferences = JSON.parse(profile.notification_preferences);
        }

        res.json({
            success: true,
            data: profile
        });
    });
});

// Update user profile with picture
router.put('/profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    const {
        name, email, phone_number, address, city, state,
        date_of_birth, gender, blood_group,
        emergency_contact_name, emergency_contact_phone,
        medical_conditions, allergies,
        preferred_language, notification_preferences
    } = req.body;

    try {
        // Start transaction
        await new Promise((resolve, reject) => {
            db.beginTransaction((err) => {
                if (err) reject(err);
                resolve();
            });
        });

        // Update basic user info
        if (name || email) {
            await new Promise((resolve, reject) => {
                db.query(
                    'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?',
                    [name || null, email || null, req.user.id],
                    (error) => {
                        if (error) reject(error);
                        resolve();
                    }
                );
            });
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
            profileData.profile_picture = req.file.path;
        }

        // Check if profile exists
        const profileExists = await new Promise((resolve, reject) => {
            db.query(
                'SELECT id FROM user_profiles WHERE user_id = ?',
                [req.user.id],
                (error, results) => {
                    if (error) reject(error);
                    resolve(results.length > 0);
                }
            );
        });

        if (profileExists) {
            await new Promise((resolve, reject) => {
                db.query(
                    'UPDATE user_profiles SET ? WHERE user_id = ?',
                    [profileData, req.user.id],
                    (error) => {
                        if (error) reject(error);
                        resolve();
                    }
                );
            });
        } else {
            profileData.user_id = req.user.id;
            await new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO user_profiles SET ?',
                    profileData,
                    (error) => {
                        if (error) reject(error);
                        resolve();
                    }
                );
            });
        }

        // Commit transaction
        await new Promise((resolve, reject) => {
            db.commit((err) => {
                if (err) reject(err);
                resolve();
            });
        });

        // Fetch updated profile
        const updatedProfile = await new Promise((resolve, reject) => {
            db.query(query, [req.user.id], (error, results) => {
                if (error) reject(error);
                resolve(results[0]);
            });
        });

        if (updatedProfile.notification_preferences) {
            updatedProfile.notification_preferences = JSON.parse(updatedProfile.notification_preferences);
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile
        });

    } catch (error) {
        // Rollback transaction on error
        await new Promise((resolve) => {
            db.rollback(() => resolve());
        });

        res.status(500).json({
            success: false,
            message: error.message || 'Error updating profile'
        });
    }
});

// Delete profile picture
router.delete('/profile/picture', authenticateToken, (req, res) => {
    db.query(
        'UPDATE user_profiles SET profile_picture = NULL WHERE user_id = ?',
        [req.user.id],
        (error) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error deleting profile picture'
                });
            }

            res.json({
                success: true,
                message: 'Profile picture deleted successfully'
            });
        }
    );
});

module.exports = router; 