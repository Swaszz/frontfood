import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../config/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Payment = () => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const locationOrder = location.state || null;

  useEffect(() => {
    console.log("🔹 Order from Navigation:", locationOrder);
    if (locationOrder) {
      setOrder(locationOrder);
      setIsLoading(false);
    } else {
      fetchLatestOrder();
    }
  }, [locationOrder]);
  const fetchLatestOrder = async () => {
    try {
      console.log(" Fetching latest order...");
      const response = await axiosInstance.get("/order/latest", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(" Latest Order Data:", response.data);

      setOrder((prevOrder) => ({
        ...response.data,
        orderId:
          prevOrder?.orderId ?? response.data.orderId ?? response.data._id,
      }));
    } catch (error) {
      console.error(
        " Error fetching latest order:",
        error.response?.data || error.message
      );
      setError(error.response?.data || "Failed to fetch latest order.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchLatestOrder();
  }, []);

  const handlePayment = async () => {
    console.log(" Checking Order Data Before Payment:", order);

    if (!order.orderId) {
      console.error(" Error: `orderId` is missing!", order);
      toast.error("Order ID is missing. Cannot proceed with payment.");
      return;
    }

    console.log(" Order Ready for Payment:", order);

    setLoading(true);

    try {
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_Publishable_key
      );

      const { data } = await axiosInstance.post(
        "/payment/create-checkout-session",
        {
          orderId: order.orderId,
          cartId: order.cartId,
          amount: order.totalAmount - (order.discountAmount ?? 0),
          menuItem: order.orderItems.map((item) => ({
            menuItemId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }
      );

      console.log(" Stripe Session Response:", data);

      if (data?.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        console.error(" No session ID received from backend:", data);
        toast.error("Payment session could not be initiated.");
      }
    } catch (error) {
      console.error(" Payment Error:", error.response?.data || error.message);
      toast.error("An error occurred while processing payment.");
    } finally {
      setLoading(false);
    }
  };
  const handleCancelOrder = async () => {
    if (!order || !order._id) {
      console.error("No order available to cancel.");
      toast.error("No valid order to cancel.");
      return;
    }

    console.log("Cancelling Order ID:", order._id);
    setIsCancelling(true);

    try {
      const response = await axiosInstance.delete(
        `/order/cancel/${order._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Cancel Order Response:", response);

      if (response.data.success) {
        toast.success("Order cancelled successfully!");

        setOrder(null);
        fetchLatestOrder();

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        console.warn("API returned success: false", response.data);
        toast.error("Failed to cancel order. Try again.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(
        `Failed to cancel order: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <ToastContainer />

      <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center transition-all">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Complete Your Payment
        </h2>

        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400">
            Loading order details...
          </p>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">
            Error fetching order: {error.message || error}
          </p>
        ) : order ? (
          <>
            <div className="mb-6 text-left text-gray-800 dark:text-gray-300">
              <p className="mb-2">
                <strong>Order ID:</strong> {order._id}
              </p>
              <p className="mb-2">
                <strong>Applied Coupon:</strong>{" "}
                {order.appliedCoupon || "No coupon applied"}
              </p>
              <hr className="my-3 border-gray-300 dark:border-gray-700" />
              <p className="font-bold text-lg">
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all disabled:bg-gray-400"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>

              <button
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all disabled:bg-gray-400"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No pending orders available for payment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Payment;
