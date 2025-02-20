import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../config/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false); // ✅ Added for cancel button state
  const navigate = useNavigate();
  // ✅ Fetch Latest Pending Order
  const fetchLatestOrder = async () => {
    try {
      console.log("🔵 Fetching latest order...");

      const response = await axiosInstance.get("/order/latest", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("✅ Latest Order Data:", response.data);
      setOrder(response.data?.data || response.data);
    } catch (err) {
      console.error(
        "❌ Error fetching latest order:",
        err.response?.data || err.message
      );
      setError(err.response?.data || "Failed to fetch latest order.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestOrder();
  }, []);

  // ✅ Handle Payment
  const handlePayment = async () => {
    if (!order) {
      toast.error("No pending orders available for payment.");
      return;
    }

    console.log("🟡 Processing Payment for Order:", order);
    setLoading(true);

    try {
      const stripe = await stripePromise;

      const response = await axiosInstance.post(
        "/user/payment/create-checkout-session",
        {
          orderId: order._id,
        }
      );

      console.log("✅ Stripe Session Response:", response.data);

      if (response.data.sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });

        if (error) {
          console.error("❌ Stripe Checkout Error:", error);
          toast.error("Failed to process payment.");
        }
      }
    } catch (error) {
      console.error("❌ Payment Error:", error.response?.data || error.message);
      toast.error("An error occurred while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Order Cancellation
  const handleCancelOrder = async () => {
    if (!order || !order._id) {
      console.error("❌ No order available to cancel.");
      toast.error("No valid order to cancel.");
      return;
    }

    console.log("🟡 Cancelling Order ID:", order._id);
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

      console.log("✅ Cancel Order Response:", response);

      if (response.data.success) {
        toast.success("Order cancelled successfully!");

        setOrder(null); // ✅ Clear order state
        fetchLatestOrder(); // ✅ Refresh order details

        setTimeout(() => {
          navigate("/"); // ✅ Redirect to home after 1 second
        }, 1000);
      } else {
        console.warn("⚠️ API returned success: false", response.data);
        toast.error("Failed to cancel order. Try again.");
      }
    } catch (error) {
      console.error("❌ Error cancelling order:", error);
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
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg text-center">
      <ToastContainer />

      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

      {isLoading ? (
        <p className="text-gray-600">Loading order details...</p>
      ) : error ? (
        <p className="text-red-600">
          Error fetching order: {error.message || error}
        </p>
      ) : order ? (
        <>
          <div className="mb-4 text-left">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{order.totalAmount}{" "}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </div>

          {/* ✅ Payment Button */}
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all disabled:bg-gray-400"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          {/* ✅ Cancel Order Button */}
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all disabled:bg-gray-400 ml-4"
            onClick={handleCancelOrder}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        </>
      ) : (
        <p className="text-gray-600">
          No pending orders available for payment.
        </p>
      )}
    </div>
  );
};

export default Payment;
