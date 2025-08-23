import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function OrderTrack() {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim() !== "") {
      navigate(`/order/details/${trackingId}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h2 className="text-2xl font-bold text-gray-800">
        Track Your Consignment
      </h2>
      <p className="text-gray-500 mb-6">
        Now you can easily track your consignment
      </p>

      {/* ✅ Search Box */}
      <form
        onSubmit={handleSearch}
        className="flex items-center border rounded-lg overflow-hidden shadow-sm"
      >
        <div className="flex items-center px-3 text-gray-400">
          <FiSearch />
        </div>
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Search Tracking Code here..."
          className="flex-1 px-3 py-3 outline-none text-gray-700"
        />
        <button
          type="submit"
          className="bg-teal-500 text-white flex items-center px-5 py-3 hover:bg-teal-600 transition-colors"
        >
          <FiSearch className="mr-2" />
          Search
        </button>
      </form>
    </div>
  );
}
