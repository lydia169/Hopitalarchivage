import { Link } from 'react-router-dom';
import { FileText, MapPin, List, LogIn, UserPlus } from 'lucide-react';

const Home = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Archivage Médical</h1>
        <p style={styles.subtitle}>
          La solution sécurisée pour gérer les dossiers médicaux de votre établissement
        </p>
      </header>

      <div style={styles.cardsContainer}>
        <section style={styles.card}>
          <div style={styles.iconWrapper}>
            <FileText style={styles.icon} />
          </div>
          <h2 style={styles.cardTitle}>Conserver vos documents</h2>
          <p style={styles.cardText}>
            Stockez, organisez et archivez en toute sécurité les dossiers médicaux de vos patients.
            Accédez rapidement aux informations essentielles tout en respectant la confidentialité.
          </p>
        </section>

        <section style={styles.card}>
          <div style={styles.iconWrapper}>
            <MapPin style={styles.icon} />
          </div>
          <h2 style={styles.cardTitle}>Découvrir les autres hôpitaux</h2>
          <p style={styles.cardText}>
            Consultez le répertoire des établissements de santé participants, échangez des bonnes pratiques
            et collaborez pour améliorer la qualité des soins au niveau régional.
          </p>
        </section>

        <section style={styles.card}>
          <div style={styles.iconWrapper}>
            <List style={styles.icon} />
          </div>
          <h2 style={styles.cardTitle}>Comment utiliser l'application</h2>
          <ol style={styles.cardList}>
            <li>
              Créez un compte pour votre établissement ou connectez-vous si vous en avez déjà un.
            </li>
            <li>
              Enregistrez vos patients et créez leurs dossiers médicaux.
            </li>
            <li>
              Téléversez les documents (ordonnances, résultats d'examens, comptes rendus).
            </li>
            <li>
              Utilisez les outils de recherche et de filtrage pour retrouver rapidement une information.
            </li>
            <li>
              Archivez les dossiers clôturés tout en les conservant accessible selon la réglementation.
            </li>
          </ol>
        </section>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerButtons}>
<Link to="/login" style={styles.btnLogin}>
             <LogIn style={{ width: 20, height: 20, marginRight: 8 }} /> Se connecter
           </Link>
          <Link to="/register" style={styles.btnRegister}>
            <UserPlus style={{ width: 20, height: 20, marginRight: 8 }} /> Créer un compte
          </Link>
        </div>
        <p style={styles.footerText}>
          © 2026 Archivage Médical - Tous droits réservés
        </p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1a237e',
    color: 'white',
    textAlign: 'center',
    padding: '3rem 2rem',
    width: '100%',
    maxWidth: '800px',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '2.5rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto',
  },
  cardsContainer: {
    display: 'grid',
    gap: '1.5rem',
    width: '90%',
    maxWidth: '800px',
    margin: '2rem auto',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: '#e8f0fe',
    borderRadius: '10px',
  },
  icon: {
    color: '#1a237e',
    width: '24px',
    height: '24px',
  },
  cardTitle: {
    color: '#1a237e',
    fontSize: '1.25rem',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  cardText: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#555',
  },
  cardList: {
    fontSize: '0.95rem',
    lineHeight: '1.8',
    paddingLeft: '1.5rem',
    color: '#555',
  },
  footer: {
    backgroundColor: '#fff',
    borderTop: '1px solid #e0e0e0',
    textAlign: 'center',
    padding: '2rem',
    width: '100%',
    maxWidth: '800px',
    marginTop: '3rem',
  },
  footerButtons: {
    marginBottom: '1.5rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnLogin: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#1a237e',
    color: 'white',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    transition: 'background-color 0.3s',
    border: 'none',
    cursor: 'pointer',
  },
  btnRegister: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    transition: 'background-color 0.3s',
    border: 'none',
    cursor: 'pointer',
  },
  footerText: {
    fontSize: '0.9rem',
    color: '#666',
  },
};

export default Home;