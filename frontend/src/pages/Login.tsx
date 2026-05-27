import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, motDePasse);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏥 Hôpital - Connexion</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Mot de passe</label>
            <input
              id="password"
              name="motDePasse"
              type="password"
              autoComplete="current-password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>Se connecter</button>
        </form>
        <p style={styles.link}>
          Pas de compte ? <Link to="/register">S'inscrire</Link>
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
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '420px',
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
  field: {
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

export default Login;
