import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('prithvigrid_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: handle token expiration
    }
    return Promise.reject(error);
  }
);

/* ─── Inquiries API ─── */
export interface InquiryPayload {
  from_name: string;
  from_email: string;
  project_type: string;
  message: string;
  phone?: string;
  location?: string;
  budget?: string;
}

export const inquiryAPI = {
  create: async (data: InquiryPayload) => {
    const res = await api.post('/inquiries', data);
    return res.data;
  },
  getAll: async (params?: { status?: string; search?: string }) => {
    const res = await api.get('/inquiries', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/inquiries/${id}`);
    return res.data;
  },
  updateStatus: async (id: string, data: { status?: string; notes?: string }) => {
    const res = await api.patch(`/inquiries/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/inquiries/${id}`);
    return res.data;
  },
};

/* ─── Projects API ─── */
export const projectAPI = {
  getAll: async (params?: { category?: string; search?: string }) => {
    const res = await api.get('/projects', { params });
    return res.data;
  },
  getById: async (id: string | number) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post('/projects', data);
    return res.data;
  },
  update: async (id: string | number, data: any) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },
  delete: async (id: string | number) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
};

/* ─── Blog API ─── */
export const blogAPI = {
  getAll: async (params?: { category?: string; featured?: boolean }) => {
    const res = await api.get('/blogs', { params });
    return res.data;
  },
  getById: async (id: string | number) => {
    const res = await api.get(`/blogs/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post('/blogs', data);
    return res.data;
  },
  update: async (id: string | number, data: any) => {
    const res = await api.put(`/blogs/${id}`, data);
    return res.data;
  },
  delete: async (id: string | number) => {
    const res = await api.delete(`/blogs/${id}`);
    return res.data;
  },
};

/* ─── Services API ─── */
export const serviceAPI = {
  getAll: async () => {
    const res = await api.get('/services');
    return res.data;
  },
  getById: async (id: string | number) => {
    const res = await api.get(`/services/${id}`);
    return res.data;
  },
};

/* ─── Testimonials API ─── */
export const testimonialAPI = {
  getAll: async () => {
    const res = await api.get('/testimonials');
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post('/testimonials', data);
    return res.data;
  },
};

/* ─── Cost Estimation API ─── */
export const estimateAPI = {
  calculate: async (payload: {
    builtUpArea: number;
    packageType: 'standard' | 'premium' | 'luxury';
    city?: string;
    floors?: number;
  }) => {
    const res = await api.post('/estimates/calculate', payload);
    return res.data;
  },
};

/* ─── Auth API ─── */
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('prithvigrid_token', res.data.token);
      localStorage.setItem('prithvigrid_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/auth/stats');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('prithvigrid_token');
    localStorage.removeItem('prithvigrid_user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('prithvigrid_token');
  },
  getUser: () => {
    const u = localStorage.getItem('prithvigrid_user');
    return u ? JSON.parse(u) : null;
  },
};

