import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import {
  createPaymentSession,
  clearError,
} from "../../redux/features/PaymentSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const { loading, error, paymentSession } = useSelector(
    (state) => state.payment
  );

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_Publishable_key);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;

      const paymentData = {
        products: [{ name: "Pizza", price: 10, quantity: 1 }],
      };

      const result = await dispatch(createPaymentSession(paymentData)).unwrap();

      if (result.sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: result.sessionId,
        });

        if (error) {
          console.error("Stripe Checkout Error:", error);
          toast.error("Failed to process payment.");
        }
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("An error occurred while processing payment.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Make Payment"}
      </button>
    </div>
  );
};

export default Payment;
