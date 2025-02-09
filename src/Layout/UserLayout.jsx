import { useEffect } from "react";
import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import { Outlet, useLocation } from "react-router-dom";
import UserHeader from "../components/user/UserHeader";
import axiosInstance from "../config/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, saveUser } from "../redux/features/userSlice";

const UserLayout = () => {
  const { isUserAuth, userData } = useSelector((state) => state.user);
  console.log(userData);
  const dispatch = useDispatch();
  const location = useLocation();

  console.log("isUserAuth====", isUserAuth);

  const checkUser = async () => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: "/user/checkuser",
      });
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
      {isUserAuth ? <UserHeader /> : <Header />}

      <div className="min-h-96">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};
export default UserLayout;
