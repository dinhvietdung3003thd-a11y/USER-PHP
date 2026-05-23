interface ErrorPayload {
  message?: string;
  error?: string;
  title?: string;
}

const getErrorMessage = async (response: Response, fallback: string): Promise<string> => {
  try {
    const data = (await response.json()) as ErrorPayload;
    return data.message || data.error || data.title || fallback;
  } catch {
    return fallback;
  }
};

export const buildApiErrorMessage = async (response: Response, fallback: string): Promise<string> => {
  if (response.status === 401) {
    return 'Your session has expired. Please login again.';
  }

  if (response.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (response.status === 400) {
    return getErrorMessage(response, fallback);
  }

  return getErrorMessage(response, fallback);
};

export const isNetworkError = (error: unknown): boolean => error instanceof TypeError;
