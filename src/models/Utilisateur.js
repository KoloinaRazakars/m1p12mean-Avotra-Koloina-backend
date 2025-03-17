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

utilisateurSchema.virtual('clientData', {
  ref: 'Client', 
  localField: '_id',
  foreignField: 'utilisateurId',
  justOne: true,
});

utilisateurSchema.virtual('managerData', {
  ref: 'Manager', 
  localField: '_id',
  foreignField: 'utilisateurId',
  justOne: true,
});


utilisateurSchema.virtual('mecanicienData', {
  ref: 'Mecanicien', 
  localField: '_id',
  foreignField: 'utilisateurId',
  justOne: true,
});


utilisateurSchema.set('toObject', { virtuals: true });
utilisateurSchema.set('toJSON', { virtuals: true });

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);
module.exports = Utilisateur;
