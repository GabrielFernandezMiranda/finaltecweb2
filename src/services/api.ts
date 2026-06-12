const BASE_URL = 'https://api.spaceflightnewsapi.net/v4';

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new ApiError(
      `Error al obtener datos: ${response.statusText}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

export { fetchFromApi, ApiError, BASE_URL };
