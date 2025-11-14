import axios from 'axios';

const apiClient = axios.create({
    // fixed protocol typo and ensure correct base path
    baseURL: "http://127.0.0.1:8000/api",
});

export default apiClient;