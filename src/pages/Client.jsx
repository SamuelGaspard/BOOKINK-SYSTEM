import { Link } from 'react-router-dom'

function Client() {
  return (
    <main className="page dashboard-page client-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Espace client</p>
          <h1>Réservez votre prochain rendez-vous</h1>
          <p>Choisissez un service, sélectionnez un prestataire et confirmez votre créneau.</p>
        </div>
        <Link to="/" className="button button-secondary">
          Retour à l'accueil
        </Link>
      </div>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h2>Recherche de service</h2>
          <p>Intégration future : sélection de prestation, personnel et disponibilité en temps réel.</p>
        </article>
        <article className="dashboard-card">
          <h2>Rendez-vous à venir</h2>
          <p>Vos prochains rendez-vous s'afficheront ici pour les annuler ou les reporter rapidement.</p>
        </article>
        <article className="dashboard-card">
          <h2>Historique</h2>
          <p>Consultez vos réservations passées et retrouvez les détails de chaque service.</p>
        </article>
      </section>
    </main>
  )
}

export default Client
