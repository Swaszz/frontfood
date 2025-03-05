import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ role, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const userToken = localStorage.getItem("userToken");
  const ownerToken = localStorage.getItem("ownerToken");
  const adminToken = localStorage.getItem("adminToken");

  const isUserAuth = useSelector((state) => state.user.isUserAuth);
  const isOwnerAuth = useSelector((state) => state.owner.isOwnerAuth);
  const isAdminAuth = useSelector((state) => state.admin?.isAdminAuth);

  useEffect(() => {
    let isAuthenticated = false;
    let redirectPath = "/";

    if (role === "user" && isUserAuth && userToken) {
      isAuthenticated = true;
      redirectPath = "/user/profile";
    } else if (role === "restaurantowner" && isOwnerAuth && ownerToken) {
      isAuthenticated = true;
      redirectPath = "/owner/profile";
    } else if (role === "admin" && isAdminAuth && adminToken) {
      isAuthenticated = true;
      redirectPath = "/admin/dashboard";
    }

    console.log(`Checking authentication for role: ${role}`);
    console.log(`User Token: ${userToken ? "Exists" : "Not Found"}`);
    console.log(`Owner Token: ${ownerToken ? "Exists" : "Not Found"}`);
    console.log(`Admin Token: ${adminToken ? "Exists" : "Not Found"}`);
    console.log(
      `User Auth: ${isUserAuth}, Owner Auth: ${isOwnerAuth}, Admin Auth: ${isAdminAuth}`
    );

    if (!isAuthenticated) {
      navigate("/", { replace: true });
    } else if (location.pathname !== redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [
    isUserAuth,
    isOwnerAuth,
    isAdminAuth,
    role,
    navigate,
    userToken,
    ownerToken,
    adminToken,
    location.pathname,
  ]);

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
