// services/customerApi.js
import { API_BASE_URL } from '../config/api';

class CustomerAPI {
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

  // Customer registration
  async register(customerData) {
    return this.request('/customers/register', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  // Customer login
  async login(credentials) {
    return this.request('/customers/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Get customer profile
  async getProfile(customerId) {
    return this.request(`/customers/${customerId}`);
  }

  // Update customer profile
  async updateProfile(customerId, updateData) {
    return this.request(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Change password
  async changePassword(customerId, passwordData) {
    return this.request(`/customers/${customerId}/change-password`, {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }
}

// Create and export instance
const customerAPI = new CustomerAPI();
export default customerAPI;
