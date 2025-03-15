const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config(); 

const authRoutes = require('./routes/authRoutes');
app.use(cors());
app.use(express.json());


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);

// Exporter l'application
module.exports = app;