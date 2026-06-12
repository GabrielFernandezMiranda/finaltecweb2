import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import galaxyLogo from '../assets/galaxy.svg';

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Navegación principal">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={galaxyLogo} alt="SpaceNews - Vía Láctea" className="navbar-logo" />
          <span className="navbar-title">SpaceNews</span>
        </Link>

        <button
          className="navbar-toggle"
          aria-label="Abrir menú de navegación"
          onClick={() => {
            const menu = document.getElementById('navbar-menu');
            if (menu) {
              menu.classList.toggle('navbar-menu--open');
            }
          }}
        >
          <span className="navbar-toggle-bar"></span>
          <span className="navbar-toggle-bar"></span>
          <span className="navbar-toggle-bar"></span>
        </button>

        <div className="navbar-menu" id="navbar-menu">
          <Link
            to="/"
            className={`navbar-link ${isActive('/') ? 'navbar-link--active' : ''}`}
          >
            Inicio
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`navbar-link ${isActive('/dashboard') ? 'navbar-link--active' : ''}`}
            >
              Dashboard
            </Link>
          )}

          <div className="navbar-auth">
            {isAuthenticated ? (
              <>
                <span className="navbar-user">
                  {user?.name}
                  {isAdmin && (
                    <span className="navbar-badge navbar-badge--admin">
                      Admin
                    </span>
                  )}
                  {!isAdmin && (
                    <span className="navbar-badge navbar-badge--user">
                      User
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="navbar-link navbar-link--btn"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`navbar-link ${isActive('/login') ? 'navbar-link--active' : ''}`}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
