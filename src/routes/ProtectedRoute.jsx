import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ role, children }) {
  const navigate = useNavigate();

  const isUserAuth = useSelector((state) => state.user.isUserAuth);
  const isOwnerAuth = useSelector((state) => state.owner.isOwnerAuth);
  const isAdminAuth = useSelector((state) => state.admin.isAdminAuth);

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    // Immediately redirect if no user is found
    if (!storedUserData) {
      console.warn("User is not authenticated - Redirecting to /login");
      window.location.href = "/login"; // Ensure full page reload
      return;
    }

    const isAuthenticated =
      (role === "user" && isUserAuth) ||
      (role === "restaurantowner" && isOwnerAuth) ||
      (role === "admin" && isAdminAuth);

    if (!isAuthenticated) {
      console.warn("Unauthorized - Redirecting to /login");
      window.location.href = "/login";
    } else {
      setIsChecked(true);
    }
  }, [isUserAuth, isOwnerAuth, isAdminAuth, role, navigate]);

  if (!isChecked) {
    return <div>Loading...</div>;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
