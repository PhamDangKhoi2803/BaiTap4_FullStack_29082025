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

const getAllProductsWithOwnerApi = () => {
  const URL_API = "/v1/api/products_with_owner";
  return axios.get(URL_API);
};

const favoriteProductApi = (id) => axios.post(`/v1/api/products/${id}/favorite`);
const getFavoriteProductsApi = () => axios.get('/v1/api/favorites');
const viewProductApi = (id) => axios.post(`/v1/api/products/${id}/viewed`);
const buyProductApi = (id) => axios.post(`/v1/api/products/${id}/buy`);
const getSimilarProductsApi = (id) => axios.get(`/v1/api/products/${id}/similar`);
const getProductCommentsCountApi = (id) => axios.get(`/v1/api/products/${id}/comments/count`);

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
  getAllProductsWithOwnerApi,
  favoriteProductApi,
  viewProductApi,
  buyProductApi,
  getSimilarProductsApi,
  getProductCommentsCountApi,
  getFavoriteProductsApi
};