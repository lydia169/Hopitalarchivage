const Patient = require('../models/Patient');

const getPatients = async (req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  res.json(patients);
};

const getPatientById = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ message: 'Patient non trouvé' });
  }
};

const createPatient = async (req, res) => {
  const { nom, prenom, dateNaissance, sexe, adresse, telephone } = req.body;

  const patient = await Patient.create({ nom, prenom, dateNaissance, sexe, adresse, telephone });
  res.status(201).json(patient);
};

const updatePatient = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (patient) {
    Object.assign(patient, req.body);
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } else {
    res.status(404).json({ message: 'Patient non trouvé' });
  }
};

const deletePatient = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (patient) {
    await patient.deleteOne();
    res.json({ message: 'Patient supprimé' });
  } else {
    res.status(404).json({ message: 'Patient non trouvé' });
  }
};

module.exports = { getPatients, getPatientById, createPatient, updatePatient, deletePatient };
