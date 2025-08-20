import axios from "axios";
import { data } from "react-router-dom";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Your DRF backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth
export const loginUser = (data) => API.post("/auth/token/", data);
export const registerUser = (data) => API.post("/auth/register/", data);
export const userProfile = (data) => API.get("/auth/profile/", data);
export const bannerList = (data) => API.get("/banner/", data);

// Products
export const fetchProducts = () => API.get("/products/");
export const fetchProductById = (id) => API.get(`/products/${id}/`);

// Cart
export const fetchCart = () => API.get("/cart/");
export const addToCart = (data) => API.post("/cart/add/", data);
export const removeFromCart = (id) => API.delete(`/cart/${id}/`);
export const updateCartQuantity = (id, quantity) =>
  API.patch(`/cart/${id}/`, { quantity });

// Orders
export const fetchOrders = () => API.get("/orders/");
export const createOrder = (data) => API.post("/orders/", data);
export const cancelOrder = (id) => API.patch(`/orders/${id}/cancel/`);

export default API;
