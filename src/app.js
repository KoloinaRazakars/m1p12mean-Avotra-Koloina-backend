const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config(); 

const authRoutes = require('./routes/authRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const mecanicienRoutes = require('./routes/mecanicienRoutes');

app.use(cors());
app.use(express.json());


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/utilisateurs', utilisateurRoutes);
app.use('/mecaniciens', mecanicienRoutes);

// Exporter l'application
module.exports = app;