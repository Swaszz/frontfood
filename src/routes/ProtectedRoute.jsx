import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ role, children }) {
  const navigate = useNavigate();

  // Fetch respective tokens
  const userToken = localStorage.getItem("userToken");
  const ownerToken = localStorage.getItem("ownerToken");
  const adminToken = localStorage.getItem("adminToken"); // If applicable

  // Get authentication state from Redux
  const isUserAuth = useSelector((state) => state.user.isUserAuth);
  const isOwnerAuth = useSelector((state) => state.owner.isOwnerAuth);
  const isAdminAuth = useSelector((state) => state.admin?.isAdminAuth); // Optional for admin

  useEffect(() => {
    let isAuthenticated = false;
    let redirectPath = "/";

    // Determine authentication based on role
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
      navigate("/", { replace: true }); // Redirect to login if not authenticated
    } else {
      navigate(redirectPath, { replace: true }); // Redirect authenticated users to their profile
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
  ]);

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
