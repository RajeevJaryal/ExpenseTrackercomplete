import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthReducer";
import expensesReducer from "./expensesSlice";
import themeReducer from"./themeReducer";
const store=configureStore({
    reducer:{auth:authReducer,
        expenses:expensesReducer,
        theme:themeReducer,
    }
});

export default store;