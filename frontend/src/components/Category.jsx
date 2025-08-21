import React, { useEffect, useState } from "react";
import { getCategories } from "../api/api"; 
import "./style.css";


export default function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from backend
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
        <button key={cat.id}>{cat.name}</button>
      ))}
    </div>
  );
}
