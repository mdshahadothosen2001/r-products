import React, { useEffect, useState } from "react";
import { getCategories } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div id="categories-container">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => navigate(`/products/${cat.id}`)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
