import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import {
  setCart,
  //fetchCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  applyCoupon,
  proceedToCheckout,
} from "../../redux/features/CartSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axiosInstance.get("/coupon/get");
        console.log("Coupons API Response:", response.data);

        if (Array.isArray(response.data?.data)) {
          setAvailableCoupons(response.data.data);
        } else {
          setAvailableCoupons([]);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error("Failed to load coupons!");
      }
    };

    fetchCoupons();
  }, []);
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axiosInstance.get("/cart/getcart");
        console.log("🛠 Raw Cart API Response:", response.data);

        if (!response.data || !response.data.data) {
          console.warn(" No cart data received. Not updating Redux.");
          return;
        }

        console.log("🔹 Dispatching Redux Cart Update:", response.data.data);
        dispatch(setCart(response.data.data));
      } catch (error) {
        console.error(" Error fetching cart:", error);
      }
    };

    fetchCartData();
  }, [dispatch]);
  useEffect(() => {
    setCart((prevCart) => ({
      ...prevCart,
      totalAmount: prevCart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    }));
  }, [cart.items]);
  const handleUpdateQuantity = async (menuItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axiosInstance.put("/cart/updatequantity", {
        cartId: cart?.cartId,
        menuItemId,
        quantity: newQuantity,
      });

      dispatch(updateItemQuantity({ menuItemId, quantity: newQuantity }));

      const updatedCartResponse = await axiosInstance.get("/cart/getcart");
      dispatch(
        setCart(
          updatedCartResponse.data?.data || { cartItems: [], totalAmount: 0 }
        )
      );
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error.response?.data || error.message
      );
    }
  };

  const handleRemoveItem = async (menuItemId) => {
    try {
      await axiosInstance.delete("/cart/deletecart", { data: { menuItemId } });
      dispatch(removeItemFromCart(menuItemId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axiosInstance.delete("/cart/emptycart", {
        data: { cartId: cart?.cartId },
      });
      dispatch(clearCart());
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please try again!");
    }
  };
  const handleApplyCoupon = async () => {
    try {
      if (!selectedCoupon) {
        toast.error("Please select a coupon!");
        return;
      }

      if (cart?.appliedCoupon) {
        toast.error("A coupon is already applied. Remove it first!");
        return;
      }

      const response = await axiosInstance.post("/coupon/apply", {
        cartId: cart?.cartId,
        couponCode: selectedCoupon,
      });

      console.log("Full Coupon API Response:", response);
      console.log("Response Data:", response.data);

      const updatedCart = response.data.cart;

      if (!updatedCart || updatedCart.discountAmount === undefined) {
        console.error(
          "Invalid API Response - Missing Discount Info:",
          response.data
        );
        toast.error("Invalid coupon API response! Please try again.");
        return;
      }

      dispatch(
        applyCoupon({
          coupon: selectedCoupon,
          discountAmount: updatedCart.discountAmount,
          discountType: updatedCart.discountType || "percentage",
        })
      );

      dispatch(
        setCart({
          ...cart,
          totalAmount: updatedCart.totalAmount,
          discountAmount: updatedCart.discountAmount,
          appliedCoupon: selectedCoupon,
        })
      );

      toast.success("Coupon applied successfully!");
    } catch (error) {
      console.error(
        "Error applying coupon:",
        error.response?.data || error.message
      );
      toast.error("Error applying coupon! Please try again.");
    }
  };
  useEffect(() => {
    console.log("Cart Updated:", cart);
  }, [cart]);
  const handleProceedToCheckout = async () => {
    try {
      await axiosInstance.post("/cart/checkout", { cartId: cart?.cartId });
      dispatch(proceedToCheckout());
      navigate("/user/delivery");
    } catch (error) {
      console.error("Error proceeding to checkout:", error);
    }
  };

  if (!cart || !Array.isArray(cart.cartItems)) {
    console.warn(" Invalid cart state. Not rendering UI.", cart);
    return <p className="text-center text-gray-600">Loading cart...</p>;
  }

  if (cart.cartItems.length === 0) {
    console.warn(" Cart is empty in state but should contain items!", cart);
    return <p className="text-center text-gray-600">Your cart is empty. 🛒</p>;
  }
  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">🛒 Shopping Cart</h2>

      {cart.cartItems.length > 0 ? (
        <>
          {cart.cartItems.map((item) => (
            <div key={item._id} className="flex items-center border p-4 mb-2">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg">{item.name}</h3>
                <p className="text-gray-500"> ₹{item.price?.toFixed(2)}</p>

                <div className="flex mt-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleRemoveItem(item._id)}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
              >
                ❌ Remove
              </button>
            </div>
          ))}

          <h3 className="text-xl font-bold mt-4">
            Total: ₹{cart.totalAmount?.toFixed(2)}
          </h3>

          <div className="mt-4 flex">
            <select
              value={selectedCoupon}
              onChange={(e) => setSelectedCoupon(e.target.value)}
              className="border p-2 flex-1 rounded"
            >
              <option value="">-- Select Coupon --</option>
              {availableCoupons.length > 0 ? (
                availableCoupons.map((coupon) => (
                  <option key={coupon._id} value={coupon.code}>
                    {coupon.code.toUpperCase()} - {coupon.discountPercentage}%
                    Off
                  </option>
                ))
              ) : (
                <option disabled>No coupons available</option>
              )}
            </select>
            <button
              onClick={handleApplyCoupon}
              className="ml-2 bg-green-500 text-white px-3 py-2 rounded"
            >
              ✅ Apply Coupon
            </button>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleClearCart}
              className="bg-red-600 text-white px-4 py-2 rounded shadow-md hover:bg-red-700 transition duration-300"
            >
              🗑️ Clear Cart
            </button>

            <button
              onClick={handleProceedToCheckout}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition duration-300"
            >
              🛍️ Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty. 🛒</p>
      )}
    </div>
  );
};

export default Cart;
