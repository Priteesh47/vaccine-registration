const userRoutes = require('./routes/userRoutes');
const vaccineRoutes = require('./routes/vaccineRoutes');

// Routes
app.use('/api/user', userRoutes);
app.use('/api/vaccines', vaccineRoutes);

// Remove any other vaccine-related routes from the server directory 