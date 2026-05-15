import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/client'

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(auth.user.role === 'admin' ? '/admin' : '/client', { replace: true })
    }
  }, [auth.isAuthenticated])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (mode === 'login') {
      const result = await auth.login({ email, password })
      if (result.success) {
        navigate(from, { replace: true })
      } else {
        setError(result.error)
      }
      return
    }

    const result = await auth.register({ name, email, password })
    if (result.success) {
      navigate('/client', { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <main className="page auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">{mode === 'login' ? 'Connexion' : 'Inscription'}</p>
          <h1>{mode === 'login' ? 'Accédez à votre espace Bookink' : 'Créez votre compte client'}</h1>
          <p>Utilisez votre email pour vous connecter ou créer un compte rapidement.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className="field-group">
              <span>Nom complet</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" required />
            </label>
          )}

          <label className="field-group">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@exemple.com" required />
          </label>

          <label className="field-group">
            <span>Mot de passe</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="button button-primary auth-button" type="submit">
            {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              Pas encore de compte ?{' '}
              <button type="button" className="link-button" onClick={() => setMode('register')}>
                Inscrivez-vous
              </button>
            </p>
          ) : (
            <p>
              Déjà client ?{' '}
              <button type="button" className="link-button" onClick={() => setMode('login')}>
                Connectez-vous
              </button>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default Login
