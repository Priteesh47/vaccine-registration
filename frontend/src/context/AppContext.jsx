import React, { createContext, useState } from 'react';
import { vaccines, Centers } from '../assets/assets';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    vaccines,
    Centers
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
