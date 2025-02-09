import "react";
import Footer from "../components/user/Footer";
import { Outlet } from "react-router-dom";
import OwnerHeader from "../components/restaurantowner/OwnerHeader.jsx";
import Header from "../components/restaurantowner/Header";

function OwnerLayout() {
  const isUserAuth = false;

  return (
    <div>
      {isUserAuth ? <OwnerHeader /> : <Header />}

      <div className="min-h-96">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default OwnerLayout;
