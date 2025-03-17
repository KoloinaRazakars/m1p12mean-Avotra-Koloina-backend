const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validationClient } = require('../middleware/validationInscriptionUtilisateur');
const { validationResult } = require('express-validator');

router.get('/', clientController.getAllClientActif);
router.get('/nonactifs', clientController.getAllClientNonActif);
router.post('/', validationClient, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, clientController.storeClient);
router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);
router.put('/nonactifs/reactiver/:id', clientController.reactivateClient);

module.exports = router;
