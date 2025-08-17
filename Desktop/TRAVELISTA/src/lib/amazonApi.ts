import axios from 'axios';

interface AmazonProductDetails {
  asin: string;
  country: string;
}

// Update with your RapidAPI key
const RAPID_API_KEY = '10b75fb9f6mshf347a303be3d6bfp13ab14jsn3f61fc0fbfe1';
const RAPID_API_HOST = 'real-time-amazon-data.p.rapidapi.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://real-time-amazon-data.p.rapidapi.com',
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': RAPID_API_HOST
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your internet connection.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('API key is invalid or expired. Please update your API key.');
    }
    throw error;
  }
);

// Category ID mapping
export const categoryIds = {
  'electronics': '281407',
  'books': '283155',
  'fashion': '7141123011',
  'home': '284507',
  'beauty': '3760911',
  'toys': '165793011',
  'sports': '3375251',
  'grocery': '16310101',
  'automotive': '15684181',
  'garden': '2972638011',
  'health': '3760901',
  'music': '301668'
};

export const getProductsByCategory = async ({ categoryId, page = '1', country = 'US' }) => {
  try {
    const response = await api.get('/products-by-category', {
      params: {
        category_id: categoryId,
        page,
        country,
        sort_by: 'RELEVANCE',
        product_condition: 'ALL',
        is_prime: 'false',
        deals_and_discounts: 'NONE'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const getProductDetails = async ({ asin, country }: AmazonProductDetails) => {
  try {
    const response = await api.get('/product-offers', {
      params: {
        asin,
        country,
        limit: '100',
        page: '1'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const searchProducts = async ({ query, page = '1', country = 'US' }) => {
  try {
    const response = await api.get('/search', {
      params: {
        query,
        page,
        country,
        sort_by: 'RELEVANCE',
        product_condition: 'ALL',
        is_prime: 'false',
        deals_and_discounts: 'NONE'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}; 