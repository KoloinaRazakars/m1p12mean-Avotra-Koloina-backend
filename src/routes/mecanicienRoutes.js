const express = require('express');
const router = express.Router();
const mecanicienController = require('../controllers/mecanicienController');

router.post('/', mecanicienController.creerMecanicien);
router.get('/', mecanicienController.getMecaniciens);
router.get('/:id', mecanicienController.getMecanicienById);
router.put('/:id', mecanicienController.updateMecanicien);
router.delete('/:id', mecanicienController.deleteMecanicien);

module.exports = router;
