const DossierMedical = require('../models/DossierMedical');
const Patient = require('../models/Patient');

const getDossiers = async (req, res) => {
  const dossiers = await DossierMedical.find().populate('patientId', 'nom prenom').populate('medecinResponsable', 'nom prenom').sort({ createdAt: -1 });
  res.json(dossiers);
};

const getDossierById = async (req, res) => {
  const dossier = await DossierMedical.findById(req.params.id).populate('patientId').populate('medecinResponsable', 'nom prenom');
  if (dossier) {
    res.json(dossier);
  } else {
    res.status(404).json({ message: 'Dossier non trouvé' });
  }
};

const createDossier = async (req, res) => {
  const { patientId, diagnostic, traitements } = req.body;

  const patientExists = await Patient.findById(patientId);
  if (!patientExists) {
    return res.status(404).json({ message: 'Patient non trouvé' });
  }

  const dossier = await DossierMedical.create({
    patientId,
    diagnostic,
    traitements,
    medecinResponsable: req.user.id,
  });

  const fullDossier = await dossier.populate('patientId', 'nom prenom').populate('medecinResponsable', 'nom prenom');
  res.status(201).json(fullDossier);
};

const updateDossier = async (req, res) => {
  const dossier = await DossierMedical.findById(req.params.id);
  if (dossier) {
    Object.assign(dossier, req.body);
    const updatedDossier = await dossier.save();
    res.json(updatedDossier);
  } else {
    res.status(404).json({ message: 'Dossier non trouvé' });
  }
};

const deleteDossier = async (req, res) => {
  const dossier = await DossierMedical.findById(req.params.id);
  if (dossier) {
    await dossier.deleteOne();
    res.json({ message: 'Dossier supprimé' });
  } else {
    res.status(404).json({ message: 'Dossier non trouvé' });
  }
};

const getDossiersByPatient = async (req, res) => {
  const dossiers = await DossierMedical.find({ patientId: req.params.patientId }).populate('medecinResponsable', 'nom prenom').sort({ createdAt: -1 });
  res.json(dossiers);
};

const archiveDossier = async (req, res) => {
  const dossier = await DossierMedical.findById(req.params.id);
  if (dossier) {
    dossier.dateArchivage = dossier.dateArchivage ? null : new Date();
    const updatedDossier = await dossier.save();
    res.json(updatedDossier);
  } else {
    res.status(404).json({ message: 'Dossier non trouvé' });
  }
};

module.exports = { getDossiers, getDossierById, createDossier, updateDossier, deleteDossier, getDossiersByPatient, archiveDossier };
