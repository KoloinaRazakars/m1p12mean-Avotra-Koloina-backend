const Mission = require('../models/Mission');
const Vehicule = require('../models/Vehicule');
const Mecanicien = require('../models/Mecanicien');
const { default: mongoose } = require('mongoose');


//Liswte des missions non assignées
exports.getAllMissionsNonAssignees = async (req, res) => {
    try {
        const missions = await Mission.find({ statut: 'non assignée' })
            .populate('vehiculeId')
            .populate('mecanicienId');
        
        if (missions.length === 0) {
            return res.status(404).json({ message: "Aucune mission non assignée trouvée" });
        }
        
        res.status(200).json(missions);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};


//Liste des missions en cours de traitement donc assignée
exports.getAllMissionsAssignees = async (req, res) => {
    try {
        const missions = await Mission.find({ statut: 'en cours'})
            .populate('vehiculeId')
            .populate('mecanicienId');

        if (missions.length === 0) {
            return res.status(404).json({ message: "Aucune mission assignée trouvée" });
        }

        res.status(200).json(missions);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};


//Liste des missions en cours de traitement donc assignée
exports.getAllMissionsTerminees = async (req, res) => {
    try {
        const missions = await Mission.find({ statut: 'terminée'})
            .populate('vehiculeId')
            .populate('mecanicienId');

        if (missions.length === 0) {
            return res.status(404).json({ message: "Aucune mission assignée trouvée" });
        }

        res.status(200).json(missions);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//Liste des missions non assignées pour un client
exports.getMissionsNonAssigneesClient = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si le client possède des véhicules
        const clientObjectId = new mongoose.Types.ObjectId(id);
        const vehicules = await Vehicule.find({ clientId: clientObjectId });
        if (vehicules.length === 0) {
            return res.status(404).json({ message: "Aucun véhicule trouvé pour ce client." });
        }

        // Extraire les IDs des véhicules du client
        const vehiculeIds = vehicules.map(v => v._id);

        const missions = await Mission.find({ 
            vehiculeId: { $in: vehiculeIds }, 
            statut: "non assignée" 
        }).populate("vehiculeId mecanicienId");

        res.status(200).json(missions);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//Liste des missions en cours de traitement pour un client
exports.getMissionsEnCoursClient = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si le client possède des véhicules
        const clientObjectId = new mongoose.Types.ObjectId(id);
        const vehicules = await Vehicule.find({ clientId: clientObjectId });
        if (vehicules.length === 0) {
            return res.status(404).json({ message: "Aucun véhicule trouvé pour ce client." });
        }

        // Extraire les IDs des véhicules du client
        const vehiculeIds = vehicules.map(v => v._id);

        const missions = await Mission.find({ 
            vehiculeId: { $in: vehiculeIds }, 
            statut: "en cours" 
        }).populate("vehiculeId mecanicienId");

        res.status(200).json(missions);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//Liste des missions terminées pour un client
exports.getMissionsTermineesClient = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si le client possède des véhicules
        const clientObjectId = new mongoose.Types.ObjectId(id);
        const vehicules = await Vehicule.find({ clientId: clientObjectId });
        if (vehicules.length === 0) {
            return res.status(404).json({ message: "Aucun véhicule trouvé pour ce client." });
        }

        // Extraire les IDs des véhicules du client
        const vehiculeIds = vehicules.map(v => v._id);

        const missions = await Mission.find({ 
            vehiculeId: { $in: vehiculeIds }, 
            statut: "terminée" 
        }).populate("vehiculeId mecanicienId");

        res.status(200).json(missions);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};


//Liste des missions en cours de traitement par un mecanicien
exports.getMissionsEnCoursMecanicien = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si le mécanicien existe
        const mecanicien = await Mecanicien.findById(id);
        if (!mecanicien) {
            return res.status(404).json({ message: "Mécanicien introuvable." });
        }

        // Chercher les missions qui lui sont assignées et qui sont en cours
        const missions = await Mission.find({ 
            mecanicienId: id, 
            statut: "en cours" 
        }).populate("vehiculeId");

        if (missions.length === 0) {
            return res.status(404).json({ message: "Aucune mission en cours trouvée pour ce mécanicien." });
        }

        res.status(200).json(missions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//Liste des missions terminées par un mecanicien
exports.getMissionsTermineesMecanicien = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si le mécanicien existe
        const mecanicien = await Mecanicien.findById(id);
        if (!mecanicien) {
            return res.status(404).json({ message: "Mécanicien introuvable." });
        }

        // Chercher les missions qui lui sont assignées et qui sont en cours
        const missions = await Mission.find({ 
            mecanicienId: id, 
            statut: "terminée" 
        }).populate("vehiculeId");

        if (missions.length === 0) {
            return res.status(404).json({ message: "Aucune mission en cours trouvée pour ce mécanicien." });
        }

        res.status(200).json(missions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.storeMission = async (req, res) => {
    const { vehiculeId, mecanicienId, taches, statut } = req.body;

    try {
        // Vérifier si le véhicule existe
        const vehicule = await Vehicule.findById(vehiculeId);
        if (!vehicule) {
            return res.status(404).json({ message: "Véhicule introuvable" });
        }

        // Vérifier si le mécanicien existe uniquement s'il est fourni
        let statut = "non assignée";
        let mecanicienExiste = null;

        if (mecanicienId) {
            mecanicienExiste = await Mecanicien.findById(mecanicienId);
            if (!mecanicienExiste) {
                return res.status(404).json({ message: "Mécanicien introuvable" });
            }
            statut = "en cours"; 
        }

        const mission = new Mission({
            vehiculeId,
            mecanicienId: mecanicienExiste ? mecanicienId : null,
            taches,
            statut
        });

        await mission.save();

        res.status(201).json(mission);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
};