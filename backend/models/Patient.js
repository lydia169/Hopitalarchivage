const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  sexe: { type: String, enum: ['M', 'F'], required: true },
  adresse: { type: String },
  telephone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
