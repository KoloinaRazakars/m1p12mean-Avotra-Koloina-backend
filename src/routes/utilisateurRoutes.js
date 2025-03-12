const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');

router.post('/', utilisateurController.creerUtilisateur);
router.get('/', utilisateurController.getUtilisateurs);
router.get('/:id', utilisateurController.getUtilisateurById);
router.put('/:id', utilisateurController.updateUtilisateur);
router.delete('/:id', utilisateurController.deleteUtilisateur);

module.exports = router;
