import React, { createContext, useReducer, useContext, useEffect } from "react";
import { initialState, reducer } from "./reducer";

const StateContext = createContext();

const StateProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const getInitialState = () => {
    const savedUser = localStorage.getItem("bookShopCurrentUser");
    if (savedUser) {
      return {
        ...initialState,
        currentUser: JSON.parse(savedUser),
      };
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(reducer, getInitialState());

  // Update localStorage when state changes
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem("bookShopCurrentUser", JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem("bookShopCurrentUser");
    }
  }, [state.currentUser]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

const useStateProvider = () => useContext(StateContext);

export { StateProvider, useStateProvider };
