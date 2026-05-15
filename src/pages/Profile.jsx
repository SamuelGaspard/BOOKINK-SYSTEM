import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function Profile() {
  const auth = useAuth()
  const [name, setName] = useState(auth.user?.name || '')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    auth.updateProfile({ name })
    setMessage('Profil mis à jour avec succès.')
  }

  return (
    <main className="page profile-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Mon compte</p>
          <h1>Bienvenue, {auth.user?.name}</h1>
          <p>Gérez vos informations et consultez vos réservations.</p>
        </div>
      </div>

      <section className="dashboard-grid profile-grid">
        <article className="dashboard-card profile-card">
          <h2>Détails du compte</h2>
          <form className="profile-form" onSubmit={handleSubmit}>
            <label className="field-group">
              <span>Nom</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="field-group">
              <span>Email</span>
              <input value={auth.user?.email || ''} disabled />
            </label>
            <label className="field-group">
              <span>Rôle</span>
              <input value={auth.user?.role || ''} disabled />
            </label>
            <button className="button button-primary" type="submit">
              Mettre à jour
            </button>
            {message && <div className="form-success">{message}</div>}
          </form>
        </article>

        <article className="dashboard-card profile-card">
          <h2>Historique des réservations</h2>
          {auth.user?.bookings?.length ? (
            <div className="booking-list">
              {auth.user.bookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <strong>{booking.service}</strong>
                  <span>{booking.staff}</span>
                  <span>{booking.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucune réservation pour le moment. Réservez un service depuis l’espace client.</p>
          )}
        </article>
      </section>
    </main>
  )
}

export default Profile
