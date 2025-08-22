import { useEffect, useRef, useState } from "react";
import { GETsearchProducts } from "../api/api";
import SearchModal from "./SearchModal";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  const inputRef = useRef(null);

  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        !document.getElementById("search-modal")?.contains(e.target)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API call for suggestions & products
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setProducts([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const data = await GETsearchProducts(query);
        setSuggestions(data?.suggestions || []);
        setProducts(data?.products || []);
      } catch (_) {}
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // Save to localStorage recent searches
 const handleSearch = (text) => {
    if (!text) return;

    const updated = [text, ...recentSearches.filter((s) => s !== text)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate to search result page
    navigate(`/products/s?q=${encodeURIComponent(text)}`);
  };


  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowModal(true);
  };

  const handleSelect = (text) => {
    setQuery(text);
    setShowModal(false);
    handleSearch(text);
  };

  return (
    <div className="relative w-full" ref={inputRef}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowModal(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(query);
            setShowModal(false);
          }
        }}
        placeholder="Search by Product | Category | Brand..."
        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
      />

      {showModal && (
        <div id="search-modal">
          <SearchModal
            query={query}
            recentSearches={recentSearches}
            suggestions={suggestions}
            products={products}
            onSelect={handleSelect}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}
    </div>
  );
}
