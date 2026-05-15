import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { servicesApi } from '../services/api.js'

const staffList = ['Alice', 'Bruno', 'Carla']

function Client() {
  const auth = useAuth()
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let canceled = false
    servicesApi
      .listServices()
      .then((result) => {
        if (!canceled) setServices(result.services)
      })
      .catch(() => {})
      .finally(() => {
        if (!canceled) setLoading(false)
      })
    return () => {
      canceled = true
    }
  }, [])

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        if (selectedService && service.id.toString() !== selectedService) return false
        if (selectedStaff && !service.staff?.includes(selectedStaff)) return false
        return true
      }),
    [selectedService, selectedStaff, services],
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

  const handleBooking = async (service) => {
    setFeedback('')
    if (!selectedDate || !selectedStaff) {
      setFeedback('Choisissez un créneau et un prestataire avant de réserver.')
      return
    }

    try {
      await servicesApi.createBooking({
        serviceId: service.id,
        staff: selectedStaff,
        date: selectedDate,
      })
      await auth.refreshProfile()
      setFeedback(`Réservation pour ${service.name} confirmée le ${selectedDate}.`)
      setSelectedDate('')
    } catch (error) {
      setFeedback(error.message)
    }
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
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
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
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </label>
          </form>

          {feedback && <div className="form-success">{feedback}</div>}

          {loading ? (
            <p>Chargement des services...</p>
          ) : (
            <div className="service-results">
              {filteredServices.map((service) => (
                <div key={service.id} className="service-card">
                  <div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="service-meta">
                    <span>{service.duration}</span>
                    <span>{service.price}€</span>
                    <button className="button button-primary" type="button" onClick={() => handleBooking(service)}>
                      Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
