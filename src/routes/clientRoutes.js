const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validationClient } = require('../middleware/validationInscriptionUtilisateur');
const { validationResult } = require('express-validator');
const authMiddleware  = require('../middleware/authMiddleware');
const isManager = require('../middleware/isManager');

router.get('/', authMiddleware, isManager, clientController.getAllClientActif);
router.get('/nonactifs', authMiddleware, isManager, clientController.getAllClientNonActif);
router.post('/', authMiddleware, validationClient, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, clientController.storeClient);

router.get('/self', authMiddleware, clientController.getClientSelf);
router.put('/self', authMiddleware, clientController.updateClientSelf);

router.get('/:id', authMiddleware, isManager, clientController.getClientById);
router.put('/:id', authMiddleware, isManager, clientController.updateClient);
router.delete('/:id', authMiddleware, isManager, clientController.deleteClient);
router.put('/nonactifs/reactiver/:id', isManager, clientController.reactivateClient);



module.exports = router;
