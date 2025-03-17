const { body } = require('express-validator');
const Utilisateur = require('../models/Utilisateur');

// Validation commune pour tous les utilisateurs
const validationUtilisateur = [
  body('nomUtilisateur')
    .trim()
    .notEmpty().withMessage('Le nom d\'utilisateur est obligatoire.')
    .isString().withMessage('Le nom d\'utilisateur doit être une chaîne de caractères.')
    .escape()
    .custom( async (value) => {
      const utilisateurExiste = await Utilisateur.findOne ({ nomUtilisateur: value});
      if (utilisateurExiste) {
        throw new Error ('Le nom d\'utilisateur est déjà pris.');
      }
      return true; 
    }),

  body('motdepasse')
    .notEmpty().withMessage('Le mot de passe est obligatoire.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule.')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[@$!%*?&]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&).'),

    body('role')
    .notEmpty().withMessage('Un utilisateur doit avoir un rôle.'),
];

// Validation pour la création d'un mécanicien
const validationMecanicien = [
  ...validationUtilisateur,
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire.'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est obligatoire.')
];

// Validation pour la création d'un client
const validationClient = [
  ...validationUtilisateur,
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire.'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est obligatoire.')
];

// Validation pour la création d'un manager
const validationManager = [
  ...validationUtilisateur,
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire.'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est obligatoire.')
];

module.exports = { validationMecanicien, validationClient, validationManager };


