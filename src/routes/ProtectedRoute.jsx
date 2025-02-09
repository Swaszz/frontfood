import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
  const navigate = useNavigate();
  const isUserAuth = useSelector((state) => state.user.isUserAuth);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isUserAuth === false) {
      navigate("/login");
    } else {
      setIsChecked(true);
    }
  }, [isUserAuth, navigate]);

  if (!isChecked) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
}

export default ProtectedRoute;
