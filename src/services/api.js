const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAuthToken = () => {
  return localStorage.getItem('vendor_token') || localStorage.getItem('token') || '';
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('vendor_token', token);
  } else {
    localStorage.removeItem('vendor_token');
  }
};

export const getStoredVendor = () => {
  try {
    const raw = localStorage.getItem('vendor_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredVendor = (user) => {
  if (user) {
    localStorage.setItem('vendor_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('vendor_user');
  }
};

export const clearAuth = () => {
  localStorage.removeItem('vendor_token');
  localStorage.removeItem('vendor_user');
};

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.message || data.error || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// Vendor Auth Services
export const authService = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (vendorData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...vendorData, role: 'vendor' }),
    });
  },
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Vendor Products Services
export const productService = {
  getMyProducts: async () => {
    return apiRequest('/products/vendor/my-products');
  },
  getProductById: async (id) => {
    return apiRequest(`/products/${id}`);
  },
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },
  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },
  updateStock: async (id, stock) => {
    return apiRequest(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock: Number(stock) }),
    });
  },
  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories Service
export const categoryService = {
  getAll: async () => {
    return apiRequest('/categories');
  },
};

// Vendor Orders Services
export const orderService = {
  getMyOrders: async () => {
    return apiRequest('/orders/vendor/my-orders');
  },
  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/orders/vendor/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
