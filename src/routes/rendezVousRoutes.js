const express = require('express');
const router = express.Router();
const rendezVousController = require('../controllers/rendezVousController');

router.post('/', rendezVousController.creerRendezVous);
router.get('/', rendezVousController.getRendezVous);
router.get('/:id', rendezVousController.getRendezVousById);
router.put('/:id', rendezVousController.updateRendezVous);
router.delete('/:id', rendezVousController.deleteRendezVous);

module.exports = router;
