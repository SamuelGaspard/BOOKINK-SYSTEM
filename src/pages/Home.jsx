import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="page home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Système de Réservation</p>
          <h1>Bookink</h1>
          <p>Réservez facilement un service, gérez vos rendez-vous et suivez votre activité depuis un tableau de bord moderne.</p>
          <div className="hero-actions">
            <Link to="/client" className="button button-primary">
              Espace client
            </Link>
            <Link to="/admin" className="button button-secondary">
              Dashboard admin
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <article className="feature-card">
          <h2>Prise de rendez-vous</h2>
          <p>Recherche de services, sélection du personnel et créneau disponible en temps réel.</p>
        </article>
        <article className="feature-card">
          <h2>Gestion client</h2>
          <p>Historique des réservations, annulation et modifications en quelques clics.</p>
        </article>
        <article className="feature-card">
          <h2>Tableau de bord</h2>
          <p>Contrôle des rendez-vous, statistiques et configuration des prestations.</p>
        </article>
      </section>
    </main>
  )
}

export default Home
