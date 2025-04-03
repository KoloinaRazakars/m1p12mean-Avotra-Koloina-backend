const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const authMiddleware  = require('../middleware/authMiddleware');
const isClient = require('../middleware/isClient');
const isMecanicien = require('../middleware/isMecanicien');

router.get('/nonassignees', authMiddleware, missionController.getAllMissionsNonAssignees);
router.get('/encours', authMiddleware, missionController.getAllMissionsAssignees);
router.get('/terminee', authMiddleware, missionController.getAllMissionsTerminees);

router.get('/nonassigneesclient/self', authMiddleware, isClient, missionController.getMissionsNonAssigneesClientSelf);
router.get('/encoursclient/self', authMiddleware, isClient, missionController.getMissionsEnCoursClientSelf);
router.get('/termineesclient/self', authMiddleware, isClient, missionController.getMissionsTermineesClientSelf);

router.get('/nonassigneesclient/:id', authMiddleware, missionController.getMissionsNonAssigneesClient);
router.get('/encoursclient/:id', authMiddleware, missionController.getMissionsEnCoursClient);
router.get('/termineesclient/:id', authMiddleware, missionController.getMissionsTermineesClient);

router.get('/encoursmecanicien/self', authMiddleware, isMecanicien, missionController.getMissionsEnCoursMecanicienSelf);
router.get('/termineesmecanicien/self', authMiddleware, isMecanicien, missionController.getMissionsTermineesMecanicienSelf);

router.get('/encoursmecanicien/:id', authMiddleware, missionController.getMissionsEnCoursMecanicien);
router.get('/termineesmecanicien/:id', authMiddleware, missionController.getMissionsTermineesMecanicien);

router.post('/', missionController.storeMission);

module.exports = router;
