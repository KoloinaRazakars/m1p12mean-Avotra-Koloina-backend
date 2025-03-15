const express = require('express');
const authController = require('../controllers/authController');
const { validationInscription } = require('../controllers/authController');
const router = express.Router();


// Inscription
router.post('/inscription', validationInscription, authController.inscription);


//Connexion
router.post('/connexion' , authController.connexion);



module.exports = router;
