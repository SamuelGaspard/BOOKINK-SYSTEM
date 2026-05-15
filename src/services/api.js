const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return window.localStorage.getItem('bookink_token')
}

function setToken(token) {
  window.localStorage.setItem('bookink_token', token)
}

function clearToken() {
  window.localStorage.removeItem('bookink_token')
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Erreur API')
  }
  return data
}

export const authApi = {
  async login(credentials) {
    const result = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    if (result.token) {
      setToken(result.token)
    }
    return result
  },
  async register(form) {
    const result = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
    })
    if (result.token) {
      setToken(result.token)
    }
    return result
  },
  async profile() {
    return request('/auth/profile')
  },
  async updateProfile(profile) {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    })
  },
  logout() {
    clearToken()
  },
}

export const servicesApi = {
  listServices() {
    return request('/services')
  },
  listBookings() {
    return request('/bookings')
  },
  createBooking(booking) {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    })
  },
  getAppointments() {
    return request('/appointments')
  },
  getUsers() {
    return request('/users')
  },
}
