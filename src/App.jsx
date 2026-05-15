function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">Système de Réservation</p>
          <h1>Bookink</h1>
          <p>Réservez facilement un service, gérez vos rendez-vous et suivez vos réservations.</p>
          <div className="cards">
            <section className="card">
              <h2>Client</h2>
              <p>Trouvez un prestataire, choisissez un créneau et restez informé.</p>
            </section>
            <section className="card">
              <h2>Administrateur</h2>
              <p>Supervisez les rendez-vous, gérez les services et optimisez le planning.</p>
            </section>
          </div>
        </div>
      </header>
      <section className="starter">
        <div className="step">1. Créez votre compte</div>
        <div className="step">2. Choisissez un service</div>
        <div className="step">3. Confirmez votre rendez-vous</div>
      </section>
    </div>
  )
}

export default App
