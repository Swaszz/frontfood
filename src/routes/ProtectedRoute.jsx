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
    const storedUserData = localStorage.getItem("userData");

    // Ensure logout state is respected
    if (!storedUserData) {
      console.warn("User is not authenticated - Redirecting to /login");
      navigate("/login", { replace: true });
    }
  });
  useEffect(() => {
    if (isUserAuth === null || isOwnerAuth === null || isAdminAuth === null) {
      return;
    }

    const isAuthenticated =
      (role === "user" && isUserAuth) ||
      (role === "restaurantowner" && isOwnerAuth) ||
      (role === "admin" && isAdminAuth);

    console.log(`Checking authentication for role: ${role}`);
    console.log(
      `User Auth: ${isUserAuth}, Owner Auth: ${isOwnerAuth}, Admin Auth: ${isAdminAuth}`
    );
    if (!isAuthenticated) {
      console.warn("Unauthorized - Redirecting to /login");
      window.location.href = "/login";
      //navigate("/login");
    } else {
      setIsChecked(true);
    }
  }, [isUserAuth, isOwnerAuth, isAdminAuth, navigate]);

  if (!isChecked) {
    return <div>Loading...</div>;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
