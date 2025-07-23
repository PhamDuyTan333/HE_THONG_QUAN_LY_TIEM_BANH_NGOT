// services/orderApi.js
import { API_BASE_URL } from '../config/api';

class OrderAPI {
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

  // Get all orders
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    return this.request(endpoint);
  }

  // Get order by ID
  async getById(id) {
    return this.request(`/orders/${id}`);
  }

  // Create order
  async create(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Update order
  async update(id, orderData) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  // Delete order
  async delete(id) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Update order status
  async updateStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Update payment status
  async updatePaymentStatus(id, payment_status) {
    return this.request(`/orders/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_status }),
    });
  }

  // Get customer orders
  async getCustomerOrders(customerId, filters = {}) {
    const params = new URLSearchParams(filters);
    const queryString = params.toString();
    const endpoint = queryString 
      ? `/orders/customer/${customerId}?${queryString}` 
      : `/orders/customer/${customerId}`;
    
    return this.request(endpoint);
  }

  // Get order statistics
  async getStatistics() {
    return this.request('/orders/stats');
  }

  // Search orders
  async search(query, filters = {}) {
    const params = new URLSearchParams({
      search: query,
      ...filters
    });

    return this.request(`/orders?${params.toString()}`);
  }
}

// Create and export instance
const orderAPI = new OrderAPI();
export default orderAPI;
