const Manager = require('../models/Manager');
const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcryptjs');


exports.getAllManagerActif = async (req, res) => {
    try {
        const manager = await Manager.find().populate({
            path: "utilisateurId",
            match: { actif: true }
        });

        const managerActifs = manager.filter(m => m.utilisateurId);

        res.status(200).json(managerActifs);
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.getAllManagerNonActif = async (req, res) => {
    try {
        const manager = await Manager.find().populate({
            path: "utilisateurId",
            match: { actif: false }
        });

        const managerNonActifs = manager.filter(m => m.utilisateurId !== null);

        res.status(200).json(managerNonActifs);
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.storeManager = async (req, res) => {
    const { nomUtilisateur, motdepasse, nom, prenom } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const motdepasseCrypte =  await bcrypt.hash(motdepasse, salt); 
    
    try {
        const utilisateur = new Utilisateur({
            nomUtilisateur,
            motdepasse: motdepasseCrypte,
            role: "manager",
        });

        await utilisateur.save();

        const manager = new Manager ({
            utilisateurId: utilisateur._id,
            nom,
            prenom
        })

        await manager.save()

        res.status(201).json(manager);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: err });
  }
};

exports.getManagerById = async (req, res) => 
{
    try {
        const { id } = req.params;
        const manager = await Manager.findById(id).populate({
            path: "utilisateurId",
        });
    
        if (!manager) {
          return res.status(404).json({ message: "manager non trouvé" });
        }
    
        res.json (manager);
    
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
      }
};

exports.updateManager = async (req, res) => {
    const { id } = req.params; 
    const { nomUtilisateur, motdepasse, nom, prenom } = req.body;

    try {
        // Vérifier si le manager existe
        const manager = await Manager.findById(id);
        if (!manager) {
            return res.status(404).json({ message: "Manager introuvable" });
        }

        // Mettre à jour les infos du manager
        manager.nom = nom || manager.nom;
        manager.prenom = prenom || manager.prenom;

        // Récupérer l'utilisateur associé
        const utilisateur = await Utilisateur.findById(manager.utilisateurId);
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
        await manager.save();

        res.status(200).json({ message: "Mise à jour réussie", manager, utilisateur });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    }
};

exports.deleteManager = async (req, res) => {
    try {
        const { id } = req.params;

        const manager = await Manager.findById(id);
        if (!manager) {
            return res.status(404).json({ message: "Manager introuvable" });
        }

        const utilisateur = await Utilisateur.findById(manager.utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur associé introuvable" });
        }

        // Désactiver l'utilisateur au lieu de le supprimer
        utilisateur.actif = false;
        await utilisateur.save();

        res.status(200).json({ message: "Utilisateur désactivé avec succès", manager, utilisateur });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la désactivation", error });
    }
};

exports.reactivateManager = async (req, res) => {
    try {
        const { id } = req.params;

        const manager = await Manager.findById(id);
        if (!manager) {
            return res.status(404).json({ message: "Manager introuvable" });
        }

        const utilisateur = await Utilisateur.findById(manager.utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        utilisateur.actif = true;
        await utilisateur.save();

        res.status(200).json({ message: "Utilisateur réactivé avec succès", manager, utilisateur });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la réactivation", error });
    }
};

//Gestion utilisateur côté utilisateur connecté
exports.getManagerSelf = async (req, res) => {
    try {
        console.log("req.user:", req.user);
        userId = req.user.id;
        const utilisateur = await Utilisateur.findById(userId);
        console.log("Utilisateur trouvé:", utilisateur);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const manager = await Manager.findOne({ utilisateurId: utilisateur._id });
        if (!manager) {
            return res.status(404).json({ message: "Manager associé introuvable" });
        }

        res.status(200).json(manager);

    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
};

exports.updateManagerSelf = async (req, res) => {
    const { nomUtilisateur, motdepasse, nom, prenom } = req.body;

    try {
        const userId = req.user.id; 

        
        const utilisateur = await Utilisateur.findById(userId);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        const manager = await Manager.findOne({ utilisateurId: utilisateur._id });
        if (!manager) {
            return res.status(404).json({ message: "Manager associé introuvable" });
        }

        utilisateur.nomUtilisateur = nomUtilisateur || utilisateur.nomUtilisateur;
        if (motdepasse) {
            const salt = await bcrypt.genSalt(10);
            utilisateur.motdepasse = await bcrypt.hash(motdepasse, salt);
        }

        manager.nom = nom || manager.nom;
        manager.prenom = prenom || manager.prenom;

        await utilisateur.save();
        await manager.save();

        res.status(200).json({ message: "Mise à jour réussie", manager, utilisateur });

    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    }
};



