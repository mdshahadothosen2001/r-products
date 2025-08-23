import React, { useState } from "react";
import { registerUser } from "../api/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import productIcon from "../assets/icons/product-icon.png";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_number: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await registerUser(formData);

      if (response && response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User registered successfully!",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Something went wrong!",
      });
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

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <span>Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
