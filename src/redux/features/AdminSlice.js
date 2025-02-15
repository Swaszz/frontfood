import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdminAuth: false,
  adminData: null,
};

const AdminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    saveAdmin: (state, action) => {
      state.isAdminAuth = true;
      state.adminData = action.payload;
    },
    clearAdmin: (state) => {
      state.isAdminAuth = false;
      state.adminData = null;
    },
  },
});

export const { saveAdmin, clearAdmin } = AdminSlice.actions;
export default AdminSlice.reducer;
