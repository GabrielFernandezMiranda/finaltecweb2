import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Página no encontrada — SpaceNews</title>
        <meta
          name="description"
          content="La página que buscas no existe. Regresa al inicio de SpaceNews."
        />
      </Helmet>

      <section className="not-found">
        <div className="not-found-container">
          <span className="not-found-icon" aria-hidden="true">🌌</span>
          <h1 className="not-found-title">404</h1>
          <p className="not-found-subtitle">Página no encontrada</p>
          <p className="not-found-text">
            Parece que te has perdido en el espacio. La página que buscas no
            existe o ha sido movida.
          </p>
          <Link to="/" className="btn btn--primary">
            Volver al Inicio
          </Link>
        </div>
      </section>
    </>
  );
}

export default NotFound;
