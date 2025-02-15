import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import {
  setCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  applyCoupon,
  proceedToCheckout,
} from "../../redux/features/CartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axiosInstance.get("/cart/getcart");
        dispatch(setCart(response.data.data));
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCartData();
  }, [dispatch]);

  const handleUpdateQuantity = async (menuItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      console.log("Updating Quantity for:", { menuItemId, newQuantity });

      const response = await axiosInstance.put("/cart/updatequantity", {
        cartId: cart.cartId,
        menuItemId,
        quantity: newQuantity,
      });

      console.log("API Response:", response.data);

      dispatch(updateItemQuantity({ menuItemId, quantity: newQuantity }));

      const updatedCartResponse = await axiosInstance.get("/cart/getcart");
      dispatch(setCart(updatedCartResponse.data.data));
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
      console.log("Clearing Cart...");

      await axiosInstance.delete("/cart/emptycart", {
        data: { cartId: cart.cartId },
      });

      dispatch(clearCart());
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please try again!");
    }
  };

  const handleApplyCoupon = async () => {
    try {
      console.log("Attempting to Apply Coupon:", couponCode);

      if (!couponCode) {
        return;
      }

      if (cart.appliedCoupon) {
        toast.error(" A coupon is already applied. Remove it first!");
        return;
      }

      const response = await axiosInstance.post("/coupon/apply", {
        cartId: cart.cartId,
        couponCode,
      });

      console.log("Coupon Applied Successfully:", response.data);

      dispatch(setCart(response.data.cart));
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Error applying coupon!");
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      await axiosInstance.post("/cart/checkout", { cartId: cart.cartId });
      dispatch(proceedToCheckout());
      navigate("/user/delivery");
    } catch (error) {
      console.error("Error proceeding to checkout:", error);
    }
  };
  if (!cart || !cart.cartItems) {
    return <p>Your cart is empty.</p>;
  }
  return (
    <div className="container mx-auto p-6">
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
                <p className="text-gray-500">${item.price.toFixed(2)}</p>

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
            💰 Total: ${cart.totalAmount.toFixed(2)}
          </h3>

          <div className="mt-4 flex">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border p-2 flex-1 rounded"
            />
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
