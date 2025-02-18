import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { clearError } from "../../redux/features/PaymentSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart); // Fetch items from Redux store
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(clearError()); // Clear errors when component mounts
  }, [dispatch]);

  const handlePayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const stripe = await stripePromise;

      const items = cartItems.map((item) => ({
        menuItemId: { name: item.name, price: item.price, image: item.image },
        quantity: item.quantity,
      }));

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Ensure authentication
          body: JSON.stringify({ items }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment session");
      }

      const result = await response.json();

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all disabled:bg-gray-400"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Make Payment"}
      </button>
    </div>
  );
};

export default Payment;
