import axios from 'axios';

const api = axios.create({
  baseURL: `http://localhost:${process.env.NEXT_PUBLIC_BASE_URL || 3001}`,
});

export const useRequests = () => ({
  setToken: (token: string) => {
    api.defaults.headers.common.Authorization = token;
  },

  requestData: async (endpoint: string, token: string) => {
    const { data } = await api.get(
      endpoint,
      {
        headers: {
          'authorization': token,
        },
      },
    );
    return data;
  },

  requestToken: async (endpoint: string, token: string) => {
    const { data } = await api.post(
      endpoint,
      {},
      {
        headers: {
          'Authorization': token,
        },
      },
    );
    return data;
  },

  requestLogin: async (endpoint: string, body: {}) => {
    const { data } = await api.post(endpoint, body);
    return data;
  },

  requestRegisterUser: async (endpoint: string, body: {}) => {
    const { data } = await api.post(endpoint, body);
    return data;
  },
});
