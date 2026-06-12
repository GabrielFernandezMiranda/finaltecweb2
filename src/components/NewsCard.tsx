import type { Article } from '../interfaces/news';

interface NewsCardProps {
  article: Article;
  isAdmin: boolean;
  onEdit?: (article: Article) => void;
  onDelete?: (id: number) => void;
}

function NewsCard({ article, isAdmin, onEdit, onDelete }: NewsCardProps) {
  const formattedDate = new Date(article.published_at).toLocaleDateString(
    'es-ES',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <article className="news-card">
      <div className="news-card-image-container">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={`Imagen ilustrativa de: ${article.title}`}
            className="news-card-image"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '';
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.classList.add('news-card-image-placeholder');
              }
            }}
          />
        ) : (
          <div className="news-card-image-placeholder">
            <span aria-hidden="true">🚀</span>
          </div>
        )}
      </div>

      <div className="news-card-body">
        <div className="news-card-meta">
          <span className="news-card-site">{article.news_site}</span>
          <time className="news-card-date" dateTime={article.published_at}>
            {formattedDate}
          </time>
        </div>

        <h3 className="news-card-title">{article.title}</h3>
        <p className="news-card-summary">{article.summary}</p>

        <div className="news-card-actions">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--small"
          >
            Leer más
          </a>

          {isAdmin && (
            <div className="news-card-admin-actions">
              <button
                className="btn btn--warning btn--small"
                onClick={() => onEdit?.(article)}
                aria-label={`Editar noticia: ${article.title}`}
              >
                Editar
              </button>
              <button
                className="btn btn--danger btn--small"
                onClick={() => onDelete?.(article.id)}
                aria-label={`Eliminar noticia: ${article.title}`}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default NewsCard;
