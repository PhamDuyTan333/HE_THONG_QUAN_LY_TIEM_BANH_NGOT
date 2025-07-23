// services/categoryApi.js
import { API_BASE_URL } from '../config/api';

class CategoryAPI {
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

  // Get all categories
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/categories?${queryString}` : '/categories';
    
    return this.request(endpoint);
  }

  // Get category by ID
  async getById(id) {
    return this.request(`/categories/${id}`);
  }

  // Get category by slug
  async getBySlug(slug) {
    return this.request(`/categories/slug/${slug}`);
  }

  // Create category
  async create(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Update category
  async update(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  // Delete category
  async delete(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Get featured categories
  async getFeatured(limit = 8) {
    return this.request(`/categories/featured?limit=${limit}`);
  }

  // Get parent categories
  async getParents() {
    return this.request('/categories/parents');
  }

  // Get children categories
  async getChildren(parentId) {
    return this.request(`/categories/${parentId}/children`);
  }

  // Search categories
  async search(query, filters = {}) {
    const params = new URLSearchParams({
      search: query,
      ...filters
    });

    return this.request(`/categories?${params.toString()}`);
  }
}

// Create and export instance
const categoryAPI = new CategoryAPI();
export default categoryAPI;
