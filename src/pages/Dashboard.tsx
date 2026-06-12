import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../services/newsService';
import NewsCard from '../components/NewsCard';
import NewsForm from '../components/NewsForm';
import type { Article, NewsFormData } from '../interfaces/news';

function Dashboard() {
  const { isAdmin } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const limit = 12;

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * limit;
      const data = await fetchArticles(limit, offset);
      setArticles(data.articles);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar noticias'
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = (data: NewsFormData) => {
    try {
      createArticle(data);
      showNotification('success', 'Noticia creada exitosamente');
      setShowForm(false);
      loadArticles();
    } catch {
      showNotification('error', 'Error al crear la noticia');
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleUpdate = (data: NewsFormData) => {
    if (!editingArticle) {
      return;
    }
    try {
      const result = updateArticle(editingArticle.id, data);
      if (result) {
        showNotification('success', 'Noticia actualizada exitosamente');
      } else {
        showNotification('error', 'No se encontró la noticia');
      }
      setShowForm(false);
      setEditingArticle(null);
      loadArticles();
    } catch {
      showNotification('error', 'Error al actualizar la noticia');
    }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta noticia?')) {
      return;
    }
    try {
      const result = deleteArticle(id);
      if (result) {
        showNotification('success', 'Noticia eliminada exitosamente');
      } else {
        showNotification('error', 'No se encontró la noticia');
      }
      loadArticles();
    } catch {
      showNotification('error', 'Error al eliminar la noticia');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <Helmet>
        <title>Dashboard — SpaceNews</title>
        <meta
          name="description"
          content="Panel de administración de noticias espaciales. Gestiona las noticias del espacio."
        />
      </Helmet>

      <section className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Noticias Espaciales</h1>
          {isAdmin && !showForm && (
            <button
              className="btn btn--primary"
              onClick={() => setShowForm(true)}
            >
              + Nueva Noticia
            </button>
          )}
        </div>

        {notification && (
          <div
            className={`alert alert--${notification.type}`}
            role="alert"
          >
            {notification.message}
          </div>
        )}

        {showForm && isAdmin && (
          <div className="dashboard-form-container">
            <NewsForm
              initialData={
                editingArticle
                  ? {
                      title: editingArticle.title,
                      summary: editingArticle.summary,
                      url: editingArticle.url,
                      image_url: editingArticle.image_url || '',
                      news_site: editingArticle.news_site,
                    }
                  : undefined
              }
              onSubmit={editingArticle ? handleUpdate : handleCreate}
              onCancel={handleCancelForm}
              isEditing={!!editingArticle}
            />
          </div>
        )}

        {loading && (
          <div className="loading" role="status">
            <div className="loading-spinner" aria-hidden="true"></div>
            <span className="loading-text">Cargando noticias...</span>
          </div>
        )}

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
            <button className="btn btn--small btn--secondary" onClick={loadArticles}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">🔭</span>
            <p className="empty-state-text">
              No hay noticias disponibles
            </p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            <div className="articles-grid" role="list">
              {articles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Paginación">
                <button
                  className="btn btn--secondary btn--small"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
                <span className="pagination-info">
                  Página {page} de {totalPages}
                </span>
                <button
                  className="btn btn--secondary btn--small"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default Dashboard;
