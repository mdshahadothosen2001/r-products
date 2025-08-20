import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user info from localStorage on app load
    const access = localStorage.getItem("access_token");
    const phone_number = localStorage.getItem("phone_number");
    return access ? { phone_number, access_token: access } : null;
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
