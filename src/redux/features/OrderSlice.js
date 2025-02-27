import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";


export const fetchOrderSummary = createAsyncThunk(
  "order/fetchOrderSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/getorder");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching order summary");
    }
  }
);
export const fetchlatestOrder = createAsyncThunk(
  "order/fetchlatestOrder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/latest");

      if (!response.data || !response.data.cartId) {
        console.warn("⚠️ Warning: cartId is missing in the response!");
      }

      return {
        ...response.data,
        cartId: response.data.cartId || null  // ✅ Ensure `cartId` is stored
      };

    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching latest order");
    }
  }
);
export const fetchOrderHistory = createAsyncThunk(
  "order/fetchOrderHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/history", {
        withCredentials: true, 
      });

      console.log("Fetched Order History API Response:", response.data);
      
      if (Array.isArray(response.data)) {
        return response.data; 
      } else if (Array.isArray(response.data.data)) {
        return response.data.data; 
      } else {
        return rejectWithValue("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching order history:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Error fetching order history");
    }
  }
);


const initialState = {
  order: {
    cartId: "", 
    userId: "", 
    orderItems: [],
    deliveryAddress: null, 
    restaurant: null,
    totalAmount: 0,
    discountAmount: 0,
    appliedCoupon: null,
    status: "Pending",
  },
  orderHistory: [],
  loading: false,
  error: null,
};


const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      console.log("🔹 Updating Redux Order State:", action.payload);
  
      state.order = { 
          ...state.order, 
          userId: action.payload.userId || state.order.userId || localStorage.getItem("userId"),  // ✅ Ensure userId is always present
          cartId: action.payload.cartId || state.order.cartId || "",
          orderItems: action.payload.orderItems?.length > 0 ? action.payload.orderItems : state.order.orderItems, 
          totalAmount: action.payload.totalAmount ?? state.order.totalAmount,  
          discountAmount: action.payload.discountAmount ?? state.order.discountAmount,  
          appliedCoupon: action.payload.appliedCoupon ?? state.order.appliedCoupon,
          deliveryAddress: action.payload.deliveryAddress ?? state.order.deliveryAddress,
      };
  
      console.log("✅ Redux Order State Updated:", state.order);
  },
    applyOrderCoupon: (state, action) => {
      state.order.appliedCoupon = action.payload.coupon;
      state.order.discountAmount = action.payload.discountAmount;
      state.order.totalAmount = action.payload.totalAmount;

      if (Array.isArray(action.payload.orderItems) && action.payload.orderItems.length > 0) {
        state.order.orderItems = action.payload.orderItems;
      }
    },

    clearOrder: (state) => {
      state.order = {
        ...state.order, 
        orderItems: [],
        totalAmount: 0,
        discountAmount: 0,
        appliedCoupon: null,
        status: "Pending",
      };
    },

    updateOrderStatus: (state, action) => {
      state.order.status = action.payload;
    },

    setOrderHistory: (state, action) => {
      state.orderHistory = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderSummary.fulfilled, (state, action) => {
        state.loading = false;
    
        state.order = { 
            ...state.order, 
            ...action.payload, 
            userId: action.payload.userId || state.order.userId || localStorage.getItem("userId"),  // ✅ Ensure userId stays
            cartId: action.payload.cartId
        }; 
    })
      .addCase(fetchOrderSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.orderHistory = action.payload;
      });
  },
});


export const { setOrder, applyOrderCoupon, clearOrder, updateOrderStatus, setOrderHistory } = OrderSlice.actions;
export default OrderSlice.reducer;