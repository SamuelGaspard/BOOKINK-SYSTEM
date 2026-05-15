import { Link } from 'react-router-dom'

function Admin() {
  return (
    <main className="page dashboard-page admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard administrateur</p>
          <h1>Gestion des rendez-vous et des services</h1>
          <p>Visualisez le planning, configurez les prestations et suivez la performance de votre activité.</p>
        </div>
        <Link to="/" className="button button-secondary">
          Retour à l'accueil
        </Link>
      </div>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h2>Vue calendrier</h2>
          <p>La visualisation jour/semaine/mois viendra ici pour organiser les rendez-vous.</p>
        </article>
        <article className="dashboard-card">
          <h2>Services</h2>
          <p>Ajoutez, modifiez ou retirez des prestations, durées et tarifs rapidement.</p>
        </article>
        <article className="dashboard-card">
          <h2>Personnel</h2>
          <p>Définissez les horaires, pauses et congés de chaque membre de l’équipe.</p>
        </article>
      </section>
    </main>
  )
}

export default Admin
