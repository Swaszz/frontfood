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

const UserLayout = () => {
  const { isUserAuth, userData } = useSelector((state) => state.user);
  console.log(userData);
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  console.log("isUserAuth====", isUserAuth);

  const checkUser = async () => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: "/user/checkuser",
      });
      console.log(response);
      dispatch(saveUser());
    } catch (error) {
      dispatch(clearUser());
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, [location.pathname]);

  return (
    <div>
      {isUserAuth ? (
        <UserHeader onSearch={handleSearch} />
      ) : (
        <Header onSearch={handleSearch} />
      )}
      {searchQuery && <SearchResults searchQuery={searchQuery} />}

      <div className="min-h-98">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};
export default UserLayout;
