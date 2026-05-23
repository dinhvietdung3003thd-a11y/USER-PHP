import { appConfig } from '../config/appConfig';
import type { ApiCategory } from '../types/category.types';
import type { ProductCategory } from '../types/product.types';
import { buildApiErrorMessage, isNetworkError } from './apiError';

const resolveApiUrl = (path: string) => `${appConfig.apiBaseUrl}${path}`;

const mapCategory = (category: ApiCategory): ProductCategory => ({
  id: String(category.categoryId),
  name: category.name,
  description: category.description ?? ''
});

export const categoryService = {
  async fetchCategories(): Promise<ProductCategory[]> {
    try {
      const response = await fetch(resolveApiUrl('/api/Categories'));

      if (!response.ok) {
        throw new Error(await buildApiErrorMessage(response, 'Failed to load categories.'));
      }

      const data = (await response.json()) as ApiCategory[];
      return data.map(mapCategory);
    } catch (error) {
      if (isNetworkError(error)) {
        throw new Error('Cannot connect to server. Please try again later.');
      }

      throw error;
    }
  }
};
