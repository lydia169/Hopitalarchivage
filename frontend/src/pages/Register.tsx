import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [role, setRole] = useState('receptionist');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({ nom, prenom, email, motDePasse, role });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur d\'inscription');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏥 Inscription</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label htmlFor="nom" style={styles.label}>Nom</label>
              <input id="nom" name="nom" type="text" autoComplete="family-name" value={nom} onChange={(e) => setNom(e.target.value)} style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label htmlFor="prenom" style={styles.label}>Prénom</label>
              <input id="prenom" name="prenom" type="text" autoComplete="given-name" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={styles.input} required />
            </div>
          </div>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label htmlFor="motDePasse" style={styles.label}>Mot de passe</label>
            <input id="motDePasse" name="motDePasse" type="password" autoComplete="new-password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label htmlFor="role" style={styles.label}>Rôle</label>
            <select id="role" name="role" autoComplete="organization-title" value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
              <option value="receptionist">Réceptionniste</option>
              <option value="nurse">Infirmier</option>
              <option value="doctor">Médecin</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <button type="submit" style={styles.button}>S'inscrire</button>
        </form>
        <p style={styles.link}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '480px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#1a237e',
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  row: {
    display: 'flex',
    gap: '1rem',
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: 600,
    color: '#333',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    background: '#1a237e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#555',
  },
};

export default Register;
