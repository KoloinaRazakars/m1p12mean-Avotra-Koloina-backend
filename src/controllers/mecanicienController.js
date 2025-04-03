const Mecanicien = require('../models/Mecanicien');
const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcryptjs');


exports.getAllMecaniciensActif = async (req, res) => {
    try {
        const mecanicien = await Mecanicien.find().populate({
            path: "utilisateurId",
            match: { actif: true }
        });

        const mecanicienActif = mecanicien.filter(m => m.utilisateurId);

        res.status(200).json(mecanicienActif);
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.getAllMecanicienNonActif = async (req, res) => {
    try {
        const mecanicien = await Mecanicien.find().populate({
            path: "utilisateurId",
            match: { actif: false }
        });

        const mecanicienNonActif = mecanicien.filter(m => m.utilisateurId !== null);

        res.status(200).json(mecanicienNonActif);
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.storeMecanicien = async (req, res) => {
    const { nomUtilisateur, motdepasse, nom, prenom } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const motdepasseCrypte =  await bcrypt.hash(motdepasse, salt); 
    
    try {
        const utilisateur = new Utilisateur({
            nomUtilisateur,
            motdepasse: motdepasseCrypte,
            role: "mecanicien",
        });

        await utilisateur.save();

        const mecanicien = new Mecanicien({
            utilisateurId: utilisateur._id,
            nom,
            prenom
        })

        await mecanicien.save()

        res.status(201).json(mecanicien);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: err });
  }
};

exports.getMecanicienById = async (req, res) => 
{
    try {
        const { id } = req.params;
        const mecanicien = await Mecanicien.findById(id).populate({
            path: "utilisateurId",
        });
    
        if (!mecanicien) {
          return res.status(404).json({ message: "mecanicien non trouvé" });
        }
    
        res.json (mecanicien);
    
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
      }
};

exports.updateMecanicien = async (req, res) => {
    const { id } = req.params; 
    const { nomUtilisateur, motdepasse, nom, prenom } = req.body;

    try {
        // Vérifier si le mécanicien existe
        const mecanicien = await Mecanicien.findById(id);
        if (!mecanicien) {
            return res.status(404).json({ message: "Mécanicien introuvable" });
        }

        // Mettre à jour les infos du mécanicien
        mecanicien.nom = nom || mecanicien.nom;
        mecanicien.prenom = prenom || mecanicien.prenom;

        // Récupérer l'utilisateur associé
        const utilisateur = await Utilisateur.findById(mecanicien.utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur associé introuvable" });
        }

        // Mettre à jour les infos de l'utilisateur
        utilisateur.nomUtilisateur = nomUtilisateur || utilisateur.nomUtilisateur;

        if (motdepasse) {
            const salt = await bcrypt.genSalt(10);
            utilisateur.motdepasse = await bcrypt.hash(motdepasse, salt);
        }

        // Sauvegarder les modifications
        await utilisateur.save();
        await mecanicien.save();

        res.status(200).json({ message: "Mise à jour réussie", mecanicien, utilisateur });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    }
};

exports.deleteMecanicien = async (req, res) => {
    try {
        const { id } = req.params;

        const mecanicien = await Mecanicien.findById(id);
        if (!mecanicien) {
            return res.status(404).json({ message: "Mecanicien introuvable" });
        }

        const utilisateur = await Utilisateur.findById(mecanicien.utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur associé introuvable" });
        }

        // Désactiver l'utilisateur au lieu de le supprimer
        utilisateur.actif = false;
        await utilisateur.save();

        res.status(200).json({ message: "Utilisateur désactivé avec succès", mecanicien, utilisateur });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la désactivation", error });
    }
};

exports.reactivateMecanicien = async (req, res) => {
    try {
        const { id } = req.params;

        const mecanicien = await Mecanicien.findById(id);
        if (!mecanicien) {
            return res.status(404).json({ message: "Mecanicien introuvable" });
        }

        const utilisateur = await Utilisateur.findById(mecanicien.utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        utilisateur.actif = true;
        await utilisateur.save();

        res.status(200).json({ message: "Utilisateur réactivé avec succès", mecanicien, utilisateur });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la réactivation", error });
    }
};

//Gestion utilisateur côté utilisateur connecté
exports.getMecanicienSelf = async (req, res) => {
    try {
        console.log("req.user:", req.user);
        userId = req.user.id;
        const utilisateur = await Utilisateur.findById(userId);
        console.log("Utilisateur trouvé:", utilisateur);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const mecanicien = await Mecanicien.findOne({ utilisateurId: utilisateur._id });
        if (!mecanicien) {
            return res.status(404).json({ message: "Mecanicien associé introuvable" });
        }

        res.status(200).json(mecanicien);

    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
};

exports.updateMecanicienSelf = async (req, res) => {
    const { nomUtilisateur, motdepasse, nom, prenom } = req.body;

    try {
        const userId = req.user.id; 

        
        const utilisateur = await Utilisateur.findById(userId);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const mecanicien = await Mecanicien.findOne({ utilisateurId: utilisateur._id });
        if (!mecanicien) {
            return res.status(404).json({ message: "Mecanicien associé introuvable" });
        }

        utilisateur.nomUtilisateur = nomUtilisateur || utilisateur.nomUtilisateur;
        if (motdepasse) {
            const salt = await bcrypt.genSalt(10);
            utilisateur.motdepasse = await bcrypt.hash(motdepasse, salt);
        }

        mecanicien.nom = nom || mecanicien.nom;
        mecanicien.prenom = prenom || mecanicien.prenom;

        await utilisateur.save();
        await mecanicien.save();

        res.status(200).json({ message: "Mise à jour réussie", mecanicien, utilisateur });

    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    }
};



