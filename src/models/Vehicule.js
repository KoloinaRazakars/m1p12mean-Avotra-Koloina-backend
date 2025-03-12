const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  immatriculation: { type: String, required: true, unique: true },
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  annee: { type: Number, required: true }
}, { timestamps: true });

const Vehicule = mongoose.model('Vehicule', vehiculeSchema);
module.exports = Vehicule;
