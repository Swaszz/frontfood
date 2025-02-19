import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import useFetch from "../hooks/useFetch"; // Custom hook to fetch data
import axiosInstance from "../config/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const [order, isLoading, error] = useFetch("/user/orders/latest"); // Fetch latest pending order
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!order) {
      toast.error("No pending orders available for payment.");
      return;
    }

    setLoading(true);

    try {
      const stripe = await stripePromise;

      // Call backend to create Stripe checkout session
      const response = await axiosInstance.post(
        "/user/payment/create-checkout-session",
        {
          orderId: order._id,
        }
      );

      if (response.data.sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });

        if (error) {
          console.error("Stripe Checkout Error:", error);
          toast.error("Failed to process payment.");
        }
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("An error occurred while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg text-center">
      <ToastContainer />

      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

      {isLoading ? (
        <p className="text-gray-600">Loading order details...</p>
      ) : error ? (
        <p className="text-red-600">Error fetching order: {error.message}</p>
      ) : order ? (
        <>
          <div className="mb-4 text-left">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{order.totalPrice}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all disabled:bg-gray-400"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
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
