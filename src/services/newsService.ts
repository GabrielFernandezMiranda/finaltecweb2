import { fetchFromApi } from './api';
import type { Article, ApiResponse, NewsFormData } from '../interfaces/news';

const LOCAL_KEY = 'spacenews_articles';
const LOCAL_ID_KEY = 'spacenews_next_id';

function getLocalArticles(): Article[] {
  const stored = localStorage.getItem(LOCAL_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Article[];
    } catch {
      localStorage.removeItem(LOCAL_KEY);
    }
  }
  return [];
}

function setLocalArticles(articles: Article[]): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(articles));
}

function getNextId(): number {
  const stored = localStorage.getItem(LOCAL_ID_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as number;
    } catch {
      localStorage.removeItem(LOCAL_ID_KEY);
    }
  }
  return 100000;
}

function setNextId(id: number): void {
  localStorage.setItem(LOCAL_ID_KEY, JSON.stringify(id));
}

async function fetchArticles(
  limit = 12,
  offset = 0
): Promise<{ articles: Article[]; totalCount: number }> {
  const localArticles = getLocalArticles();

  const data = await fetchFromApi<ApiResponse>(
    `/articles?limit=${limit}&offset=${offset}`
  );

  const mergedArticles = mergeArticles(data.results, localArticles);

  return {
    articles: mergedArticles,
    totalCount: Math.max(data.count, localArticles.length),
  };
}

function mergeArticles(apiArticles: Article[], localArticles: Article[]): Article[] {
  const localMap = new Map<number, Article>();
  for (const article of localArticles) {
    localMap.set(article.id, article);
  }

  const merged = apiArticles.map((article) => {
    return localMap.get(article.id) || article;
  });

  const localOnly = localArticles.filter(
    (article) => !apiArticles.some((a) => a.id === article.id)
  );

  return [...localOnly, ...merged];
}

function createArticle(data: NewsFormData): Article {
  const localArticles = getLocalArticles();
  const nextId = getNextId();

  const newArticle: Article = {
    id: nextId,
    title: data.title,
    summary: data.summary,
    url: data.url,
    image_url: data.image_url || null,
    news_site: data.news_site,
    featured: false,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localArticles.push(newArticle);
  setLocalArticles(localArticles);
  setNextId(nextId + 1);

  return newArticle;
}

function updateArticle(id: number, data: Partial<NewsFormData>): Article | null {
  const localArticles = getLocalArticles();
  const index = localArticles.findIndex((a) => a.id === id);

  if (index === -1) {
    return null;
  }

  const updated: Article = {
    ...localArticles[index],
    ...(data.title !== undefined && { title: data.title }),
    ...(data.summary !== undefined && { summary: data.summary }),
    ...(data.url !== undefined && { url: data.url }),
    ...(data.image_url !== undefined && { image_url: data.image_url || null }),
    ...(data.news_site !== undefined && { news_site: data.news_site }),
    updated_at: new Date().toISOString(),
  };

  localArticles[index] = updated;
  setLocalArticles(localArticles);

  return updated;
}

function deleteArticle(id: number): boolean {
  const localArticles = getLocalArticles();
  const filtered = localArticles.filter((a) => a.id !== id);

  if (filtered.length === localArticles.length) {
    return false;
  }

  setLocalArticles(filtered);
  return true;
}

function getArticleById(id: number): Article | null {
  const localArticles = getLocalArticles();
  const localArticle = localArticles.find((a) => a.id === id);
  return localArticle || null;
}

export {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleById,
};
