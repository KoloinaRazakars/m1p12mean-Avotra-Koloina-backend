const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  vehiculeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },
  mecanicienId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mecanicien', required: false },
  taches: [{ description: String, faite: Boolean }],
  statut: { type: String, enum: ['non assignée', 'en cours', 'terminée'], default: 'non assignée' }
}, { timestamps: true });

const Mission = mongoose.model('Mission', missionSchema);
module.exports = Mission;
