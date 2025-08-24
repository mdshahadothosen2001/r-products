import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userProfile } from "../api/api";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";



export default function HeaderUser() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

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
    localStorage.removeItem("refresh_token");

    // if you are using context
    // setUser(null);

    navigate("/login", { replace: true }); // replace avoids back navigation
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
          className="absolute right-0 bg-white border rounded-xl shadow-lg z-50"
          style={{
            marginTop: "75px",
            width: "320px",
            padding: "12px 0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "10px",
          }}
        >
          <div className="px-6 py-4 text-center mb-2 flex flex-col items-center">
            {/* Profile Avatar */}
            {userData.picture ? (
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                alt={userData.name || "User"}
                className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-gray-200"
              />
            ) : (
              <FaUserCircle className="text-gray-400 w-16 h-16 mb-3" />
            )}

            {/* User Name */}
            <div className="text-lg font-semibold text-gray-800" style={{ letterSpacing: "0.5px" }}>
              {userData.name || "User"}
            </div>

            {/* Phone Number */}
            <div className="text-sm text-gray-500 mt-1" style={{ letterSpacing: "0.5px" }}>
              {userData.phone_number || ""}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-200 mt-2 mb-2"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-b-xl"
            style={{ letterSpacing: "0.5px" }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
      
      
      
    </div>
  );
}
