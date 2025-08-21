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

export const getCategories = () => API.get("/category/");

// Products
export const fetchProducts = () => API.get("/products/");

// based category
export const getProducts = (categoryId) =>
  API.get(`/product/?category_id=${categoryId}`);

export const getProductById = (id) => API.get(`/product/${id}/`);


// Home page's products arrows
export const GETtopRatedProducts = () => API.get("/product/home/?list_type=top_rated");
export const GETrecentProducts = () => API.get("/product/home/?list_type=recent_selling");
export const GETbestSellingProducts = () => API.get("/product/home/?list_type=best_selling");
export const GETarrivalProducts = () => API.get("/product/home/?list_type=new_arrival");
export const GETtopBrandProducts = () => API.get("/product/home/?list_type=top_brand");

export const GETnewlyProducts = () => API.get("/product/home/?list_type=new");
export const GETtrendProducts = () => API.get("/product/home/?list_type=trend");
export const GETfeaturedProducts = () => API.get("/product/home/?list_type=featured");
export const GETfreeDeliveryProducts = () => API.get("/product/home/?list_type=free_delivery");
export const GETrecentlyViewProducts = () => API.get("/product/home/?list_type=recently_view");
export const GETjustYouProducts = () => API.get("/product/home/?list_type=just_you");


// Cart
export const fetchCart = () => API.get("/cart/");
export const addToCart = (data) => API.post("/cart/add/", data);
export const removeFromCart = (id) => API.delete(`/cart/${id}/`);
export const updateCartQuantity = (id, quantity) =>
  API.patch(`/cart/${id}/`, { quantity });


export const GetCartAmount = async (payload) => {
  // payload = [{product_id, quantity}, ...]
  return API.post("/cart/amount-calculate/", payload);
};

export const postOrder = (items) => {
  const token = localStorage.getItem("access_token");
  return API.post(
    "/order/",
    { items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// Orders
export const fetchOrders = () => API.get("/orders/");
export const createOrder = (data) => API.post("/orders/", data);
export const cancelOrder = (id) => API.patch(`/orders/${id}/cancel/`);

export default API;
