import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const initialServices = [
  {
    id: 1,
    name: 'Consultation bien-être',
    duration: '45 min',
    price: '45€',
    staff: ['Alice', 'Bruno'],
    description: 'Entretien personnalisé pour définir votre programme de soin.',
  },
  {
    id: 2,
    name: 'Massage relaxant',
    duration: '60 min',
    price: '65€',
    staff: ['Carla', 'Alice'],
    description: 'Massage détente pour évacuer le stress et améliorer le confort.',
  },
  {
    id: 3,
    name: 'Coaching personnel',
    duration: '30 min',
    price: '35€',
    staff: ['Bruno'],
    description: 'Accompagnement expert pour organiser votre planning santé.',
  },
]

const staffList = ['Alice', 'Bruno', 'Carla']

function Client() {
  const auth = useAuth()
  const [selectedService, setSelectedService] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [feedback, setFeedback] = useState('')

  const filteredServices = useMemo(
    () =>
      initialServices.filter((service) => {
        if (selectedService && service.name !== selectedService) return false
        if (selectedStaff && !service.staff.includes(selectedStaff)) return false
        return true
      }),
    [selectedService, selectedStaff],
  )

  const upcomingBookings = useMemo(
    () =>
      (auth.user?.bookings || [])
        .filter((booking) => new Date(booking.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [auth.user],
  )

  const bookingHistory = useMemo(
    () =>
      (auth.user?.bookings || [])
        .filter((booking) => new Date(booking.date) < new Date())
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [auth.user],
  )

  const handleBooking = (service) => {
    if (!selectedDate || !selectedStaff) {
      setFeedback('Choisissez un créneau et un membre du personnel pour réserver.')
      return
    }

    auth.addBooking({
      service: service.name,
      staff: selectedStaff,
      date: selectedDate,
      status: 'Confirmé',
    })
    setFeedback(`Réservation pour ${service.name} confirmée le ${selectedDate}.`)
    setSelectedDate('')
  }

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
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <label className="field-group">
              <span>Service</span>
              <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                <option value="">Tous les services</option>
                {initialServices.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Prestataire</span>
              <select value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
                <option value="">Tous les prestataires</option>
                {staffList.map((staff) => (
                  <option key={staff} value={staff}>
                    {staff}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Créneau</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
              />
            </label>
          </form>

          {feedback && <div className="form-success">{feedback}</div>}

          <div className="service-results">
            {filteredServices.map((service) => (
              <div key={service.id} className="service-card">
                <div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
                <div className="service-meta">
                  <span>{service.duration}</span>
                  <span>{service.price}</span>
                  <button className="button button-primary" type="button" onClick={() => handleBooking(service)}>
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card">
          <h2>Rendez-vous à venir</h2>
          {upcomingBookings.length ? (
            upcomingBookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <strong>{booking.service}</strong>
                <span>{booking.staff}</span>
                <span>{booking.date}</span>
              </div>
            ))
          ) : (
            <p>Aucun rendez-vous enregistré pour l’instant.</p>
          )}
        </article>

        <article className="dashboard-card">
          <h2>Historique</h2>
          {bookingHistory.length ? (
            bookingHistory.map((booking) => (
              <div key={booking.id} className="booking-item">
                <strong>{booking.service}</strong>
                <span>{booking.staff}</span>
                <span>{booking.date}</span>
              </div>
            ))
          ) : (
            <p>Aucune réservation passée pour le moment.</p>
          )}
        </article>
      </section>
    </main>
  )
}

export default Client
