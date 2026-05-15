import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = window?.localStorage?.getItem('bookink_token')
    if (!token) {
      setLoading(false)
      return
    }

    authApi
      .profile()
      .then((response) => {
        setUser({ ...response.user, bookings: response.bookings })
      })
      .catch(() => {
        authApi.logout()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async ({ email, password }) => {
    try {
      await authApi.login({ email, password })
      const response = await authApi.profile()
      setUser({ ...response.user, bookings: response.bookings })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async ({ name, email, password }) => {
    try {
      const response = await authApi.register({ name, email, password })
      setUser({ ...response.user, bookings: [] })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
  }

  const updateProfile = async ({ name }) => {
    try {
      const response = await authApi.updateProfile({ name })
      setUser((current) => ({ ...response.user, bookings: current?.bookings ?? [] }))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const refreshProfile = async () => {
    try {
      const response = await authApi.profile()
      setUser({ ...response.user, bookings: response.bookings })
      return { success: true }
    } catch (error) {
      authApi.logout()
      setUser(null)
      return { success: false, error: error.message }
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      register,
      updateProfile,
      refreshProfile,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
