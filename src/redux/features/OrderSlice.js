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

export const fetchOrderHistory = createAsyncThunk(
  "order/fetchOrderHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/history");
      
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


const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
   
    setOrder: (state, action) => {
      console.log("🔹 Updating Order State in Redux:", action.payload);
      
      state.order = { 
        ...state.order, 
        orderItems: action.payload.orderItems ?? state.order.orderItems, 
        totalAmount: action.payload.totalAmount ?? state.order.totalAmount,
        discountAmount: action.payload.discountAmount ?? state.order.discountAmount,
        appliedCoupon: action.payload.appliedCoupon ?? state.order.appliedCoupon,
        deliveryAddress: action.payload.deliveryAddress ?? state.order.deliveryAddress,
      };
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
        state.order = { ...state.order, ...action.payload }; 
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


export const { setOrder, applyOrderCoupon, clearOrder, updateOrderStatus, setOrderHistory } = orderSlice.actions;
export default orderSlice.reducer;