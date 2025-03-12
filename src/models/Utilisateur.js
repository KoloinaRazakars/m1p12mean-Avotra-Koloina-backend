const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nomUtilisateur: { type: String, required: true, unique: true },
  mdp: { type: String, required: true },
  role: { type: String, enum: ['manager', 'mecanicien', 'client'], required: true }
}, { timestamps: true });

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur;
