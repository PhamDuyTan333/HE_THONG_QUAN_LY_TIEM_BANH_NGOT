// services/productApi.js
import { API_BASE_URL } from '../config/api';

class ProductAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get all products
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return this.request(endpoint);
  }

  // Get product by ID
  async getById(id) {
    return this.request(`/products/${id}`);
  }

  // Get product by slug
  async getBySlug(slug) {
    return this.request(`/products/slug/${slug}`);
  }

  // Create product
  async create(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Update product
  async update(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  // Delete product
  async delete(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Get featured products
  async getFeatured(limit = 8) {
    return this.request(`/products/featured?limit=${limit}`);
  }

  // Get bestseller products
  async getBestsellers(limit = 8) {
    return this.request(`/products/bestsellers?limit=${limit}`);
  }

  // Search products
  async search(query, filters = {}) {
    const params = new URLSearchParams({
      search: query,
      ...filters
    });

    return this.request(`/products?${params.toString()}`);
  }

  // Update stock
  async updateStock(id, quantity, type = 'set') {
    return this.request(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity, type }),
    });
  }

  // Get product statistics
  async getStatistics() {
    return this.request('/products/stats');
  }
}

// Create and export instance
const productAPI = new ProductAPI();
export default productAPI;
