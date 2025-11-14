import React, { useEffect, useState, useRef } from "react";
import { getCategories, getSubcategories } from "../api/api";
import { useNavigate } from "react-router-dom";
import "./components.css";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [openSubFor, setOpenSubFor] = useState(null);
  const [subcategoriesMap, setSubcategoriesMap] = useState({});
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

  // Keep dropdown open while moving between category and dropdown by
  // setting open state immediately and using a small close-delay.
  const closeTimer = useRef(null);

  const handleMouseEnter = (catId) => {
    // cancel any pending close
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    // open immediately so the user can move into the dropdown
    setOpenSubFor(catId);

    // fetch subcategories in background if not already loaded
    if (!subcategoriesMap[catId]) {
      getSubcategories(catId)
        .then((res) => setSubcategoriesMap((m) => ({ ...m, [catId]: res.data })))
        .catch((err) => {
          console.error("Error fetching subcategories", err);
          setSubcategoriesMap((m) => ({ ...m, [catId]: [] }));
        });
    }
  };

  const handleMouseLeave = () => {
    // close after short delay to allow moving to dropdown
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpenSubFor(null);
      closeTimer.current = null;
    }, 180);
  };

  return (
    <div className="category-section">
      <div className="categories-wrap">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="category-with-sub"
          onMouseEnter={() => handleMouseEnter(cat.id)}
          onMouseLeave={() => handleMouseLeave()}
        >
          <button
            onClick={() => navigate(`/products/${cat.id}`)}
            className="category-btn"
          >
            {cat.name}
          </button>

          {openSubFor === cat.id && (subcategoriesMap[cat.id] || []).length > 0 && (
            <div className="subcategory-dropdown drawer">
              {(subcategoriesMap[cat.id] || []).map((sub) => (
                <div
                  key={sub.id}
                  className="sub-item"
                  onClick={() => navigate(`/products/${cat.id}?subcategory_id=${sub.id}`)}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
