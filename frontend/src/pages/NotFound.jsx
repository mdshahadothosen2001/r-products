import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import WelcomeNavBar from "../components/WelcomeNavBar";
import FAQ from "../components/FAQ";

export default function NotFound() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
        <FaExclamationTriangle size={60} className="text-yellow-500 mb-6 animate-bounce" />
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! The page you are looking for does not exist.</p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Go Back Home
        </Link>
      </div>

    </div>
  );
}
