import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientAPI } from '../services/api';
import { Patient } from '../types/index';

const Patients = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nom: '', prenom: '', dateNaissance: '', sexe: 'M', adresse: '', telephone: '' });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await patientAPI.getAll();
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await patientAPI.create(formData);
      setShowForm(false);
      setFormData({ nom: '', prenom: '', dateNaissance: '', sexe: 'M', adresse: '', telephone: '' });
      fetchPatients();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce patient ?')) return;
    try {
      await patientAPI.delete(id);
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredPatients = patients.filter(p =>
    `${p.nom} ${p.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.telephone?.includes(searchTerm)
  );

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🏥 Hôpital</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Déconnexion</button>
      </header>
      <div style={styles.content}>
        <nav style={styles.sidebar}>
          <ul style={styles.navList}>
            <li><Link to="/dashboard" style={styles.navLink}>📊 Tableau de bord</Link></li>
            <li><Link to="/patients" style={{...styles.navLink, background: '#e8eaf6'}}>👥 Patients</Link></li>
            <li><Link to="/dossiers" style={styles.navLink}>📁 Dossiers médicaux</Link></li>
          </ul>
        </nav>
        <main style={styles.main}>
          <div style={styles.pageHeader}>
            <h2 style={styles.pageTitle}>👥 Gestion des patients</h2>
            <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
              {showForm ? 'Annuler' : '+ Nouveau patient'}
            </button>
          </div>
          <input
            id="search"
            name="search"
            type="text"
            placeholder="🔍 Rechercher un patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {showForm && (
            <form onSubmit={handleSubmit} style={styles.form}>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label htmlFor="nom" style={styles.label}>Nom</label>
                  <input id="nom" name="nom" type="text" autoComplete="family-name" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} style={styles.input} required />
                </div>
                <div style={styles.field}>
                  <label htmlFor="prenom" style={styles.label}>Prénom</label>
                  <input id="prenom" name="prenom" type="text" autoComplete="given-name" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} style={styles.input} required />
                </div>
                <div style={styles.field}>
                  <label htmlFor="dateNaissance" style={styles.label}>Date de naissance</label>
                  <input id="dateNaissance" name="dateNaissance" type="date" autoComplete="bday" value={formData.dateNaissance} onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})} style={styles.input} required />
                </div>
                <div style={styles.field}>
                  <label htmlFor="sexe" style={styles.label}>Sexe</label>
                  <select id="sexe" name="sexe" autoComplete="sex" value={formData.sexe} onChange={(e) => setFormData({...formData, sexe: e.target.value})} style={styles.input}>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label htmlFor="telephone" style={styles.label}>Téléphone</label>
                  <input id="telephone" name="telephone" type="tel" autoComplete="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label htmlFor="adresse" style={styles.label}>Adresse</label>
                  <input id="adresse" name="adresse" type="text" autoComplete="street-address" value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} style={styles.input} />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn}>Enregistrer</button>
            </form>
          )}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>Prénom</th>
                <th style={styles.th}>Date de naissance</th>
                <th style={styles.th}>Sexe</th>
                <th style={styles.th}>Téléphone</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr><td colSpan={6} style={styles.noData}>Aucun patient trouvé</td></tr>
              ) : (
                filteredPatients.map(p => (
                  <tr key={p._id} style={styles.tr}>
                    <td style={styles.td}>{p.nom}</td>
                    <td style={styles.td}>{p.prenom}</td>
                    <td style={styles.td}>{new Date(p.dateNaissance).toLocaleDateString('fr-FR')}</td>
                    <td style={styles.td}>{p.sexe === 'M' ? 'M' : 'F'}</td>
                    <td style={styles.td}>{p.telephone || '-'}</td>
                    <td style={styles.td}>
                      <Link to={`/dossiers/patient/${p._id}`} style={styles.viewBtn}>📁 Dossiers</Link>
                      <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  header: { background: '#1a237e', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { margin: 0, fontSize: '1.5rem' },
  logoutBtn: { padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  content: { display: 'flex', minHeight: 'calc(100vh - 64px)' },
  sidebar: { width: '240px', background: '#fff', borderRight: '1px solid #e0e0e0', padding: '1rem' },
  navList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  navLink: { display: 'block', padding: '0.75rem 1rem', color: '#333', textDecoration: 'none', borderRadius: '8px', fontSize: '1rem' },
  main: { flex: 1, padding: '2rem' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2rem' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  pageTitle: { margin: 0, color: '#1a237e' },
  addBtn: { padding: '0.5rem 1rem', background: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  searchInput: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem', fontSize: '1rem' },
  form: { background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: 600, color: '#333', fontSize: '0.9rem' },
  input: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  error: { color: '#c62828', marginBottom: '0.5rem' },
  submitBtn: { padding: '0.6rem 1.5rem', background: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  th: { background: '#1a237e', color: 'white', padding: '0.75rem', textAlign: 'left', fontWeight: 600 },
  td: { padding: '0.75rem', borderBottom: '1px solid #eee' },
  tr: {},
  noData: { textAlign: 'center', padding: '2rem', color: '#999' },
  viewBtn: { color: '#1a237e', textDecoration: 'none', fontWeight: 600, marginRight: '0.5rem' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' },
};

export default Patients;
