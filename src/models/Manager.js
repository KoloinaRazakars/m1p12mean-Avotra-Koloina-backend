const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true }
}, { timestamps: true });

const Manager = mongoose.model('Manager', managerSchema);
module.exports = Manager;
