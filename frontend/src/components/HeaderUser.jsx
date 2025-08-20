import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userProfile } from "../api/api";

export default function HeaderUser() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return; // Not logged in

        const res = await userProfile({
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setUserData(null);
      }
    };

    fetchProfile();
  }, []);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    if (!userData) return navigate("/login"); // Go to login if not logged in
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserData(null);
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2"
        id="head_user"
        onClick={handleClick}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
          alt="User Icon"
          className="h-6 w-6"
        />
        <span>
          {userData
            ? `Hello${userData.name ? ` ${userData.name.split(" ")[0]}` : ""}`
            : "Hello, Sign in"}
        </span>
      </button>

      {userData && menuOpen && (
  <div
    className="absolute right-0 bg-white border rounded shadow-lg z-50"
    style={{
      marginTop: "75px",
      width: "320px",        // 2x width
      padding: "8px 0",      // vertical padding
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      borderRadius: "10px",
    }}
  >
    <div
      className="px-6 py-4 text-center font-medium mb-2"
      style={{ letterSpacing: "0.5px" }}
    >
      {userData.name || "User"}
    </div>
    {/* Black line under name */}
    <div className="w-full border-t border-black mt-10 mb-2"></div>

    <button
      onClick={handleLogout}
      className="w-full text-center px-6 py-4 font-semibold hover:bg-blue-100 hover:text-blue-500 transition-colors duration-200"
      style={{ letterSpacing: "0.5px" }}
    >
      Logout
    </button>
  </div>
)}



    </div>
  );
}
