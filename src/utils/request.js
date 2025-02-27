import axios from "axios";

let timeout = 60000 * 3;
let baseURL = BASE_API_URL;

const service = axios.create({
  baseURL,
  timeout,
  headers: {
    // access_token: `${localStorage.getItem('token')}`,

  },
  withCredentials: true, // 跨域时需要��带cookie
});

let requestHeaders;
service.interceptors.request.use(
  (config) => {
    requestHeaders = config.headers;
    if (config.method === "get" && config.params == null) {
      config.params = config.data;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (Number(res.code) !== 0) {
      // 接口错误
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  (error) => {
    // 服务错误
    console.log(error.message);
    return Promise.reject(error);
  }
);

export default service;
