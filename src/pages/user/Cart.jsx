import { useSelector, useDispatch } from "react-redux";
import {
  setCartDetails,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCart,
} from "../../redux/features/CartSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";

function Cart() {
  const { cartItems, totalAmount, totalQuantity, cartId } = useSelector(
    (state) => state.cart
  );
  console.log("Redux Cart State:", { cartId, cartItems });
  console.log(
    "Redux Cart State:",
    useSelector((state) => state.cart)
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await axiosInstance.get("/cart");

        if (response.data.cartId) {
          dispatch(setCart(response.data));
          console.log("Cart ID stored in Redux:", response.data.cartId);
        } else {
          console.error("API did not return cartId.");
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };

    fetchCartDetails();
  }, [dispatch]);

  const handleUpdateQuantity = async (_id, newQuantity) => {
    if (!cartId) {
      console.error("cartId is missing! Redux state is incorrect.");
      return;
    }

    const menuItem = cartItems.find((item) => item._id === _id);
    if (!menuItem) {
      console.error(`menuItem not found in cart for _id: ${_id}!`);
      return;
    }

    if (!menuItem.menuItemId) {
      console.error("menuItemId is missing in cart data!");
      return;
    }

    dispatch(
      updateQuantity({
        _id,
        menuItemId: String(menuItem.menuItemId),
        quantity: newQuantity,
      })
    );

    if (newQuantity < 1) {
      dispatch(removeFromCart(_id));
      return;
    }

    try {
      const response = await axiosInstance.put("/cart/updatequantity", {
        cartId,
        menuItemId: String(menuItem.menuItemId),
        quantity: newQuantity,
      });

      console.log("Updated Cart:", response.data);

      dispatch(setCart(response.data.data));
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error.response?.data?.message || error.message
      );
    }
  };
  useEffect(() => {
    console.log("Redux Cart State Updated:", cartItems);
    cartItems.forEach((item) => {
      console.log(
        `Item _id: ${item._id}, name: ${item.name}, price: ${item.price}, image: ${item.image}`
      );
    });
  }, [cartItems]);
  const handleRemoveFromCart = async (itemId) => {
    try {
      console.log("Removing item from cart:", itemId);

      const response = await axiosInstance.delete("/cart/deletecart", {
        data: { menuItemId: itemId },
      });

      const updatedCart = await axiosInstance.get("/cart");

      dispatch(setCartDetails(updatedCart.data));
    } catch (error) {
      console.error(
        "Error removing item:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleCheckout = async () => {
    try {
      if (!cartId) {
        console.error(" Error: cartId is undefined in Redux.");
        return;
      }

      const response = await axiosInstance.post("/cart/checkout", {
        cartId,
      });

      console.log("Checkout API Response:", response.data);

      if (response.status === 200) {
        navigate("/user/delivery");
      } else {
        console.log("Error during checkout. Please try again.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 border-b"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image ? item.image : "/placeholder.jpg"}
                  alt={item.name ? item.name : "No name"}
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {item.name ? item.name : "Unnamed Item"}
                  </h2>
                  <p className="text-gray-600">
                    ${item.price ? item.price.toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    console.log("➖ Decrease clicked for _id:", item._id);
                    handleUpdateQuantity(item._id, item.quantity - 1);
                  }}
                  disabled={item.quantity <= 1} // Prevents quantity from going below 1
                >
                  ➖
                </button>

                <span className="text-lg font-bold mx-4">{item.quantity}</span>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleUpdateQuantity(item._id, item.quantity + 1);
                  }}
                >
                  ➕
                </button>
                <button
                  className="btn btn-danger ml-4"
                  onClick={() => handleRemoveFromCart(item._id)}
                >
                  Remove ❌
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6">
            <p className="text-xl font-bold">Total Items: {totalQuantity}</p>
            <p className="text-xl font-bold">
              Total Amount: ${totalAmount ? totalAmount.toFixed(2) : "0.00"}
            </p>
            <button
              className="btn btn-danger mt-4"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart 🗑️
            </button>
            <button
              className="btn btn-primary mt-4 w-full sm:w-auto px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout 🛍️
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
