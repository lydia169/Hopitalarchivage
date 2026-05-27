const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'nurse', 'admin', 'receptionist'], default: 'receptionist' },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('motDePasse')) return;
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);
