import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

export const fetchOrderSummary = createAsyncThunk(
  "order/fetchOrderSummary",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user } = getState(); 
      if (!user.userInfo?.id) throw new Error("User not authenticated");

      console.log("Fetching order summary for user:", user.userInfo.id);

      const response = await axiosInstance.get("/order/getorder", {
        params: { userId: user.userInfo.id },
      });

      return response.data.data;
    } catch (error) {
      console.error(
        " Error fetching order summary:",
        error.response?.data || error
      );
      return rejectWithValue(
        error.response?.data || "Error fetching order summary"
      );
    }
  }
);

export const fetchOrderHistory = createAsyncThunk(
  "order/fetchOrderHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/order/history");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching order history"
      );
    }
  }
);

const initialState = {
  order: {
    orderItems: [],
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
      state.order = action.payload || {
        orderItems: [],
        totalAmount: 0,
        discountAmount: 0,
        appliedCoupon: null,
        status: "Pending",
      };
    },
    addOrderItem: (state, action) => {
      if (!state.order.orderItems) state.order.orderItems = [];
      state.order.orderItems.push(action.payload);
    },
    setOrderDetails: (state, action) => {
      state.order = {
        ...state.order,
        ...action.payload,
      };

      if (!state.order.orderItems) state.order.orderItems = [];
      if (!state.order.deliveryAddress) state.order.deliveryAddress = {};
    },
    updateOrderStatus: (state, action) => {
      state.order.status = action.payload;
    },
    cancelOrder: (state) => {
      state.order = {
        orderItems: [],
        totalAmount: 0,
        appliedCoupon: null,
        status: "Cancelled",
      };
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
        state.order = action.payload;
      })
      .addCase(fetchOrderSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload; 
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setOrder,
  setOrderDetails,
  addOrderItem,
  updateOrderStatus,
  cancelOrder,
  setOrderHistory,
} = OrderSlice.actions;

export default OrderSlice.reducer;
