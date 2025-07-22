// config/api.js
// API configuration for different environments

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Base URLs
const API_URLS = {
  development: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  production: import.meta.env.VITE_API_URL_PRODUCTION || 'https://your-backend-domain.vercel.app/api'
};

// Get current API URL based on environment
export const API_BASE_URL = isProduction ? API_URLS.production : API_URLS.development;

// Supabase configuration (if needed for client-side operations)
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
};

// App configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Tiệm Bánh Ngọt',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'Hệ thống quản lý tiệm bánh ngọt'
};

// Upload configuration
export const UPLOAD_CONFIG = {
  maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB
  allowedTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Pagination configuration
export const PAGINATION_CONFIG = {
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 10,
  maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 100
};

// Feature flags
export const FEATURES = {
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  pwa: import.meta.env.VITE_ENABLE_PWA === 'true',
  notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false' // default true
};

// Development configuration
export const DEV_CONFIG = {
  devMode: import.meta.env.VITE_DEV_MODE === 'true',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true'
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile'
  },
  
  // Accounts (Admin/Staff)
  accounts: {
    list: '/accounts',
    create: '/accounts',
    update: '/accounts',
    delete: '/accounts',
    profile: '/accounts/profile'
  },
  
  // Customers
  customers: {
    list: '/customers',
    create: '/customers',
    update: '/customers',
    delete: '/customers',
    profile: '/customers/profile'
  },
  
  // Products
  products: {
    list: '/products',
    create: '/products',
    update: '/products',
    delete: '/products',
    search: '/products/search',
    featured: '/products/featured',
    bestsellers: '/products/bestsellers'
  },
  
  // Categories
  categories: {
    list: '/categories',
    create: '/categories',
    update: '/categories',
    delete: '/categories'
  },
  
  // Orders
  orders: {
    list: '/orders',
    create: '/orders',
    update: '/orders',
    delete: '/orders',
    items: '/orders/items',
    history: '/orders/history'
  },
  
  // Coupons
  coupons: {
    list: '/coupons',
    create: '/coupons',
    update: '/coupons',
    delete: '/coupons',
    validate: '/coupons/validate'
  },
  
  // Messages
  messages: {
    list: '/messages',
    create: '/messages',
    update: '/messages',
    delete: '/messages',
    reply: '/messages/reply'
  },
  
  // Website Settings
  settings: {
    list: '/settings',
    update: '/settings',
    public: '/settings/public'
  },
  
  // File Upload
  upload: {
    image: '/upload/image',
    file: '/upload/file'
  },
  
  // Reports
  reports: {
    dashboard: '/reports/dashboard',
    sales: '/reports/sales',
    products: '/reports/products',
    customers: '/reports/customers'
  }
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to build API URL with parameters
export const buildApiUrlWithParams = (endpoint, params = {}) => {
  const url = new URL(buildApiUrl(endpoint));
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

console.log('API Configuration:', {
  environment: isProduction ? 'production' : 'development',
  apiBaseUrl: API_BASE_URL,
  features: FEATURES
});
