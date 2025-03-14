import { createSlice } from "@reduxjs/toolkit";
const storedToken = localStorage.getItem("userToken") || ""; 
const storedUserData = localStorage.getItem("userData");
const isAuthenticated = storedToken ? true : false;

const initialState = {
  userData: storedUserData || null,
  isUserAuth: isAuthenticated,
 
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action) => {
     // if (localStorage.getItem("ownerToken")) return;
      state.isUserAuth = true;
      state.userData = action.payload;
      localStorage.setItem("userData", action.payload);
      localStorage.setItem("userToken", action.payload.token);
    },

   
    setUser: (state, action) => {
      state.userData = action.payload;
      state.isUserAuth = true;
      localStorage.setItem("userData", action.payload);
      localStorage.setItem("userToken", action.payload.token);
    },

    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isUserAuth = true;
      localStorage.setItem("userData", action.payload);
      localStorage.setItem("userToken", action.payload.token);
    },

    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.userId = action.payload; 
      localStorage.setItem("userData",(action.payload)); 
      localStorage.setItem("userToken", action.payload.token);
    },
    clearUser: (state) => {
      state.isUserAuth = false;
      state.userData = null; 
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
      sessionStorage.clear();
    },

    logoutUser: (state) => {
      state.isUserAuth = false;
      state.userData = null;
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
      sessionStorage.clear();
    },
  },
});

export const { saveUser, setUserData, clearUser, setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
