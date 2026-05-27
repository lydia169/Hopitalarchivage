import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientAPI, dossierAPI } from '../services/api';
import { Patient, DossierMedical } from '../types/index';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dossiers, setDossiers] = useState<DossierMedical[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, dossiersRes] = await Promise.all([
          patientAPI.getAll(),
          dossierAPI.getAll(),
        ]);
        setPatients(patientsRes.data);
        setDossiers(dossiersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role: string) => {
    const roles: { [key: string]: string } = {
      admin: 'Administrateur',
      doctor: 'Médecin',
      nurse: 'Infirmier',
      receptionist: 'Réceptionniste',
    };
    return roles[role] || role;
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  const dossiersArchives = dossiers.filter(d => d.dateArchivage !== null).length;
  const dossiersActifs = dossiers.length - dossiersArchives;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🏥 Hôpital</h1>
        <div style={styles.headerRight}>
          <span style={styles.userInfo}>
            {user?.prenom} {user?.nom} — {getRoleLabel(user?.role || '')}
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Déconnexion</button>
        </div>
      </header>
      <div style={styles.content}>
        <nav style={styles.sidebar}>
          <ul style={styles.navList}>
            <li><Link to="/dashboard" style={styles.navLink}>📊 Tableau de bord</Link></li>
            <li><Link to="/patients" style={styles.navLink}>👥 Patients</Link></li>
            <li><Link to="/dossiers" style={styles.navLink}>📁 Dossiers médicaux</Link></li>
          </ul>
        </nav>
        <main style={styles.main}>
          <h2 style={styles.pageTitle}>Tableau de bord</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h3 style={styles.statValue}>{patients.length}</h3>
              <p style={styles.statLabel}>Patients enregistrés</p>
            </div>
            <div style={styles.statCard}>
              <h3 style={styles.statValue}>{dossiers.length}</h3>
              <p style={styles.statLabel}>Dossiers médicaux</p>
            </div>
            <div style={styles.statCard}>
              <h3 style={styles.statValue}>{dossiersActifs}</h3>
              <p style={styles.statLabel}>Dossiers actifs</p>
            </div>
            <div style={styles.statCard}>
              <h3 style={styles.statValue}>{dossiersArchives}</h3>
              <p style={styles.statLabel}>Dossiers archivés</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  header: {
    background: '#1a237e',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userInfo: {
    fontSize: '0.9rem',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    minHeight: 'calc(100vh - 64px)',
  },
  sidebar: {
    width: '240px',
    background: '#fff',
    borderRight: '1px solid #e0e0e0',
    padding: '1rem',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navLink: {
    display: 'block',
    padding: '0.75rem 1rem',
    color: '#333',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  main: {
    flex: 1,
    padding: '2rem',
  },
  pageTitle: {
    marginBottom: '1.5rem',
    color: '#1a237e',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1a237e',
    margin: 0,
  },
  statLabel: {
    color: '#666',
    marginTop: '0.5rem',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
  },
};

export default Dashboard;
