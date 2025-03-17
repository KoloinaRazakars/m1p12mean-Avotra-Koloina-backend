const express = require('express');
const router = express.Router();
const mecanicienController = require('../controllers/mecanicienController');
const { validationMecanicien } = require('../middleware/validationInscriptionUtilisateur');
const { validationResult } = require('express-validator');

router.get('/', mecanicienController.getAllMecaniciens);
router.post('/', validationMecanicien, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, mecanicienController.storeMecanicien);
router.get('/:id', mecanicienController.getMecanicienById);
router.put('/:id', mecanicienController.updateMecanicien);
router.delete('/:id', mecanicienController.deleteMecanicien);

module.exports = router;
