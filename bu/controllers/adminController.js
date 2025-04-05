const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const register = (req, res) => {
  const { email, password, name } = req.body;

  const checkAdminCountQuery =
    "SELECT COUNT(*) as adminCount FROM users WHERE roles = 'Admin'";

  db.execute(checkAdminCountQuery, [], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    const adminCount = result[0].adminCount;

    if (adminCount >= 2) {
      return res.status(400).json({ message: "Maximum of two admins allowed" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertQuery =
      "INSERT INTO users (email, password, name, roles) VALUES (?, ?, ?, 'Admin')";

    db.execute(insertQuery, [email, hashedPassword, name], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      return res.status(201).json({
        success: true,
        message: "Admin registered successfully!",
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.execute(query, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check if user is Admin before granting access to admin resources
    if (user.roles !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const token = jwt.sign({ id: user.id, roles: user.roles }, "secretKey", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
    });
  });
};

// Get dashboard statistics
const getDashboardStats = (req, res) => {
  try {
    // Get total users count
    const usersQuery = "SELECT COUNT(*) as count FROM users";
    db.execute(usersQuery, (err, usersResult) => {
      if (err) return res.status(500).json({ message: "Database error" });

      // Get total vaccines count
      const vaccinesQuery = "SELECT COUNT(*) as count FROM vaccines";
      db.execute(vaccinesQuery, (err, vaccinesResult) => {
        if (err) return res.status(500).json({ message: "Database error" });

        // Get total appointments count
        const appointmentsQuery = "SELECT COUNT(*) as count FROM appointments";
        db.execute(appointmentsQuery, (err, appointmentsResult) => {
          if (err) return res.status(500).json({ message: "Database error" });

          // Get total centers count
          const centersQuery = "SELECT COUNT(*) as count FROM centers";
          db.execute(centersQuery, (err, centersResult) => {
            if (err) return res.status(500).json({ message: "Database error" });

            // Get recent appointments
            const recentAppointmentsQuery = `
              SELECT a.*, u.name as user_name, v.name as vaccine_name 
              FROM appointments a
              JOIN users u ON a.user_id = u.id
              JOIN vaccines v ON a.vaccine_id = v.id
              ORDER BY a.date DESC
              LIMIT 5
            `;
            db.execute(recentAppointmentsQuery, (err, recentAppointmentsResult) => {
              if (err) return res.status(500).json({ message: "Database error" });

              res.status(200).json({
                success: true,
                stats: {
                  totalUsers: usersResult[0].count,
                  totalVaccines: vaccinesResult[0].count,
                  totalAppointments: appointmentsResult[0].count,
                  totalCenters: centersResult[0].count
                },
                recentAppointments: recentAppointmentsResult
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
const getAllUsers = (req, res) => {
  const query = "SELECT id, name, email, roles, created_at FROM users";
  db.execute(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ success: true, users: result });
  });
};

// Get all vaccines
const getAllVaccines = (req, res) => {
  const query = "SELECT * FROM vaccines";
  db.execute(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ success: true, vaccines: result });
  });
};

// Get all appointments
const getAllAppointments = (req, res) => {
  const query = `
    SELECT a.*, u.name as user_name, v.name as vaccine_name, c.name as center_name
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    JOIN vaccines v ON a.vaccine_id = v.id
    JOIN centers c ON a.center_id = c.id
    ORDER BY a.date DESC
  `;
  db.execute(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ success: true, appointments: result });
  });
};

// Get all centers
const getAllCenters = (req, res) => {
  const query = "SELECT * FROM centers";
  db.execute(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ success: true, centers: result });
  });
};

module.exports = {
  register,
  login,
  getDashboardStats,
  getAllUsers,
  getAllVaccines,
  getAllAppointments,
  getAllCenters
};
