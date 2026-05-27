const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
  const { nom, prenom, email, motDePasse, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Utilisateur déjà existant' });
  }

  const user = await User.create({ nom, prenom, email, motDePasse, role });

  res.status(201).json({
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

const login = async (req, res) => {
  const { email, motDePasse } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(motDePasse))) {
    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Identifiants invalides' });
  }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-motDePasse');
  res.json(user);
};

module.exports = { register, login, getMe };
