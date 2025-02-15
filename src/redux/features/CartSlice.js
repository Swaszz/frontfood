import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/cart/getcart");
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching cart");
    }
});

const initialState = {
    cart: { cartItems: [], totalAmount: 0, discountAmount:0,appliedCoupon: null },
    loading: false,
    error: null,
};

export const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload || { cartItems: [], totalAmount: 0, discountAmount:0, appliedCoupon: null };
        },
        addItemToCart: (state, action) => {
            if (!state.cart.cartItems) state.cart.cartItems = []; 
            const newItem = action.payload;
            const existingItem = state.cart.cartItems.find(item => item._id === newItem._id);
            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.cart.cartItems.push(newItem);
            }
        },
        updateItemQuantity: (state, action) => {
            if (!state.cart.cartItems) state.cart.cartItems = []; 
            const { menuItemId, quantity } = action.payload;
            const item = state.cart.cartItems.find(item => item._id === menuItemId);
            if (item) {
                item.quantity = quantity;
            }
        },
        removeItemFromCart: (state, action) => {
            if (!state.cart.cartItems) state.cart.cartItems = []; 
            state.cart.cartItems = state.cart.cartItems.filter(item => item._id !== action.payload);
        },
        clearCart: (state) => {
            state.cart = { cartItems: [], totalAmount: 0, discountAmount: 0, appliedCoupon: null }; 
        },
        setCartDetails: (state, action) => {
            state.cart = { ...state.cart, ...action.payload };
        },
        applyCoupon: (state, action) => {
            if (!state.cart) state.cart = { cartItems: [], totalAmount: 0 };
        
         
            state.cart.coupon = action.payload.coupon;
            state.cart.discountAmount = action.payload.discountAmount;
            state.cart.totalAmount = action.payload.totalAmount;
        
           
            if (action.payload.cartItems && action.payload.cartItems.length > 0) {
                state.cart.cartItems = action.payload.cartItems;
            } else {
                console.warn("Warning: API response did not include cartItems. Keeping existing cart items.");
            }
        },
        
        proceedToCheckout: (state) => {
            state.cart = { cartItems: [], totalAmount: 0, appliedCoupon: null };
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                console.log("Cart Fetched in Redux:", action.payload);
                state.cart = action.payload; 
            })
            .addCase(fetchCart.rejected, (state, action) => {
                console.error("Error fetching cart:", action.payload);
                state.error = action.payload;
            });
    }
});

export const {
    setCart,
    setCartDetails,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    applyCoupon,
    proceedToCheckout,
} = CartSlice.actions;

export default CartSlice.reducer;
