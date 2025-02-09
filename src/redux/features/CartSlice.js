import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartId: null,
    cartItems: [],
    totalAmount: 0,
    totalQuantity: 0,
  },
  reducers: {
    setCart: (state, action) => { 
      state.cartId = action.payload.cartId || null;
      state.cartItems = (action.payload.cartItems || []).map(item => ({
        _id: item._id || item.menuItemId, 
        menuItemId: item.menuItemId || item._id, 
        name: item.name || "Unknown Item",
        image: item.image || "/placeholder.jpg",
        price: item.price || 0,
        quantity: item.quantity || 1,
      }));
    
      state.totalAmount = action.payload.totalAmount || 0;
      state.totalQuantity = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    },
    setCartDetails: (state, action) => {
      if (!action.payload || !action.payload.cartId) {
        console.error(" cartId is missing from API response!", action.payload);
        return;
      }
      state.cartId = action.payload.cartId; 
      state.cartItems = action.payload.cartItems || [];
      state.totalQuantity = action.payload.totalQuantity || 0;
      state.totalAmount = action.payload.totalAmount || 0;
    },
    
      addToCart: (state, action) => {  
        const item = action.payload;
        const existingItem = state.cartItems.find(cartItem => cartItem._id === item._id);
  
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.cartItems.push({ ...item, quantity: 1 });
        }
        state.totalQuantity = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
        state.totalAmount = state.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
      },
    

      updateQuantity: (state, action) => {
        const { _id, quantity } = action.payload;
        const existingItem = state.cartItems.find(cartItem => cartItem._id === _id);
      
        if (existingItem) {
        
          state.cartItems = state.cartItems.map(item =>
            item._id === _id ? { ...item, quantity } : item
          );
        } else {
          console.error("Item not found in Redux store:", _id, "Cart Items:", state.cartItems);
        }
      
        state.totalQuantity = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
        state.totalAmount = state.cartItems.reduce((acc, item) => acc + (item.quantity * item.price || 0), 0);
      },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(cartItem => cartItem._id !== action.payload);
    state.totalQuantity = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    state.totalAmount = state.cartItems.reduce((acc, item) => acc + (item.quantity * item.price || 0), 0);
  },

    clearCart: (state) => {
      state.cartId = null;
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const { setCartDetails, addToCart, updateQuantity, removeFromCart, clearCart,setCart } = cartSlice.actions;
export default cartSlice.reducer;
