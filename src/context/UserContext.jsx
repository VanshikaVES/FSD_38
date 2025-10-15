import React, { createContext, useState } from "react";

// Create Context
export const UserContext = createContext();

// Provider Component
export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "Demo User",
    email: "demo@example.com",
    loggedIn: true,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
