const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

router.post('/', managerController.creerManager);
router.get('/', managerController.getManagers);
router.get('/:id', managerController.getManagerById);
router.put('/:id', managerController.updateManager);
router.delete('/:id', managerController.deleteManager);

module.exports = router;
