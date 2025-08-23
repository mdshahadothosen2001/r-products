import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import productIcon from "../assets/icons/product-icon.png";


export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ phone_number: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await loginUser(form);

      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setUser({ phone_number: form.phone_number, access_token: access });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        
        {/* Optional Logo */}
        <a href="/">
          <div className="flex justify-center mb-6">
            <img src={productIcon} alt="Logo" className="w-16 h-16" />
          </div>
        </a>

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="phone_number"
            type="text"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <span>Don't have an account? </span>
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
