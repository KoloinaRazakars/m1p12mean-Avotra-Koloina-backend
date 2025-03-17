const Client = require('../models/Client');
const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcryptjs');


exports.getAllClient = async (req, res) => {
    try {
        const client = await Client.find().populate({
            path: "utilisateurId",
        });
        res.status(200).json(client);
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
exports.deleteClient = async (req, res) => {};
