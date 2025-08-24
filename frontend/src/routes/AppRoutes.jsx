import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import OrderBilling from "../pages/OrderBilling";
import Order from "../pages/OrderHistory";
import OrderDetails from "../pages/OrderDetails";
import SearchResult from "../pages/SearchResult";
import RecomPage from "../pages/RecomPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products/:id" element={<Products />} />
      <Route path="/products/details/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/recomm/products" element={<RecomPage />} />
      <Route path="orders" element={<Order />} />
      <Route path="order/details/:id" element={<OrderDetails />} />
      <Route path="order/details" element={<OrderDetails />} />
      <Route path="order/:id/billing" element={<OrderBilling />} />
      <Route path="/products/s" element={<SearchResult />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
