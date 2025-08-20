import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
      <h2 className="font-bold text-lg">{product.name}</h2>
      <p className="text-gray-700">${product.price}</p>
    </div>
  );
}
