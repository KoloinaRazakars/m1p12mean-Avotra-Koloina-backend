const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  vehiculeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: Date, required: true },
  statut: { type: String, enum: ['à confirmer', 'confirmé', 'annulé'], default: 'à confirmer' },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', default: null } 
}, { timestamps: true });

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);
module.exports = RendezVous;
