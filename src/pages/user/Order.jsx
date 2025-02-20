import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrderSummary } from "../../redux/features/OrderSlice";
import axiosInstance from "../../config/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Order() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderState = useSelector((state) => state.order);

  const order = useSelector((state) => state.order.order);
  const loading = useSelector((state) => state.order.loading);

  useEffect(() => {
    dispatch(fetchOrderSummary());
  }, [dispatch]);

  useEffect(() => {
    console.log(
      "Current Redux Order State Before Placing Order:",
      orderState.order
    );
  }, [orderState.order]);

  const handlePlaceOrder = async () => {
    console.log("Placing Order with:", orderState.order);

    try {
      const response = await axiosInstance.post("/order/placeorder", {
        menuItem: orderState.order.orderItems.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: orderState.order.totalAmount,
        discountAmount: orderState.order.discountAmount,
        appliedCoupon: orderState.order.appliedCoupon,
        deliveryAddress: orderState.order.deliveryAddress,
      });

      console.log("Order Placed Successfully:", response.data);
      toast.success("Order placed successfully!");
      navigate("/user/payment");
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (!order || !order.orderItems || order.orderItems.length === 0) {
    return <p>No items in order.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Order Summary</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {order.orderItems.map((item, index) => (
          <div
            key={item.menuItemId || `orderItem-${index}`}
            className="flex items-center border-b p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-500">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
            </div>
            <p className="font-bold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="mt-4">
          <h2 className="text-xl font-semibold">Delivery Address</h2>
          {order.deliveryAddress ? (
            <p>
              {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
              {order.deliveryAddress.state}
            </p>
          ) : (
            <p className="text-gray-500">No delivery address selected.</p>
          )}
        </div>

        <h3 className="text-xl font-bold mt-4">
          Total Price: ${order.totalAmount.toFixed(2)}
        </h3>
        {order.discountAmount > 0 && (
          <p className="text-green-600">
            Discount: -${order.discountAmount.toFixed(2)}
          </p>
        )}

        <button
          onClick={handlePlaceOrder}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Order;
