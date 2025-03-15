const Utilisateur = require('../models/Utilisateur');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator'); 

dotenv.config();

//Middleware de validation
const validationInscription = [
  body('nomUtilisateur')
    .trim()
    .notEmpty().withMessage('Le nom d\'utilisateur doit être obligatoire.')
    .isEmail().withMessage('Le format d\'email est invalide.')
    .normalizeEmail(),

  body('motdepasse')
    .notEmpty().withMessage('Le mot de passe est obligatoire.')
    .isLength({ min : 8}).withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule.')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[@$!%*?&]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&).'),

  body('role')
    .notEmpty().withMessage('Un utilisateur doit avoir un rôle.'),
];
exports.validationInscription = validationInscription;


//inscription
exports.inscription = async (req, res) => {
  //Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({erreurs: errors.array()});
  }

  try {
    const { nomUtilisateur, motdepasse, role } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const utilisateurExiste = await Utilisateur.findOne({ nomUtilisateur });
    if (utilisateurExiste) {
      return res.status(400).json({ message: 'Le nom d\'utilisateur existe déjà.' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motdepasse, 10);
    
    // Créer l'utilisateur
    const nouvelUtilisateur = new Utilisateur({
    nomUtilisateur,
    motdepasse: hashedPassword,
    role
    });
    
    await nouvelUtilisateur.save();
    
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
    
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

//Connexion
exports.connexion = async (req, res) => {
    try {
        const { nomUtilisateur, motdepasse } = req.body;
    
        // Vérifier si l'utilisateur existe
        const utilisateur = await Utilisateur.findOne({ nomUtilisateur });
        if (!utilisateur) {
          return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }
    
        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(motdepasse, utilisateur.motdepasse);
        if (!motDePasseValide) {
          return res.status(400).json({ message: 'Mot de passe incorrect' });
        }
    
        // Générer un token JWT
        const token = jwt.sign(
          { id: utilisateur._id, role: utilisateur.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
    
        res.json({ message: 'Connexion réussie', token });
    
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
      }
};