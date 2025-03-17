const Utilisateur = require('../models/Utilisateur');
const Manager = require('../models/Manager');
const Mecanicien = require('../models/Mecanicien');
const Client = require('../models/Client');
const bcrypt = require('bcryptjs');

// Récupérer tous les utilisateurs
exports.getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find().populate("managerData").populate("clientData").populate("mecanicienData");
    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};