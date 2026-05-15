import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const initialUsers = [
  {
    id: 1,
    name: 'Admin Bookink',
    email: 'admin@bookink.local',
    password: 'admin123',
    role: 'admin',
    bookings: [],
  },
  {
    id: 2,
    name: 'Client Bookink',
    email: 'client@bookink.local',
    password: 'client123',
    role: 'client',
    bookings: [],
  },
]

function loadAuthState() {
  if (typeof window === 'undefined') return { user: null, users: initialUsers }
  try {
    const saved = JSON.parse(window.localStorage.getItem('bookink-auth'))
    if (!saved || typeof saved !== 'object') return { user: null, users: initialUsers }
    return {
      user: saved.user ?? null,
      users: Array.isArray(saved.users) && saved.users.length ? saved.users : initialUsers,
    }
  } catch {
    return { user: null, users: initialUsers }
  }
}

export function AuthProvider({ children }) {
  const [{ user: initialUser, users: initialStoredUsers }] = useState(loadAuthState)
  const [user, setUser] = useState(initialUser)
  const [users, setUsers] = useState(initialStoredUsers)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('bookink-auth', JSON.stringify({ user, users }))
  }, [user, users])

  const login = ({ email, password }) => {
    const foundUser = users.find((item) => item.email === email && item.password === password)
    if (!foundUser) {
      return { success: false, error: 'Email ou mot de passe invalide.' }
    }
    setUser(foundUser)
    return { success: true }
  }

  const register = ({ name, email, password }) => {
    if (users.some((item) => item.email === email)) {
      return { success: false, error: 'Cet email est déjà utilisé.' }
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'client',
      bookings: [],
    }
    setUsers((previous) => [...previous, newUser])
    setUser(newUser)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = ({ name }) => {
    if (!user) return
    const updatedUser = { ...user, name }
    setUser(updatedUser)
    setUsers((previous) => previous.map((item) => (item.id === updatedUser.id ? updatedUser : item)))
  }

  const addBooking = (booking) => {
    if (!user) return false
    const bookingWithId = { ...booking, id: Date.now() }
    const updatedUser = {
      ...user,
      bookings: [...(user.bookings || []), bookingWithId],
    }
    setUser(updatedUser)
    setUsers((previous) => previous.map((item) => (item.id === updatedUser.id ? updatedUser : item)))
    return true
  }

  const value = useMemo(
    () => ({
      user,
      users,
      login,
      logout,
      register,
      updateProfile,
      addBooking,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
    }),
    [user, users],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
