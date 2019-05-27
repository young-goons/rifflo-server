import axios from 'axios';

import { BASE_URL } from './config';

const instance = axios.create({
    baseURL: BASE_URL,
});

instance.interceptors.request.use(config => {
    const accessToken = localStorage.getItem('accessToken');
    config.headers.Authorization =  accessToken ? `Bearer ${accessToken}` : '';
    return config;
});

export default instance;