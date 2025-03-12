const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
