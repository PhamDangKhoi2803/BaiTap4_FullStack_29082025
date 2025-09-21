import axios from './axios.customize';

const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  const data = { name, email, password };
  return axios.post(URL_API, data);
};

const updateUserApi = (userId, userData) => {
  const URL_API = `/v1/api/user/${userId}`;
  return axios.put(URL_API, userData);
};

const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  const data = { email, password };
  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = "/v1/api/user";
  return axios.get(URL_API);
};

// Các API mới cho sản phẩm
const createProductApi = (productData) => {
  const URL_API = "/v1/api/products";
  return axios.post(URL_API, productData);
};

const getAllProductsApi = (params = {}) => {
  const URL_API = "/v1/api/products";
  return axios.get(URL_API, { params });
};

const searchProductsApi = (params = {}) => {
  const URL_API = "/v1/api/products/search";
  return axios.get(URL_API, { params });
};

const getProductByIdApi = (id) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.get(URL_API);
};

const updateProductApi = (id, productData) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.put(URL_API, productData);
};

const deleteProductApi = (id) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.delete(URL_API);
};

export { 
  createUserApi, 
  loginApi, 
  getUserApi,
  createProductApi,
  getAllProductsApi,
  searchProductsApi,
  getProductByIdApi,
  updateProductApi,
  deleteProductApi,
  updateUserApi,
};