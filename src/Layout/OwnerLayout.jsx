import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../config/axiosInstance";
import { clearOwner, saveOwner } from "../redux/features/OwnerSlice";
import OwnerHeader from "../components/restaurantowner/OwnerHeader";
import Headerowner from "../components/restaurantowner/Headerowner";
import Footers from "../components/restaurantowner/Footers";
import SearchResults from "../components/shared/SearchResults";
import ScrollToTop from "../components/ScrollToTop";
const OwnerLayout = () => {
  const { isOwnerAuth, ownerData } = useSelector((state) => state.owner);
  console.log("Owner Data:", ownerData);
  console.log("isOwnerAuth:", isOwnerAuth);

  const dispatch = useDispatch();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const checkOwner = async () => {
    try {
      const response = await axiosInstance.get(
        "/restaurantowner/checkrestaurantowner"
      );
      console.log("Owner Authenticated:", response.data);
      dispatch(saveOwner(response.data));
      localStorage.setItem("isOwnerAuth", "true");
    } catch (error) {
      dispatch(clearOwner());
      localStorage.removeItem("isOwnerAuth");
      console.log("Owner Not Authenticated:", error);
    }
  };

  useEffect(() => {
    checkOwner();
  }, [location.pathname, isOwnerAuth]);

  return (
    <div>
      <ScrollToTop />
      {isOwnerAuth ? (
        <OwnerHeader onSearch={handleSearch} />
      ) : (
        <Headerowner onSearch={handleSearch} />
      )}

      {searchQuery && <SearchResults searchQuery={searchQuery} />}

      <div className="min-h-96">
        <Outlet />
      </div>

      <Footers />
    </div>
  );
};

export default OwnerLayout;
