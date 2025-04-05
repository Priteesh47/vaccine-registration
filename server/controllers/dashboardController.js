const db = require('../config/db');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get total users
        const [usersResult] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
        const totalUsers = usersResult[0].totalUsers;
        
        // Get total vaccines
        const [vaccinesResult] = await db.query('SELECT COUNT(*) as totalVaccines FROM vaccines');
        const totalVaccines = vaccinesResult[0].totalVaccines;
        
        // Get total appointments
        const [appointmentsResult] = await db.query('SELECT COUNT(*) as totalAppointments FROM appointments');
        const totalAppointments = appointmentsResult[0].totalAppointments;
        
        // Get recent appointments with user and vaccine details
        const [recentAppointments] = await db.query(`
            SELECT 
                a.id,
                u.name as userName,
                v.name as vaccineName,
                a.appointment_date as appointmentDate,
                a.status
            FROM appointments a
            JOIN users u ON a.user_id = u.id
            JOIN vaccines v ON a.vaccine_id = v.id
            ORDER BY a.appointment_date DESC
            LIMIT 10
        `);

        res.json({
            totalUsers,
            totalVaccines,
            totalAppointments,
            recentAppointments
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
};

module.exports = {
    getDashboardStats
}; 