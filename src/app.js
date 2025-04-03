const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config(); 

const authRoutes = require('./routes/authRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const mecanicienRoutes = require('./routes/mecanicienRoutes');
const managerRoutes = require('./routes/managerRoutes');
const clientRoutes = require('./routes/clientRoutes');
const missionRoutes = require('./routes/missionRoutes');
const connectDB = require('../database');

app.use(cors());
app.use(express.json());


// Connexion à MongoDB
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/utilisateurs', utilisateurRoutes);
app.use('/mecaniciens', mecanicienRoutes);
app.use('/manager', managerRoutes);
app.use('/clients', clientRoutes);
app.use('/missions', missionRoutes );

// Exporter l'application
module.exports = app;