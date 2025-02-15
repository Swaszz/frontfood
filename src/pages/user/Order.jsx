import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";
import {
  setOrder,
  setOrderDetails,
  cancelOrder,
} from "../../redux/features/OrderSlice";
import "react-toastify/dist/ReactToastify.css";

function Order() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((state) => state.order);
  const { userData } = useSelector((state) => state.user);
  const [selectedAddress, setSelectedAddress] = useState(null);
  useEffect(() => {
    console.log("🔍 Redux User Info:", userData);
  }, [userData]);
  useEffect(() => {
    const fetchOrderSummary = async () => {
      try {
        const response = await axiosInstance.get("/order/getorder");
        dispatch(setOrder(response.data.data));
      } catch (error) {
        console.error(" Error fetching order summary:", error);
      }
    };

    fetchOrderSummary();
  }, [dispatch]);

  useEffect(() => {
    if (order.deliveryAddress) {
      console.log(
        "Setting Delivery Address from Redux:",
        order.deliveryAddress
      );
      setSelectedAddress(order.deliveryAddress);
    }
  }, [order.deliveryAddress]);

  const handlePlaceOrder = async () => {
    if (!userData?.id) {
      console.error("Missing userId in userInfo:", userData);
      toast.error("User is not logged in. Please log in to place an order.");
      return;
    }

    if (!order.restaurant || !order.restaurant._id) {
      console.error("Missing restaurantId in order:", order);
      toast.error("Error: Missing restaurant ID. Please select a restaurant.");
      return;
    }

    const orderData = {
      userId: userData.id,
      restaurantId: order.restaurant._id,
      deliveryAddress: order.deliveryAddress,
      menuItem: order.orderItems,
    };

    console.log(" Placing Order with:", orderData);

    try {
      const response = await axiosInstance.post("/order/placeorder", orderData);
      console.log(" Order Placed Successfully:", response.data);
      dispatch(setOrderDetails(response.data.data));
      toast.success("Order placed successfully!");
      navigate("/user/payment");
    } catch (error) {
      console.error(
        "Failed to place order:",
        error.response?.data || error.message
      );
      toast.error("Failed to place order.");
    }
  };

  const handleCancelOrder = async () => {
    try {
      await axiosInstance.post("/order/cancel", { orderId: order._id });
      dispatch(cancelOrder());
      toast.success("Order cancelled successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel order.");
    }
  };

  if (!order || !order.orderItems) return <p>Loading order details...</p>;

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-black-800 mb-6 text-center">
        Order Summary
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {order.orderItems.map((item) => (
          <div key={item.menuItemId} className="flex items-center border-b p-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg">{item.name}</h3>
              <p className="text-gray-500">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
            <p className="font-bold">${item.price * item.quantity}</p>
          </div>
        ))}

        <h3 className="text-xl font-bold mt-4">
          Total: ${order.totalAmount.toFixed(2)}
        </h3>

        <div className="mt-4">
          <h2 className="text-xl font-semibold"> Delivery Address</h2>
          {selectedAddress ? (
            <p>
              {selectedAddress.street}, {selectedAddress.city},{" "}
              {selectedAddress.state}
            </p>
          ) : (
            <p className="text-gray-500">No delivery address selected.</p>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            ✅ Place Order
          </button>
          <button
            onClick={handleCancelOrder}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            ❌ Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Order;
