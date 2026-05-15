import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Client from './pages/Client.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function RequireAuth({ children, requiredRole }) {
  const auth = useAuth()
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (requiredRole && auth.user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }
  return children
}

function AppRouter() {
  const auth = useAuth()

  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="top-nav">
          <div className="logo">Bookink</div>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Accueil
            </NavLink>
            {auth.isAuthenticated && auth.user.role !== 'admin' && (
              <NavLink to="/client" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Client
              </NavLink>
            )}
            {auth.isAuthenticated && auth.user.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Admin
              </NavLink>
            )}
            {auth.isAuthenticated ? (
              <>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Mon compte
                </NavLink>
                <button type="button" className="button button-secondary nav-button" onClick={auth.logout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Connexion
              </NavLink>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/client"
            element={
              <RequireAuth>
                <Client />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth requiredRole="admin">
                <Admin />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
