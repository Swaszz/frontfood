import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../Layout/UserLayout";
import Home from "../pages/user/Home";
import About from "../pages/user/About";
import Profile from "../pages/user/Profile";
import Menuitem from "../pages/user/Menuitem";
import MenuitemDetails from "../pages/user/MenuitemDetails";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "../pages/user/Cart";
import DeliveryAddress from "../pages/user/DeliveryAddress";
import Order from "../pages/user/Order";
import Orderhistory from "../pages/user/Orderhistory";
import Productitem from "../pages/user/Productitem";
import Signup from "../pages/shared/Signup";
import Login from "../pages/shared/Login";
import ErrorPage from "../pages/shared/ErrorPage";
import OwnerLayout from "../Layout/OwnerLayout";
import Profiles from "../pages/restaurantowner/Profiles";
import Ownerhome from "../pages/restaurantowner/Ownerhome";
//import ScrollToTop from "../components/ScrollToTop";
import { Outlet } from "react-router-dom";
import Menuitemform from "../pages/restaurantowner/Menuitemform";
import Restaurantform from "../pages/restaurantowner/Restaurantform";
import Menudetailsform from "../pages/restaurantowner/Menudetailsform";
import Couponform from "../pages/restaurantowner/Couponform";
import Categorypage from "../pages/user/Categorypage";
import Categorypages from "../pages/restaurantowner/Categorypages";
import Payment from "../pages/user/Payment";
import Orderform from "../pages/restaurantowner/Orderform";
import ProductItems from "../pages/restaurantowner/Productitems";
import UpdateMenuform from "../pages/restaurantowner/Updatemenuform";
import Paymentsuccess from "../pages/user/Paymentsuccess";
import Paymentcancel from "../pages/user/Paymentcancel";

const router = createBrowserRouter([
  {
    path: "",
    element: <UserLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search/:query",
        element: <Productitem />,
      },
      {
        path: "/category/:categoryName",
        element: <Categorypage />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "menuitem",
        element: <Menuitem />,
      },

      {
        path: "/menuItemDetails/:id",
        element: <MenuitemDetails />,
      },
      {
        element: (
          <ProtectedRoute role="user">
            <Outlet />
          </ProtectedRoute>
        ),
        path: "user",
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "delivery",
            element: <DeliveryAddress />,
          },
          {
            path: "order",
            element: <Order />,
          },
          {
            path: "history",
            element: <Orderhistory />,
          },
          {
            path: "payment",
            element: <Payment />,
          },
          {
            path: "success",
            element: <Paymentsuccess />,
          },
          {
            path: "cancel",
            element: <Paymentcancel />,
          },
        ],
      },
    ],
  },
  {
    path: "restaurantowner",
    element: <OwnerLayout />,
    errorElement: <ErrorPage role="restaurantowner" />,
    children: [
      {
        path: "",
        element: <Ownerhome />,
      },
      {
        path: "search/:query",
        element: <ProductItems />,
      },
      {
        path: "login",
        element: <Login role="restaurantowner" />,
      },
      {
        path: "signup",
        element: <Signup role="restaurantowner" />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "category/:categoryName",
        element: <Categorypages />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute role="restaurantowner">
            <Profiles />
          </ProtectedRoute>
        ),
      },
      {
        path: "addrestaurant",
        element: (
          <ProtectedRoute role="restaurantowner">
            <Restaurantform />
          </ProtectedRoute>
        ),
      },
      {
        path: "createmenu",
        element: (
          <ProtectedRoute role="restaurantowner">
            <Menuitemform />
          </ProtectedRoute>
        ),
      },
      {
        path: "selectmenu",
        element: (
          <ProtectedRoute role="restaurantowner">
            <Menudetailsform />
          </ProtectedRoute>
        ),
      },
      {
        path: "updatemenu/:id",
        element: (
          <ProtectedRoute role="restaurantowner">
            <UpdateMenuform />
          </ProtectedRoute>
        ),
      },
      {
        path: "createcoupon",
        element: (
          <ProtectedRoute role="restaurantowner">
            <Couponform />
          </ProtectedRoute>
        ),
      },
      {
        path: "updateorder",
        element: (
          <ProtectedRoute role="restaurantowner">
            <Orderform />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
