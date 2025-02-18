import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {},
 isUserAuth:false,
 
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.isUserAuth = true;
      state.userData = action.payload;
      localStorage.setItem("userData", action.payload);
    },

    clearUser: (state) => {
      state.isUserAuth = false;
      state.userData = null; 
      localStorage.removeItem("userData"); 
      localStorage.removeItem("token"); 
    },

    setUser: (state, action) => {
      state.userData = action.payload;
      state.isUserAuth = true;
      localStorage.setItem("userData", action.payload);
    },

    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isUserAuth = true;
      localStorage.setItem("userData", action.payload);
    },

    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.userId = action.payload; 
      localStorage.setItem("userData",(action.payload)); 
    },

    logoutUser: (state) => {
      state.isUserAuth = false;
      state.userData = null;
      localStorage.removeItem("userData");  
    localStorage.removeItem("token");     
    },
  },
});

export const { saveUser, setUserData, clearUser, setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
