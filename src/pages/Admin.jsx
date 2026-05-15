import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const initialServices = [
  { id: 1, name: 'Consultation bien-être', duration: '45 min', price: 45, description: 'Conseil personnalisé pour maximiser votre bien-être.' },
  { id: 2, name: 'Massage relaxant', duration: '60 min', price: 65, description: 'Massage détente pour évacuer le stress.' },
  { id: 3, name: 'Coaching personnel', duration: '30 min', price: 35, description: 'Accompagnement sur mesure pour votre planning.' },
]

const initialAppointments = [
  { id: 1, title: 'Massage relaxant - Client A', date: '2026-06-18' },
  { id: 2, title: 'Consultation bien-être - Client B', date: '2026-06-20' },
  { id: 3, title: 'Coaching personnel - Client C', date: '2026-06-24' },
]

const users = [
  { id: 1, name: 'Client Bookink', role: 'client' },
  { id: 2, name: 'Admin Bookink', role: 'admin' },
  { id: 3, name: 'Prestataire Alice', role: 'staff' },
]

function Admin() {
  const [services, setServices] = useState(initialServices)
  const [appointments] = useState(initialAppointments)
  const [name, setName] = useState('')
  const [duration, setDuration] = useState('45 min')
  const [price, setPrice] = useState(45)
  const [description, setDescription] = useState('')

  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
  const firstWeekday = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const calendarDays = useMemo(() => {
    const days = []
    for (let index = 0; index < firstWeekday; index += 1) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
    }
    return days
  }, [currentDate, daysInMonth, firstWeekday])

  const appointmentsByDate = useMemo(
    () =>
      appointments.reduce((acc, appointment) => {
        acc[appointment.date] = [...(acc[appointment.date] || []), appointment]
        return acc
      }, {}),
    [appointments],
  )

  const handleAddService = (event) => {
    event.preventDefault()
    if (!name || !price) return
    setServices((previous) => [
      ...previous,
      { id: Date.now(), name, duration, price: Number(price), description },
    ])
    setName('')
    setDuration('45 min')
    setPrice(45)
    setDescription('')
  }

  return (
    <main className="page dashboard-page admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard administrateur</p>
          <h1>Gestion des rendez-vous et des services</h1>
          <p>Visualisez le planning, configurez les prestations et suivez l’activité de vos clients.</p>
        </div>
        <Link to="/" className="button button-secondary">
          Retour à l'accueil
        </Link>
      </div>

      <section className="dashboard-grid admin-top-grid">
        <article className="dashboard-card stats-card">
          <h2>Vue calendrier</h2>
          <p>{currentMonth}</p>
          <div className="calendar-grid">
            <div className="calendar-labels">
              <span>Dim</span>
              <span>Lun</span>
              <span>Mar</span>
              <span>Mer</span>
              <span>Jeu</span>
              <span>Ven</span>
              <span>Sam</span>
            </div>
            <div className="calendar-days">
              {calendarDays.map((date, index) => {
                const isoDate = date ? date.toISOString().slice(0, 10) : null
                const events = isoDate ? appointmentsByDate[isoDate] : undefined
                return (
                  <div key={`${index}-${isoDate || 'empty'}`} className={events ? 'calendar-day active' : 'calendar-day'}>
                    <span>{date ? date.getDate() : ''}</span>
                    {events && <span className="calendar-badge">{events.length}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </article>

        <article className="dashboard-card stats-card">
          <h2>Équipe et utilisateurs</h2>
          <div className="user-list">
            {users.map((user) => (
              <div key={user.id} className="user-row">
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-grid admin-bottom-grid">
        <article className="dashboard-card service-manager">
          <h2>Services</h2>
          <form className="service-form" onSubmit={handleAddService}>
            <label className="field-group">
              <span>Nom du service</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="field-group">
              <span>Durée</span>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </label>
            <label className="field-group">
              <span>Prix</span>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>
            <label className="field-group">
              <span>Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
            </label>
            <button className="button button-primary" type="submit">
              Ajouter le service
            </button>
          </form>
        </article>

        <article className="dashboard-card service-list-card">
          <h2>Liste des services</h2>
          {services.map((service) => (
            <div key={service.id} className="service-row">
              <div>
                <strong>{service.name}</strong>
                <p>{service.description}</p>
              </div>
              <span>{service.duration}</span>
              <span>{service.price}€</span>
            </div>
          ))}
        </article>
      </section>
    </main>
  )
}

export default Admin
