const mongoose = require('mongoose');

const dossierMedicalSchema = mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  diagnostic: { type: String },
  traitements: { type: String },
  fichiers: [{
    nom: { type: String },
    url: { type: String },
    type: { type: String },
  }],
  medecinResponsable: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateArchivage: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('DossierMedical', dossierMedicalSchema);
