const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const utilisateurSchema = new mongoose.Schema(
  {
    nomUtilisateur: { type: String, required: true, unique: true },
    motdepasse: { type: String, required: true },
    role: { type: String, enum: ['manager', 'mecanicien', 'client'], required: true }
  },
  { timestamps: true }
);

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur;
