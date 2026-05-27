const express = require('express');
const router = express.Router();
const { getDossiers, getDossierById, createDossier, updateDossier, deleteDossier, getDossiersByPatient, archiveDossier } = require('../controllers/dossierController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.route('/').get(protect, getDossiers).post(protect, createDossier);
router.route('/:id').get(protect, getDossierById).put(protect, updateDossier).delete(protect, deleteDossier);
router.put('/:id/archive', protect, archiveDossier);
router.get('/patient/:patientId', protect, getDossiersByPatient);

module.exports = router;
