import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Helmet>
        <title>SpaceNews — Noticias Espaciales</title>
        <meta
          name="description"
          content="SpaceNews es tu fuente de información sobre el espacio, la astronomía y la exploración espacial. Mantente al día con las últimas noticias."
        />
        <meta property="og:title" content="SpaceNews — Noticias Espaciales" />
        <meta
          property="og:description"
          content="Tu fuente de información sobre el espacio y la exploración espacial."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Explora el Universo
            <span className="hero-title-highlight"> de las Noticias</span>
          </h1>
          <p className="hero-subtitle">
            Mantente informado sobre los últimos acontecimientos en la
            exploración espacial, descubrimientos astronómicos y la industria
            aeroespacial.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn--primary btn--lg">
                Ir al Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn btn--primary btn--lg">
                Comenzar
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features" aria-label="Características">
        <div className="features-container">
          <h2 className="section-title">¿Por qué SpaceNews?</h2>
          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">🛸</div>
              <h3 className="feature-title">Información Actualizada</h3>
              <p className="feature-description">
                Accede a las noticias más recientes del espacio directamente
                desde la API de Spaceflight News.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">🔭</div>
              <h3 className="feature-title">Gestión de Contenido</h3>
              <p className="feature-description">
                Los administradores pueden crear, editar y eliminar noticias
                para mantener la información siempre relevante.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon" aria-hidden="true">🌌</div>
              <h3 className="feature-title">Acceso Personalizado</h3>
              <p className="feature-description">
                Roles de usuario y administrador con diferentes niveles de
                acceso y funcionalidades.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="cta-section" aria-label="Llamado a la acción">
        <div className="cta-container">
          <h2 className="cta-title">
            ¿Listo para explorar el cosmos?
          </h2>
          <p className="cta-text">
            Únete a SpaceNews y mantente al día con todo lo que sucede más
            allá de nuestra atmósfera.
          </p>
          {!isAuthenticated && (
            <Link to="/login" className="btn btn--primary btn--lg">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </section>
    </>
  );
}

export default Landing;
