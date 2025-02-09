import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../Layout/UserLayout";
import Home from "../pages/user/Home";
import Signup from "../pages/shared/Signup";
import Login from "../pages/shared/Login";
import About from "../pages/user/About";
import Menuitem from "../pages/user/Menuitem";
import MenuitemDetails from "../pages/user/MenuitemDetails";
import ErrorPage from "../pages/shared/ErrorPage";
import OwnerLayout from "../Layout/OwnerLayout";
import Profile from "../pages/user/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "../pages/user/Cart";
import DeliveryAddress from "../pages/user/DeliveryAddress";
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
        element: <ProtectedRoute />,
        path: "user",
        children: [
          {
            path: "whishlist",
            // element: <h1>Wishlist</h1>,
          },
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
            path: "orders",
            //element: <h1> orders page</h1>,
          },
          {
            path: "payment/success",
            // element: <h2>Payment success</h2>,
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
        path: "login",
        element: <Login role="restaurantowner" />,
      },
      {
        path: "signup",
        element: <Signup role="restaurantowner" />,
      },
    ],
  },
  {
    path: "admin",
    element: <OwnerLayout />,
    errorElement: <ErrorPage role="admin" />,
    children: [
      {
        path: "login",
        element: <Login role="admin" />,
      },
      {
        path: "signup",
        element: <Signup role="admin" />,
      },
    ],
  },
]);

export default router;
