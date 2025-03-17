const Client = require('../models/Client');
const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcryptjs');


exports.getAllClientActif = async (req, res) => {
    try {
        const clients = await Client.find().populate({
            path: "utilisateurId",
            match: { actif: true }
        });

        const clientsActifs = clients.filter(c => c.utilisateurId);

        res.status(200).json(clientsActifs);
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.getAllClientNonActif = async (req, res) => {
    try {
        const clients = await Client.find().populate({
            path: "utilisateurId",
            match: { actif: false }
        });

        const clientsNonActifs = clients.filter(c => c.utilisateurId !== null);

        res.status(200).json(clientsNonActifs);
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

exports.storeClient = async (req, res) => {
    const { nomUtilisateur, motdepasse, nom, prenom } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const motdepasseCrypte =  await bcrypt.hash(motdepasse, salt); 
    
    try {
        const utilisateur = new Utilisateur({
            nomUtilisateur,
            motdepasse: motdepasseCrypte,
            role: "client",
        });

        await utilisateur.save();

        const client = new Client ({
            utilisateurId: utilisateur._id,
            nom,
            prenom
        })

        await client.save()

        res.status(201).json(client);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: err });
  }
};

exports.getClientById = async (req, res) => 
{
    try {
        const { id } = req.params;
        const client = await Client.findById(id).populate({
            path: "utilisateurId",
        });
    
        if (!client) {
          return res.status(404).json({ message: "client non trouvé" });
        }
    
        res.json (client);
    
      } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
      }
};

exports.updateClient = async (req, res) => {
    const { id } = req.params; 
    const { nomUtilisateur, motdepasse, nom, prenom } = req.body;

    try {
        // Vérifier si le client existe
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client introuvable" });
        }

        // Mettre à jour les infos du client
        client.nom = nom || client.nom;
        client.prenom = prenom || client.prenom;

        // Récupérer l'utilisateur associé
        const utilisateur = await Utilisateur.findById(client.utilisateurId);
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
        await client.save();

        res.status(200).json({ message: "Mise à jour réussie", client, utilisateur });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour", error: err });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client introuvable" });
        }

        const utilisateur = await Utilisateur.findById(client.utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur associé introuvable" });
        }

        // Désactiver l'utilisateur au lieu de le supprimer
        utilisateur.actif = false;
        await utilisateur.save();

        res.status(200).json({ message: "Utilisateur désactivé avec succès", client, utilisateur });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la désactivation", error });
    }
};

exports.reactivateClient = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client introuvable" });
        }

        const utilisateur = await Utilisateur.findById(client.utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        utilisateur.actif = true;
        await utilisateur.save();

        res.status(200).json({ message: "Utilisateur réactivé avec succès", client, utilisateur });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la réactivation", error });
    }
};
