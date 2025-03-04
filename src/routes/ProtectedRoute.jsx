import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ role, children }) {
  const navigate = useNavigate();

  const isUserAuth = useSelector((state) => state.user.isUserAuth);
  const isOwnerAuth = useSelector((state) => state.owner.isOwnerAuth);
  const isAdminAuth = useSelector((state) => state.admin.isAdminAuth);

  useEffect(() => {
    // Ensure localStorage matches Redux state
    const storedUserData = localStorage.getItem("userData");
    const storedOwnerData = localStorage.getItem("ownerData");

    const isAuthenticated =
      (role === "user" && isUserAuth && storedUserData) ||
      (role === "restaurantowner" && isOwnerAuth && storedOwnerData) ||
      (role === "admin" && isAdminAuth);

    console.log(`Checking authentication for role: ${role}`);
    console.log(
      `User Auth: ${isUserAuth}, Owner Auth: ${isOwnerAuth}, Admin Auth: ${isAdminAuth}`
    );

    if (!isAuthenticated) {
      console.warn("Unauthorized - Redirecting to login");
      navigate("/login", { replace: true }); // Prevents back navigation to protected routes
    }
  }, [isUserAuth, isOwnerAuth, isAdminAuth, role, navigate]);

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
