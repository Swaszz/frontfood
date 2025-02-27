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
            const newSubtotal = state.cart.cartItems.reduce(
                (acc, item) => acc + (item.price * item.quantity || 0), 0
            );
        
            console.log("New Subtotal Before Discount:", newSubtotal); 
        
          
            if (state.cart.appliedCoupon && state.cart.discountAmount !== undefined) {
                if (state.cart.discountType === "percentage") {
                    state.cart.totalAmount = parseFloat((newSubtotal * (1 - state.cart.discountAmount / 100)).toFixed(2));
                } else {
                    state.cart.totalAmount = Math.max(0, newSubtotal - state.cart.discountAmount);
                }
            } else {
                state.cart.totalAmount = newSubtotal;
            }
        
            console.log("Total Amount After Adding Item:", state.cart.totalAmount); 
        
            
            state.cart.appliedCoupon = state.cart.appliedCoupon || null;
            state.cart.discountType = state.cart.discountType || "percentage"; 
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
        
            state.cart.totalAmount = state.cart.cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
        },
        clearCart: (state) => {
            state.cart = { cartItems: [], totalAmount: 0, discountAmount: 0, appliedCoupon: null }; 
        },
        setCartDetails: (state, action) => {
            state.cart = { ...state.cart, ...action.payload };
        },
        applyCoupon: (state, action) => {
            console.log(" Backend Coupon Applied:", action.payload);

            state.cart.totalAmount = action.payload.totalAmount; 
            state.cart.appliedCoupon = action.payload.coupon;
            state.cart.discountAmount = action.payload.discountAmount;
            state.cart.discountType = action.payload.discountType;
        },
      
        proceedToCheckout: (state) => {
            state.cart = { cartItems: [], totalAmount: 0, appliedCoupon: null };
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.fulfilled, (state, action) => {
            console.log("🔹 FetchCart API Response:", action.payload);
        
            if (action.payload) {
                state.cartId = action.payload.cartId ?? null;  
                state.userId = action.payload.userId ?? null;
                state.cartItems = action.payload.cartItems ? [...action.payload.cartItems] : []; 
                state.totalAmount = action.payload.totalAmount ?? 0;
                state.appliedCoupon = action.payload.appliedCoupon ?? null;
        
                console.log(" Redux Cart Updated in Slice:", { ...state }); 
            } else {
                console.warn("Received invalid cart response, resetting state");
                state.cartItems = [];
                state.totalAmount = 0;
                state.appliedCoupon = null;
            }
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
