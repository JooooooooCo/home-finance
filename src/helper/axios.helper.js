import { useAuthStore } from "@/store/auth.store";
import { useCostCenterStore } from "@/store/cost_center.store";

export const axiosHelper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
};

function request(method) {
  return async (url, body) => {
    const requestOptions = {
      method,
      headers: authHeader(url),
    };
    if (body) {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }
    return fetch(url, requestOptions).then(handleResponse);
  };
}

function authHeader(url) {
  const authStore = useAuthStore();
  const costCenterStore = useCostCenterStore();
  const isApiUrl = url.startsWith(process.env.VUE_APP_ROOT_API);

  if (
    authStore.isLoggedIn &&
    costCenterStore.isCostCenterSelected &&
    isApiUrl
  ) {
    return {
      Authorization: `Bearer ${authStore.token}`,
      CostCenter: costCenterStore.cost_center,
    };
  } else if (authStore.isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${authStore.token}` };
  } else {
    return {};
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const { user, logout } = useAuthStore();
      if ([401, 403].includes(response.status) && user) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
