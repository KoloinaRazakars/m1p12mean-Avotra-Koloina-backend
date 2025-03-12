const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const utilisateurRoutes = require('./routes/UtilisateurRoutes');
const managerRoutes = require('./routes/managerRoutes');
const mecanicienRoutes = require('./routes/mecanicienRoutes');
const clientRoutes = require('./routes/clientRoutes');
const vehiculeRoutes = require('./routes/vehiculeRoutes');
const missionRoutes = require('./routes/missionRoutes');
const rendezVousRoutes = require('./routes/rendezVousRoutes');

dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Routes

app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/mecaniciens', mecanicienRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/vehicules', vehiculeRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/rendez-vous', rendezVousRoutes);



// Exporter l'application
module.exports = app;