import axios from 'axios';
import { create } from 'lodash';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/v1/users/me',
    login: '/api/v1/users/login',
    register: '/api/v1/users/signup',
  },
  post: {
    list: '/api/v1/posts',
    my: '/api/v1/posts/my-posts',
    details: '/api/v1/posts',
    comment: '/api/v1/comments',
  },
  user: {
    update: '/api/v1/users/updateMe',
  },
};
