const express = require('express');
const router = express.Router();
const mecanicienController = require('../controllers/mecanicienController');
const { validationMecanicien } = require('../middleware/validationInscriptionUtilisateur');
const { validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const isManager = require('../middleware/isManager');



router.get('/', authMiddleware, isManager, mecanicienController.getAllMecaniciensActif);
router.get('/nonactifs', authMiddleware, isManager, mecanicienController.getAllMecanicienNonActif);
router.post('/', authMiddleware, isManager, validationMecanicien, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, mecanicienController.storeMecanicien);

router.get('/self', authMiddleware, mecanicienController.getMecanicienSelf);
router.put('/self', authMiddleware, mecanicienController.updateMecanicienSelf);


router.get('/:id', authMiddleware, isManager, mecanicienController.getMecanicienById);
router.put('/:id', authMiddleware, isManager, mecanicienController.updateMecanicien);
router.delete('/:id', authMiddleware, isManager, mecanicienController.deleteMecanicien);
router.put('/nonactifs/reactiver/:id', authMiddleware, isManager, mecanicienController.reactivateMecanicien);



module.exports = router;
