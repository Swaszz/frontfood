import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";



 const fetchAddresses = createAsyncThunk(
  "delivery/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/delivery/getdelivery");
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching addresses");
    }
  }
);


 const addAddress = createAsyncThunk(
  "delivery/addAddress",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/delivery/adddelivery", form);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error adding address");
    }
  }
);


 const updateAddress = createAsyncThunk(
  "delivery/updateAddress",
  async ({ addressId, form }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/delivery/updatedelivery", {
        addressId,
        ...form,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error updating address");
    }
  }
);


 const deleteAddress = createAsyncThunk(
  "delivery/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/delivery/deletedelivery/${addressId}`);
      return addressId; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error deleting address");
    }
  }
);


const DeliverySlice = createSlice({
  name: "delivery",
  initialState: {
    addresses: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((addr) =>
          addr._id === action.payload._id ? action.payload : addr
        );
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((addr) => addr._id !== action.payload);
      });
  },
});

export { fetchAddresses, addAddress, updateAddress, deleteAddress };
export default DeliverySlice.reducer;