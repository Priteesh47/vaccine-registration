import React from "react";
import { createContext } from "react";
import { vaccines } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const value = {
    vaccines,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
