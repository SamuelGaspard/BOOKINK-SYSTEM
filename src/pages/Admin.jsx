import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { servicesApi } from '../services/api.js'
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'

function Admin() {
  const [services, setServices] = useState([])
  const [appointments, setAppointments] = useState([])
  const [view, setView] = useState('dayGridMonth')
  const [name, setName] = useState('')
  const [duration, setDuration] = useState('45 min')
  const [price, setPrice] = useState(45)
  const [description, setDescription] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let canceled = false
    servicesApi.listServices().then((result) => {
      if (!canceled) setServices(result.services)
    })
    servicesApi.getAppointments().then((result) => {
      if (!canceled) setAppointments(result.appointments)
    })
    return () => {
      canceled = true
    }
  }, [])

  const calendarEvents = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment.id,
        title: appointment.title,
        start: appointment.date,
      })),
    [appointments],
  )

  const handleAddService = async (event) => {
    event.preventDefault()
    setFeedback('')
    if (!name || !duration || !price) {
      setFeedback('Tous les champs requis doivent être remplis.')
      return
    }

    try {
      const response = await servicesApi.createService({ name, duration, price, description })
      setServices((current) => [...current, response.service])
      setName('')
      setDuration('45 min')
      setPrice(45)
      setDescription('')
      setFeedback('Service ajouté avec succès.')
    } catch (error) {
      setFeedback(error.message)
    }
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
          <div className="view-controls">
            <button className="button button-secondary" type="button" onClick={() => setView('dayGridMonth')}>
              Mois
            </button>
            <button className="button button-secondary" type="button" onClick={() => setView('timeGridWeek')}>
              Semaine
            </button>
            <button className="button button-secondary" type="button" onClick={() => setView('timeGridDay')}>
              Jour
            </button>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false}
            events={calendarEvents}
            height={520}
            selectable
            selectMirror
            dayMaxEvents
          />
        </article>

        <article className="dashboard-card stats-card">
          <h2>Services</h2>
          <p>Liste des services disponibles et ajout de nouvelles prestations.</p>
          <div className="service-list-card">
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
          </div>
        </article>
      </section>

      <section className="dashboard-grid admin-bottom-grid">
        <article className="dashboard-card service-manager">
          <h2>Ajouter un service</h2>
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
            {feedback && <div className="form-success">{feedback}</div>}
          </form>
        </article>
      </section>
    </main>
  )
}

export default Admin
