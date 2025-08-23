import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts } from "../api/api";
import NavBar from "../components/NavBar"
import Category from "../components/Category"
import Footer from "../components/Footer";
import WelcomeNavBar from "../components/WelcomeNavBar";
import { FaBoxOpen } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import "./style.css";


export default function Products() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");


  useEffect(() => {
    fetchProducts(1);
  }, [id]);

  const fetchProducts = async (page = 1, appliedFilter = filter) => {
    try {
      setLoading(true);
      const res = await getProducts(id, { page, filter: appliedFilter });
      const response = res.data;
      setProducts(response.results);
      setCount(response.count);
      setCurrentPage(page);
      if (response.results.length > 0) setPageSize(response.results.length);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(count / pageSize);

  // pagination helper
  const getPageNumbers = () => {
    let pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, 5, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
    return pages;
  };

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, count);

  if (loading)
    return <h2 className="text-center text-xl mt-10">Loading...</h2>;

  // category name first product theke
  const categoryName = products.length > 0 ? products[0].category_name : "Products";

  return (
    <div>

      <WelcomeNavBar />
      <NavBar />
      <Category />





      <div className="flex justify-end items-center mt-4 mr-10 gap-2">
        <FaFilter className="text-gray-600" size={18} />
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            fetchProducts(1, e.target.value);
          }}
          className="border rounded px-3 py-1 text-gray-700"
        >
          <option value="">Select option...</option>
          <option value="price">Price: Low to High</option>
          <option value="newest">Newest</option>
          <option value="sold">Best Selling</option>
        </select>
      </div>



       <div className="products-wrapper">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 mt-10 text-center text-gray-800">
          {categoryName}
        </h1>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <FaBoxOpen size={40} className="mb-4" />
            <p className="text-lg font-medium">No products found.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((prod) => (
              <Link
                to={`/products/details/${prod.id}`}
                key={prod.id}
                className="product-card hover:shadow-lg transition-transform transform hover:scale-105"
              >
                {prod.thumbnail && (
                  <img
                    src={prod.thumbnail}
                    alt={prod.name}
                    className="product-img"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-1">{prod.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Brand: <span className="font-medium">{prod.brand}</span>
                  </p>
                  <p className="text-sm text-gray-700 mb-2">{prod.price}</p>
                  <span className="mt-3 text-blue-600 text-sm font-medium">
                    Category: {prod.category_name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col items-center mt-8 gap-3">
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchProducts(currentPage - 1)}
              className="page-btn"
            >
              Prev
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={idx} className="px-3 py-1">...</span>
              ) : (
                <button
                  key={idx}
                  onClick={() => fetchProducts(page)}
                  className={`page-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchProducts(currentPage + 1)}
              className="page-btn"
            >
              Next
            </button>
          </div>

          {/* Showing info */}
          {/* <p className="text-sm text-gray-600">
            Showing: {start} - {end} of {count} Products
          </p> */}

        </div>
      </div>


      <div className="h-40"></div>


      <Footer/>


    </div>
  );
}
