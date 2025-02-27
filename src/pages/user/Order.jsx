import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchOrderSummary,
  fetchlatestOrder,
} from "../../redux/features/OrderSlice";
import { setCart } from "../../redux/features/CartSlice";
import axiosInstance from "../../config/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Order() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderState = useSelector((state) => state.order);

  const order = useSelector((state) => state.order.order);
  const loading = useSelector((state) => state.order.loading);

  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    console.log("🛒 Redux Cart State Before Order:", cart);
  }, [cart]);
  useEffect(() => {
    dispatch(fetchOrderSummary());
    dispatch(fetchlatestOrder());
  }, [dispatch]);
  const fetchCartBeforeOrder = async () => {
    const response = await axiosInstance.get("/cart/getcart");
    dispatch(setCart(response.data.data));
  };
  useEffect(() => {
    fetchCartBeforeOrder();
  }, []);
  useEffect(() => {
    console.log(
      " Current Redux Order State Before Placing Order:",
      orderState.order
    );
  }, [orderState.order]);
  const handlePlaceOrder = async () => {
    if (!cart?.cartId) {
      console.error(" Error: `cartId` is missing before placing the order!");
      toast.error("Cart ID is missing! Please refresh and try again.");
      return;
    }

    console.log(" Cart Items Before Order:", cart.cartItems);

    try {
      const orderData = {
        cartId: cart.cartId,
        userId: cart.userId,
        totalAmount: cart.totalAmount,
        discountAmount: cart.discountAmount || 0,
        appliedCoupon: cart.appliedCoupon || null,
        orderItems: cart.cartItems.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log(" Placing Order with Data:", orderData);

      const response = await axiosInstance.post("/order/placeorder", orderData);
      console.log(" Order API Response:", response.data);

      if (!response.data || !response.data.orderId) {
        console.error(
          " Error: No `orderId` received from backend!",
          response.data
        );
        toast.error("Order ID is missing. Cannot proceed to payment.");
        return;
      }

      const orderId = response.data.orderId;
      toast.success("Order placed successfully!");

      navigate("/user/payment", {
        state: {
          orderId: orderId,
          cartId: cart.cartId,
          totalAmount: cart.totalAmount,
          discountAmount: cart.discountAmount,
          orderItems: cart.cartItems,
        },
      });
    } catch (error) {
      console.error(" Order Placement Failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };
  if (loading) return <p>Loading order details...</p>;
  if (!order || !order.orderItems || order.orderItems.length === 0) {
    return <p>No items in order.</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <ToastContainer />

      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-all">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Order Summary
        </h1>

        {order?.orderItems?.map((item, index) => (
          <div
            key={item.menuItemId || `orderItem-${index}`}
            className="flex flex-col sm:flex-row items-center border-b border-gray-300 dark:border-gray-700 p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg shadow-md"
            />
            <div className="ml-0 sm:ml-4 flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                {item.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                ₹ {item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
            <p className="font-bold text-gray-900 dark:text-gray-100">
              ₹ {(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="mt-6 text-gray-800 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
          {order.deliveryAddress ? (
            <p className="text-gray-600 dark:text-gray-400">
              {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
              {order.deliveryAddress.state}
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No delivery address selected.
            </p>
          )}
        </div>

        <hr className="my-4 border-gray-300 dark:border-gray-700" />

        <div className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
          <p>
            Total Price:{" "}
            <span className="font-bold">₹ {order.totalAmount.toFixed(2)}</span>
          </p>
          {order.discountAmount > 0 && (
            <p className="text-green-600 dark:text-green-400">
              Discount: ₹ {order.discountAmount.toFixed(2)}
            </p>
          )}
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Order;
