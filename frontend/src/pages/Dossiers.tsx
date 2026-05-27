import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dossierAPI, patientAPI } from '../services/api';
import { DossierMedical, Patient } from '../types/index';

const Dossiers = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [dossiers, setDossiers] = useState<DossierMedical[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ patientId: '', diagnostic: '', traitements: '' });
  const [error, setError] = useState('');

  const fetchDossiers = async () => {
    try {
      const res = patientId ? await dossierAPI.getByPatient(patientId) : await dossierAPI.getAll();
      setDossiers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await patientAPI.getAll();
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (patientId) {
      const findPatient = async () => {
        try {
          const res = await patientAPI.getById(patientId);
          setPatient(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      findPatient();
    }
  }, [patientId]);

  useEffect(() => {
    fetchDossiers();
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await dossierAPI.create(formData);
      setShowForm(false);
      setFormData({ patientId: '', diagnostic: '', traitements: '' });
      fetchDossiers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce dossier ?')) return;
    try {
      await dossierAPI.delete(id);
      fetchDossiers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await dossierAPI.archive(id);
      fetchDossiers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            <li><Link to="/patients" style={styles.navLink}>👥 Patients</Link></li>
            <li><Link to="/dossiers" style={{...styles.navLink, background: '#e8eaf6'}}>📁 Dossiers médicaux</Link></li>
          </ul>
        </nav>
        <main style={styles.main}>
          <div style={styles.pageHeader}>
            <h2 style={styles.pageTitle}>
              {patient ? `Dossiers de ${patient.prenom} ${patient.nom}` : '📁 Dossiers médicaux'}
            </h2>
            {patient && (
              <Link to="/patients" style={styles.backBtn}>← Retour aux patients</Link>
            )}
            {!patientId && (
              <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
                {showForm ? 'Annuler' : '+ Nouveau dossier'}
              </button>
            )}
          </div>
          {showForm && !patientId && (
            <form onSubmit={handleSubmit} style={styles.form}>
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label htmlFor="patient" style={styles.label}>Patient</label>
                  <select id="patient" name="patientId" autoComplete="off" value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})} style={styles.input} required>
                    <option value="">Sélectionner un patient</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.prenom} {p.nom}</option>)}
                  </select>
                </div>
                <div style={styles.field}>
                  <label htmlFor="diagnostic" style={styles.label}>Diagnostic</label>
                  <input id="diagnostic" name="diagnostic" type="text" autoComplete="off" value={formData.diagnostic} onChange={(e) => setFormData({...formData, diagnostic: e.target.value})} style={styles.input} />
                </div>
                <div style={{...styles.field, gridColumn: 'span 2'}}>
                  <label htmlFor="traitements" style={styles.label}>Traitements</label>
                  <textarea id="traitements" name="traitements" autoComplete="off" value={formData.traitements} onChange={(e) => setFormData({...formData, traitements: e.target.value})} style={styles.textarea} rows={3} />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn}>Enregistrer</button>
            </form>
          )}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Diagnostic</th>
                <th style={styles.th}>Médecin</th>
                <th style={styles.th}>Date de création</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.length === 0 ? (
                <tr><td colSpan={6} style={styles.noData}>Aucun dossier trouvé</td></tr>
              ) : (
                dossiers.map(d => (
                  <tr key={d._id} style={styles.tr}>
                    <td style={styles.td}>
                      {typeof d.patientId === 'object' ? `${d.patientId.prenom} ${d.patientId.nom}` : 'Patient supprimé'}
                    </td>
                    <td style={styles.td}>{d.diagnostic || '-'}</td>
                    <td style={styles.td}>
                      {typeof d.medecinResponsable === 'object' ? `${d.medecinResponsable.prenom} ${d.medecinResponsable.nom}` : '-'}
                    </td>
                    <td style={styles.td}>{new Date(d.createdAt || '').toLocaleDateString('fr-FR')}</td>
                    <td style={styles.td}>
                      <span style={{...styles.statusBadge, background: d.dateArchivage ? '#fff3e0' : '#e8f5e9', color: d.dateArchivage ? '#e65100' : '#2e7d32'}}>
                        {d.dateArchivage ? 'Archivé' : 'Actif'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleArchive(d._id)} style={styles.archiveBtn}>
                        {d.dateArchivage ? '📂 Désarchiver' : '📦 Archiver'}
                      </button>
                      <button onClick={() => handleDelete(d._id)} style={styles.deleteBtn}>🗑️</button>
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
  backBtn: { color: '#1a237e', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' },
  addBtn: { padding: '0.5rem 1rem', background: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  form: { background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: 600, color: '#333', fontSize: '0.9rem' },
  input: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  textarea: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', resize: 'vertical' },
  error: { color: '#c62828', marginBottom: '0.5rem' },
  submitBtn: { padding: '0.6rem 1.5rem', background: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  th: { background: '#1a237e', color: 'white', padding: '0.75rem', textAlign: 'left', fontWeight: 600 },
  td: { padding: '0.75rem', borderBottom: '1px solid #eee' },
  noData: { textAlign: 'center', padding: '2rem', color: '#999' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' },
  archiveBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#1a237e', marginRight: '0.5rem' },
  statusBadge: { padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 },
};

export default Dossiers;
