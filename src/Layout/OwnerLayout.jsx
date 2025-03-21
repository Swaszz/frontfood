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
      const ownerToken = localStorage.getItem("ownerToken");

      if (!ownerToken) {
        console.log("No token found. Skipping checkOwner API call.");
        dispatch(clearOwner());
        return;
      }

      const response = await axiosInstance.get(
        "/restaurantowner/checkrestaurantowner",
        {
          headers: { Authorization: `Bearer ${ownerToken}` },
        }
      );

      console.log("Owner Authenticated:", response.data);
      dispatch(saveOwner(response.data));
    } catch (error) {
      console.error("Owner Not Authenticated:", error);
      dispatch(clearOwner());
      localStorage.removeItem("ownerToken");
    }
  };

  useEffect(() => {
    checkOwner();
  }, [location.pathname, isOwnerAuth]);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />

      {isOwnerAuth ? (
        <OwnerHeader onSearch={handleSearch} />
      ) : (
        <Headerowner onSearch={handleSearch} />
      )}

      {searchQuery && <SearchResults searchQuery={searchQuery} />}

      <div className="flex-grow">
        <Outlet />
      </div>

      <Footers />
    </div>
  );
};

export default OwnerLayout;
