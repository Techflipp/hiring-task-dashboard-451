import axios from 'axios';

const api = axios.create({
    baseURL: 'https://task-451-api.ryd.wafaicloud.com',
});

export default api;
