const express = require('express');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();
console.log("*********************OOOOOOOOOOOOOOOOOOOOOOOOOO")
// Middleware
app.use(express.json()); // To parse incoming JSON data

// Use the user routes with '/api' prefix
app.use('/api', userRoutes);  // This makes '/api/users' available

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
