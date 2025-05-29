import { useAuthStore } from '@/store/auth.store';
import { useCostCenterStore } from '@/store/cost_center.store';
import axios from 'axios';

const API_URL = process.env.VUE_APP_ROOT_API;

export const axiosHelper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
};

function request(method) {
  return async (url, data, options = {}) => {
    const requestConfig = {
      url: url,
      method: method,
      baseURL: API_URL,
      ...options,
      headers: {
        ...authHeader(),
        ...(options.headers || {}),
      },
    };

    if (data) {
      requestConfig.headers['Content-Type'] = 'application/json';

      if (method === 'GET') {
        requestConfig.params = data;
      } else {
        requestConfig.data = JSON.stringify(data);
      }
    }

    return await axios(requestConfig)
      .then(res => handleResponse(res))
      .catch(err => handleError(err));
  };
}

function authHeader() {
  const authStore = useAuthStore();
  const costCenterStore = useCostCenterStore();
  let header = {};

  if (authStore.isLoggedIn) {
    header['Authorization'] = `Bearer ${authStore.token}`;

    if (costCenterStore.isCostCenterSelected) {
      header['X-Tenant-ID'] = costCenterStore.id;
    }
  }

  return header;
}

function handleResponse(res) {
  return res.data;
}

function handleError(err) {
  const { isLoggedIn, logout } = useAuthStore();
  const status = err.response.status;

  if ([401, 403].includes(status) && isLoggedIn) {
    logout();
  }

  return {
    error: true,
    message: err.response.data.message,
    data: err.response.data.data,
  };
}
