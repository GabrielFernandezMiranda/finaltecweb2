import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials } from '../interfaces/auth';

interface FormErrors {
  username?: string;
  password?: string;
}

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname || '/dashboard';

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!credentials.username.trim()) {
      newErrors.username = 'El usuario es obligatorio';
    } else if (credentials.username.trim().length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!credentials.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (credentials.password.length < 5) {
      newErrors.password = 'La contraseña debe tener al menos 5 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    const result = await login(credentials);
    setSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión — SpaceNews</title>
        <meta
          name="description"
          content="Accede a tu cuenta de SpaceNews para gestionar noticias espaciales."
        />
      </Helmet>

      <section className="login-section">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <span className="login-icon" aria-hidden="true">🚀</span>
              <h1 className="login-title">Iniciar Sesión</h1>
              <p className="login-subtitle">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            {serverError && (
              <div className="alert alert--error" role="alert">
                {serverError}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-input ${errors.username ? 'form-input--error' : ''}`}
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="admin o user"
                  autoComplete="username"
                  autoFocus
                />
                {errors.username && (
                  <span className="form-error" role="alert">
                    {errors.username}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <span className="form-error" role="alert">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full"
                disabled={submitting}
              >
                {submitting ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <div className="login-footer">
              <p className="login-hint">
                <strong>Demo:</strong> admin / admin123 &bull; user / user123
              </p>
              <Link to="/" className="login-back">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
