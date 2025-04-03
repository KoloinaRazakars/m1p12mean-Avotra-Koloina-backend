const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { validationManager } = require('../middleware/validationInscriptionUtilisateur');
const { validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', managerController.getAllManagerActif);
router.get('/nonactifs', managerController.getAllManagerNonActif);
router.post('/', validationManager, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, managerController.storeManager);

router.get('/self', authMiddleware, managerController.getManagerSelf);
router.put('/self', authMiddleware, managerController.updateManagerSelf);


router.get('/:id', managerController.getManagerById);
router.put('/:id', managerController.updateManager);
router.delete('/:id', managerController.deleteManager);
router.put('/nonactifs/reactiver/:id', managerController.reactivateManager);

module.exports = router;
