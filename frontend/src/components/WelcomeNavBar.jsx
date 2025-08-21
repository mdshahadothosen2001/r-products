import { FaShoppingCart, FaChartLine, FaBoxOpen } from "react-icons/fa";

export default function WelcomeNavBar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Welcome</h2>
      <div className="flex items-center gap-6">
        <a href="/orders/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
          <FaBoxOpen /> Order Track
        </a>
        <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
          <FaChartLine /> Recommender
        </a>
        <a href="/cart/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
          <FaShoppingCart /> Cart
        </a>
      </div>
    </div>
  );
}
