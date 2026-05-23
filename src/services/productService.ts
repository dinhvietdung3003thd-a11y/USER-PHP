import { appConfig } from '../config/appConfig';
import type { ProductCatalog, ProductCategory, ProductItem } from '../types/product.types';
import { buildApiErrorMessage, isNetworkError } from './apiError';

interface ApiProduct {
  productId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: number;
  description: string | null;
  categoryName: string | null;
}

const resolveApiUrl = (path: string) => `${appConfig.apiBaseUrl}${path}`;
const placeholderImage = '/placeholder-product.png';

const normalizeImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return placeholderImage;
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${appConfig.apiBaseUrl}${normalizedPath}`;
};

const mapApiProduct = (product: ApiProduct): ProductItem => ({
  id: String(product.productId),
  categoryId: String(product.categoryId),
  categoryName: product.categoryName ?? '',
  name: product.name,
  description: product.description ?? '',
  price: product.price,
  currency: 'VND',
  imageUrl: normalizeImageUrl(product.imageUrl),
  isAvailable: product.isAvailable
});

export const productService = {
  async fetchProducts(): Promise<ProductItem[]> {
    try {
      const response = await fetch(resolveApiUrl('/api/Product'));

      if (!response.ok) {
        throw new Error(await buildApiErrorMessage(response, 'Failed to load products.'));
      }

      const data = (await response.json()) as ApiProduct[];
      return data.map(mapApiProduct);
    } catch (error) {
      if (isNetworkError(error)) {
        throw new Error('Cannot connect to server. Please try again later.');
      }

      throw error;
    }
  },

  async fetchProductById(id: string): Promise<ProductItem | null> {
    try {
      const response = await fetch(resolveApiUrl(`/api/Product/${id}`));

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(await buildApiErrorMessage(response, 'Failed to load product detail.'));
      }

      const data = (await response.json()) as ApiProduct;
      return mapApiProduct(data);
    } catch (error) {
      if (isNetworkError(error)) {
        throw new Error('Cannot connect to server. Please try again later.');
      }

      throw error;
    }
  },

  async searchProductsElastic(keyword: string): Promise<ProductItem[]> {
    try {
      const response = await fetch(
        resolveApiUrl(`/api/Product/search-elastic?keyword=${encodeURIComponent(keyword)}`)
      );

      if (!response.ok) {
        throw new Error(await buildApiErrorMessage(response, 'Failed to search products.'));
      }

      const data = (await response.json()) as ApiProduct[];
      return data.map(mapApiProduct);
    } catch (error) {
      if (isNetworkError(error)) {
        throw new Error('Cannot connect to server. Please try again later.');
      }

      throw error;
    }
  },

  buildCatalog(categories: ProductCategory[], products: ProductItem[]): ProductCatalog {
    return { categories, products };
  },

  getProductsByCategory(categoryId: string, products: ProductItem[]): ProductItem[] {
    return products.filter((product) => product.categoryId === categoryId);
  }
};
