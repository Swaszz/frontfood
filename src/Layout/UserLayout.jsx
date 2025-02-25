import { useEffect, useRef } from "react";
import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import { Outlet, useLocation } from "react-router-dom";
import UserHeader from "../components/user/UserHeader";
import axiosInstance from "../config/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, saveUser } from "../redux/features/userSlice";
import { useState } from "react";
import SearchResults from "../components/shared/SearchResults";
import ScrollToTop from "../components/ScrollToTop";
const UserLayout = () => {
  const { isUserAuth, userData } = useSelector((state) => state.user);
  console.log(userData);
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const isFirstRender = useRef(true); // Ensures useEffect runs only on mount
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  console.log("isUserAuth====", isUserAuth);

  const checkUser = async () => {
    try {
      const response = await axiosInstance.get("/user/checkuser");
      console.log(response);
      dispatch(saveUser(response.data));
      localStorage.setItem("isUserAuth", "true");
    } catch (error) {
      dispatch(clearUser());
      localStorage.removeItem("isUserAuth");
      console.log(error);
    }
  };

  // useEffect(() => {
  //   checkUser();
  // }, [location.pathname, isUserAuth]);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isUserAuth") === "true";

    // Restore auth state from localStorage
    if (storedAuth) {
      dispatch(saveUser({ isUserAuth: true }));
    }

    // Prevent multiple API calls
    if (isFirstRender.current) {
      checkUser();
      isFirstRender.current = false;
    }
  }, []); // Run only once on mount
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {isUserAuth ? (
        <UserHeader onSearch={handleSearch} />
      ) : (
        <Header onSearch={handleSearch} />
      )}
      {searchQuery && <SearchResults searchQuery={searchQuery} />}

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
export default UserLayout;
