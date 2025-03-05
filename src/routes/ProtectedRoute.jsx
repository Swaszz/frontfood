import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ role, children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Get token from localStorage

  const isUserAuth = useSelector((state) => state.user.isUserAuth);
  const isOwnerAuth = useSelector((state) => state.owner.isOwnerAuth);
  const isAdminAuth = useSelector((state) => state.admin.isAdminAuth);

  useEffect(() => {
    const isAuthenticated =
      (role === "user" && isUserAuth && token) ||
      (role === "restaurantowner" && isOwnerAuth && token) ||
      (role === "admin" && isAdminAuth && token);

    console.log(`Checking authentication for role: ${role}`);
    console.log(`Token: ${token ? "Exists" : "Not Found"}`);
    console.log(
      `User Auth: ${isUserAuth}, Owner Auth: ${isOwnerAuth}, Admin Auth: ${isAdminAuth}`
    );

    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isUserAuth, isOwnerAuth, isAdminAuth, role, navigate, token]);

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
