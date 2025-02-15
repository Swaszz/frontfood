import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import cartReducer from "../redux/features/CartSlice"
import deliveryReducer from "./features/DeliverySlice";
import orderReducer from "../redux/features/OrderSlice";
import ownerReducer from "../redux/features/OwnerSlice";
import adminReducer from "../redux/features/AdminSlice"
const store = configureStore({
    reducer: {
        user: userReducer,
        cart:cartReducer,
        delivery: deliveryReducer,
        order : orderReducer,
        owner:ownerReducer,
        admin: adminReducer,
    },
});

export default store;