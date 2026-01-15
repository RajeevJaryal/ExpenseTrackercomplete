import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthReducer";
import expensesReducer from "./expensesSlice"
const store=configureStore({
    reducer:{auth:authReducer,
        expenses:expensesReducer,
    }
});

export default store;