import { useEffect } from "react";
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
  console.log("User Data:", userData);

  const dispatch = useDispatch();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  console.log("isUserAuth====", isUserAuth);

  const checkUser = async () => {
    try {
      const userToken = localStorage.getItem("userToken");

      if (!userToken) {
        console.log("No token found. Skipping checkUser API call.");
        dispatch(clearUser());
        return;
      }

      const response = await axiosInstance.get("/user/checkuser", {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      console.log("Check User Response:", response);
      dispatch(saveUser(response.data));
    } catch (error) {
      console.error("Error checking user:", error);
      dispatch(clearUser());
      localStorage.removeItem("userToken");
    }
  };
  useEffect(() => {
    checkUser();
  }, [location.pathname, isUserAuth]);

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
