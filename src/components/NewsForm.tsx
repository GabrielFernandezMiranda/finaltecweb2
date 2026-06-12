import { useState, type FormEvent } from 'react';
import type { NewsFormData } from '../interfaces/news';

interface NewsFormProps {
  initialData?: NewsFormData;
  onSubmit: (data: NewsFormData) => void;
  onCancel: () => void;
  isEditing: boolean;
}

interface FormErrors {
  title?: string;
  summary?: string;
  url?: string;
  image_url?: string;
  news_site?: string;
}

const INITIAL_FORM: NewsFormData = {
  title: '',
  summary: '',
  url: '',
  image_url: '',
  news_site: '',
};

function validateForm(data: NewsFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = 'El título es obligatorio';
  } else if (data.title.trim().length < 5) {
    errors.title = 'El título debe tener al menos 5 caracteres';
  }

  if (!data.summary.trim()) {
    errors.summary = 'El resumen es obligatorio';
  } else if (data.summary.trim().length < 20) {
    errors.summary = 'El resumen debe tener al menos 20 caracteres';
  }

  if (!data.url.trim()) {
    errors.url = 'La URL es obligatoria';
  } else if (!/^https?:\/\/.+/.test(data.url.trim())) {
    errors.url = 'Ingrese una URL válida (http/https)';
  }

  if (!data.news_site.trim()) {
    errors.news_site = 'El sitio de noticias es obligatorio';
  } else if (data.news_site.trim().length < 2) {
    errors.news_site = 'El sitio debe tener al menos 2 caracteres';
  }

  if (data.image_url.trim() && !/^https?:\/\/.+/.test(data.image_url.trim())) {
    errors.image_url = 'Ingrese una URL válida (http/https)';
  }

  return errors;
}

function NewsForm({ initialData, onSubmit, onCancel, isEditing }: NewsFormProps) {
  const [formData, setFormData] = useState<NewsFormData>(
    initialData || INITIAL_FORM
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const updatedErrors = validateForm({ ...formData, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: updatedErrors[name as keyof FormErrors],
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const updatedErrors = validateForm(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: updatedErrors[name as keyof FormErrors],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setTouched({ title: true, summary: true, url: true, news_site: true, image_url: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="news-form" onSubmit={handleSubmit} noValidate>
      <h2 className="news-form-title">
        {isEditing ? 'Editar Noticia' : 'Crear Nueva Noticia'}
      </h2>

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Título *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className={`form-input ${errors.title && touched.title ? 'form-input--error' : ''}`}
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Título de la noticia"
          minLength={5}
          required
        />
        {errors.title && touched.title && (
          <span className="form-error" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="summary" className="form-label">
          Resumen *
        </label>
        <textarea
          id="summary"
          name="summary"
          className={`form-input form-textarea ${errors.summary && touched.summary ? 'form-input--error' : ''}`}
          value={formData.summary}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Resumen de la noticia"
          rows={4}
          minLength={20}
          required
        />
        {errors.summary && touched.summary && (
          <span className="form-error" role="alert">
            {errors.summary}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="url" className="form-label">
          URL *
        </label>
        <input
          type="url"
          id="url"
          name="url"
          className={`form-input ${errors.url && touched.url ? 'form-input--error' : ''}`}
          value={formData.url}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://ejemplo.com/noticia"
          required
        />
        {errors.url && touched.url && (
          <span className="form-error" role="alert">
            {errors.url}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="news_site" className="form-label">
          Sitio de Noticias *
        </label>
        <input
          type="text"
          id="news_site"
          name="news_site"
          className={`form-input ${errors.news_site && touched.news_site ? 'form-input--error' : ''}`}
          value={formData.news_site}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="NASA, SpaceX, etc."
          minLength={2}
          required
        />
        {errors.news_site && touched.news_site && (
          <span className="form-error" role="alert">
            {errors.news_site}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="image_url" className="form-label">
          URL de Imagen
        </label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          className={`form-input ${errors.image_url && touched.image_url ? 'form-input--error' : ''}`}
          value={formData.image_url}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {errors.image_url && touched.image_url && (
          <span className="form-error" role="alert">
            {errors.image_url}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary">
          {isEditing ? 'Guardar Cambios' : 'Crear Noticia'}
        </button>
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default NewsForm;
