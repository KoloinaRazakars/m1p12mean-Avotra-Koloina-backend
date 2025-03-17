const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');

router.get('/', utilisateurController.getAllUtilisateurs);
router.get('/:id', utilisateurController.getUtilisateurById);
router.put('/:id', utilisateurController.updateUtilisateur);


module.exports = router;
