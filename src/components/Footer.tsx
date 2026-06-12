function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            &copy; {currentYear} SpaceNews &mdash; Sistema de Noticias Espaciales
          </p>
          <p className="footer-text footer-text--small">
            Datos proporcionados por{' '}
            <a
              href="https://api.spaceflightnewsapi.net"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Spaceflight News API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
