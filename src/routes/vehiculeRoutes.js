const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehiculeController');

router.post('/', vehiculeController.creerVehicule);
router.get('/', vehiculeController.getVehicules);
router.get('/:id', vehiculeController.getVehiculeById);
router.put('/:id', vehiculeController.updateVehicule);
router.delete('/:id', vehiculeController.deleteVehicule);

module.exports = router;
