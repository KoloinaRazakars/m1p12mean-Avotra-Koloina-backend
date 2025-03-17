const Utilisateur = require('../models/Utilisateur');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

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