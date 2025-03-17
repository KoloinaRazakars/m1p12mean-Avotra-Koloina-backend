const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');

router.get('/nonassignees', missionController.getAllMissionsNonAssignees);
router.get('/encours', missionController.getAllMissionsAssignees);
router.get('/terminee', missionController.getAllMissionsTerminees);

router.get('/nonassigneesclient/:id', missionController.getMissionsNonAssigneesClient);
router.get('/encoursclient/:id', missionController.getMissionsEnCoursClient);
router.get('/termineesclient/:id', missionController.getMissionsTermineesClient);

router.get('/encoursmecanicien/:id', missionController.getMissionsEnCoursMecanicien);
router.get('/termineesmecanicien/:id', missionController.getMissionsTermineesMecanicien);

router.post('/', missionController.storeMission);

module.exports = router;
