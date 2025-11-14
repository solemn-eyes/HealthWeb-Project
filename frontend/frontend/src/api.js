import axios from 'axios';

const apiClient = axios.create({
    // fixed protocol typo and ensure correct base path
    baseURL: "http://127.0.0.1:8000/api",
});

// Interceptors to attach bearer token to requests
apiClient.attachAuth = (token) => {
    if (token) apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete apiClient.defaults.headers.common['Authorization'];
};

// Token refresh handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    })
    failedQueue = [];
}

apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // If no response or not 401, reject immediately
        if (!error.response || error.response.status !== 401) return Promise.reject(error);

        // Avoid infinite loop
        if (originalRequest._retry) return Promise.reject(error);
        originalRequest._retry = true;

        const stored = localStorage.getItem('authTokens');
        const tokens = stored ? JSON.parse(stored) : null;
        const refreshToken = tokens?.refresh;

        if (!refreshToken) {
            // No refresh token -> logout client by clearing auth header
            delete apiClient.defaults.headers.common['Authorization'];
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return apiClient(originalRequest);
            }).catch(err => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            const resp = await apiClient.post('/auth/token/refresh/', { refresh: refreshToken });
            const newTokens = resp.data;
            // Update storage and default header
            localStorage.setItem('authTokens', JSON.stringify(newTokens));
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newTokens.access}`;
            processQueue(null, newTokens.access);
            isRefreshing = false;
            originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
            return apiClient(originalRequest);
        } catch (err) {
            processQueue(err, null);
            isRefreshing = false;
            // remove tokens if refresh failed
            localStorage.removeItem('authTokens');
            delete apiClient.defaults.headers.common['Authorization'];
            return Promise.reject(err);
        }
    }
);

export default apiClient;