import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice"
import cartReducer from "./features/CartSlice";
const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
    },
});

export default store;