import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import cartReducer from "./features/CartSlice"
import deliveryReducer from "./features/DeliverySlice";
import orderReducer from "./features/OrderSlice";
import ownerReducer from "./features/OwnerSlice";
import adminReducer from "./features/AdminSlice";
import paymentReducer from "./features/PaymentSlice"
const store = configureStore({
    reducer: {
        user: userReducer,
        cart:cartReducer,
        delivery: deliveryReducer,
        order : orderReducer,
        owner:ownerReducer,
        admin: adminReducer,
        payment: paymentReducer,
    },
});

export default store;