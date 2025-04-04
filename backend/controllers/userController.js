const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Register (Sign Up)
const register = async (req, res) => {
  const { email, password, name, roles } = req.body;

  // Validate input
  if (!email || !password || !name || !roles) {
    return res.status(400).json({ 
      success: false,
      message: "All fields are required" 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid email format" 
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: "Password must be at least 6 characters long" 
    });
  }

  // Validate role
  const validRoles = ['User', 'Admin', 'Staff'];
  if (!validRoles.includes(roles)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid role" 
    });
  }

  try {
    // Check if email already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.execute(checkQuery, [email], async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
          success: false,
          message: "Database error" 
        });
      }

      if (result.length > 0) {
        return res.status(400).json({ 
          success: false,
          message: "Email already in use" 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const insertQuery = "INSERT INTO users (name, email, password, roles) VALUES (?, ?, ?, ?)";
      db.execute(insertQuery, [name, email, hashedPassword, roles], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ 
            success: false,
            message: "Database error" 
          });
        }

        // Generate token
        const token = jwt.sign(
          { id: result.insertId, roles: roles },
          "secretKey",
          { expiresIn: "1h" }
        );

        return res.status(201).json({
          success: true,
          message: "Account created successfully!",
          token,
          user: {
            id: result.insertId,
            name,
            email,
            roles
          }
        });
      });
    });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: "Email and password are required" 
    });
  }

  try {
    const query = "SELECT * FROM users WHERE email = ?";
    db.execute(query, [email], async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
          success: false,
          message: "Database error" 
        });
      }

      if (result.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid email or password" 
        });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid email or password" 
        });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, roles: user.roles },
        "secretKey",
        { expiresIn: "1h" }
      );

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        token,
        user: userWithoutPassword
      });
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

module.exports = { register, login };