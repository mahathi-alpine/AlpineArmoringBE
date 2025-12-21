import axios from 'axios';

const PUSH_SERVER_URL = process.env.STRAPI_ADMIN_PUSH_SERVER_URL;
const PUSH_USERNAME = process.env.STRAPI_ADMIN_PUSH_SERVER_USERNAME;
const PUSH_PASSWORD = process.env.STRAPI_ADMIN_PUSH_SERVER_PASSWORD;

// Reason: Create axios instance with Basic Auth to avoid repeating auth logic in each request
const apiClient = axios.create({
  baseURL: PUSH_SERVER_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${PUSH_USERNAME}:${PUSH_PASSWORD}`)}`
  }
});

// Reason: Centralized error handling makes component code cleaner and more consistent
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      success: false,
      status,
      message: data?.message || `HTTP ${status} error`,
      data: null
    };
  }
  return {
    success: false,
    status: 0,
    message: error.message || 'Network error',
    data: null
  };
};

export const pushApiClient = {
  generateCustomerCode: async (name, email) => {
    try {
      const response = await apiClient.post('/api/admin/customers/generate', { name, email });
      return { success: true, status: 200, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getCustomers: async () => {
    try {
      const response = await apiClient.get('/api/admin/customers');
      return { success: true, status: 200, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  sendGlobalNotification: async (title, body, data) => {
    try {
      const payload = { title, body };
      if (data) {
        try {
          payload.data = JSON.parse(data);
        } catch (parseError) {
          return {
            success: false,
            status: 400,
            message: 'Invalid JSON in data field',
            data: null
          };
        }
      }
      const response = await apiClient.post('/api/admin/notifications/global', payload);
      return { success: true, status: 200, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  sendPersonalizedNotification: async (customerCode, title, body, data) => {
    try {
      const payload = { customerCode, title, body };
      if (data) {
        try {
          payload.data = JSON.parse(data);
        } catch (parseError) {
          return {
            success: false,
            status: 400,
            message: 'Invalid JSON in data field',
            data: null
          };
        }
      }
      const response = await apiClient.post('/api/admin/notifications/personalized', payload);
      return { success: true, status: 200, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default pushApiClient;
