const Utilisateur = require('../models/Utilisateur');
const Manager = require('../models/Manager');
const Mecanicien = require('../models/Mecanicien');
const Client = require('../models/Client');
const bcrypt = require('bcryptjs');

// Récupérer tous les utilisateurs
exports.getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find().populate("managerData").populate("clientData").populate("mecanicienData");
    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Récupérer un utilisateur par ID
exports.getUtilisateurById = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findById(id).populate("managerData").populate("clientData").populate("mecanicienData");

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json (utilisateur);

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Mettre à jour un utilisateur
exports.updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomUtilisateur, motdepasse, nom, prenom } = req.body;

    const utilisateur = await Utilisateur.findById(id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const verifnomUtilisateur = await Utilisateur.findOne({ nomUtilisateur });
    if (verifnomUtilisateur && verifnomUtilisateur._id.toString() !== id) {
      return res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    }

    utilisateur.nomUtilisateur = nomUtilisateur || utilisateur.nomUtilisateur;
    
    if (motdepasse) {
      const salt = await bcrypt.genSalt(10);
      utilisateur.motdepasse = await bcrypt.hash(motdepasse, salt);
    }

    let updatedUserInfo = {};

    // Récupérer et mettre à jour les informations spécifiques selon le rôle de l'utilisateur
    if (utilisateur.role === 'manager') {
      const manager = await Manager.findOne({ utilisateurId: utilisateur._id });
      if (manager) {
        manager.nom = nom || manager.nom;
        manager.prenom = prenom || manager.prenom;
        await manager.save();
        updatedUserInfo = { nom: manager.nom, prenom: manager.prenom };
      }
    } else if (utilisateur.role === 'mecanicien') {
      const mecanicien = await Mecanicien.findOne({ utilisateurId: utilisateur._id });
      if (mecanicien) {
        mecanicien.nom = nom || mecanicien.nom;
        mecanicien.prenom = prenom || mecanicien.prenom;
        await mecanicien.save();
        updatedUserInfo = { nom: mecanicien.nom, prenom: mecanicien.prenom };
      }
    } else if (utilisateur.role === 'client') {
      const client = await Client.findOne({ utilisateurId: utilisateur._id });
      if (client) {
        client.nom = nom || client.nom;
        client.prenom = prenom || client.prenom;
        await client.save();
        updatedUserInfo = { nom: client.nom, prenom: client.prenom };
      }
    }

    await utilisateur.save();

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      utilisateur: {
        nomUtilisateur: utilisateur.nomUtilisateur,
        role: utilisateur.role,
        ...updatedUserInfo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
