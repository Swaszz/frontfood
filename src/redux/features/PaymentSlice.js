import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

export const createPaymentSession = createAsyncThunk(
  "payment/createPaymentSession",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/payment/create-checkout-session", paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Payment failed");
    }
  }
);

const initialState = {
  paymentSession: null,
  loading: false,
  error: null,
};

const PaymentSlice= createSlice({
  name: "payment",
  initialState,
  reducers: {
    setError: (state, action) => {
      
      state.error = action.payload?.message || "An error occurred";
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentSession.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSession = action.payload;
      })
      .addCase(createPaymentSession.rejected, (state, action) => {
        state.loading = false;
     
        state.error = action.payload || "Failed to create payment session";
      });
  },
});

export const { setError, clearError } = PaymentSlice.actions;
export default PaymentSlice.reducer;