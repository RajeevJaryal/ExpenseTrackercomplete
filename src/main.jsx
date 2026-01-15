import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./store/context/ExpenseContext";
import store from "./store/store";
import { Provider } from "react-redux";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <Provider store={store}>
    <ContextProvider>
    <App />
  </ContextProvider>
  </Provider>
  
  </BrowserRouter>
);
