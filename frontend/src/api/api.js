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
export const registerUser = (data) => API.post("/auth/profile/", data);
export const userProfile = (data) => API.get("/auth/profile/", data);
export const bannerList = (data) => API.get("/banner/", data);

export const getCategories = () => API.get("/category/");

// Products
export const fetchProducts = () => API.get("/products/");

export const getProducts = (categoryId, filters = {}) => {
  // filters: { filter: "price" | "sold" | "newest" }
  let query = `category_id=${categoryId}`;

  if (filters.filter) {
    query += `&filter=${filters.filter}`;
  }

  if (filters.page) {
    query += `&page=${filters.page}`;
  }

  return API.get(`/product/?${query}`);
};

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



// B:: Cart amount
export const GetCartAmount = async (payload) => {
  // payload = [{product_id, quantity}, ...]
  return API.post("/cart/amount-calculate/", payload);
};


//B:: make order
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


//B:: biling address
export const postBillingInfoOrder = (id, data) => {
  const token = localStorage.getItem("access_token");
  return API.post(`/order/${id}/billing/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// ✅ GET order list
export const getOrder = () => {
  const token = localStorage.getItem("access_token");
  return API.get("/order/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// ✅ GET single order by ID
export const getOrderById = (id) => {
  const token = localStorage.getItem("access_token");
  return API.get(`/order/details/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// ✅ Cancel Order (PATCH)
export const cancelOrder = (id) => {
  const token = localStorage.getItem("access_token");
  return API.patch(
    `/order/${id}/`,
    { status: "cancelled" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};


// ✅ Activity Log API
export const getActivityLogs = (actionType, order_id) =>
  API.get("/activity/log/", {
    params: { action_type: actionType, order_id: order_id },
  });



// search box recommendation products  
export const GETsearchProducts = async (query) => {
  try {
    const response = await API.get("/product/home/", {
      params: { q: query },
    });

    // Assuming response.data is an array of products directly,
    // and you want to treat product names as suggestions too
    const products = response.data || [];

    // suggestions could be unique product names or categories or brands, up to you
    // For example, get unique product names for suggestions:
    const suggestions = [...new Set(products.map((p) => p.name))].map((name) => ({ name }));

    return {
      suggestions,
      products,
    };
  } catch (error) {
    return { suggestions: [], products: [] };
  }
};


// after search display products
export const GETsearchResultProducts = async (query) => {
  const response = await API.get(`/product/home/?q=${encodeURIComponent(query)}`);
  return response.data;
};


// recommendation products in product details page
export const GETrecomProducts = async (query) => {
  const response = await API.get(`/product/home/?q=${encodeURIComponent(query)}`);
  return response.data;
};


// Orders
export const fetchOrders = () => API.get("/order/");
export const createOrder = (data) => API.post("/orders/", data);

export default API;