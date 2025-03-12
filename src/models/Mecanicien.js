const mongoose = require('mongoose');

const mecanicienSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true }
}, { timestamps: true });

const Mecanicien = mongoose.model('Mecanicien', mecanicienSchema);
module.exports = Mecanicien;
