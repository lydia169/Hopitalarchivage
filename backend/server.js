require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const dossierRoutes = require('./routes/dossiers');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/dossiers', dossierRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Hôpital - Système de gestion des dossiers médicaux' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});
