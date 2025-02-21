import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
function Paymentsuccess() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-200">
        <CheckCircle className="text-success w-16 h-16 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mt-2">Thank you for your purchase.</p>
        <button className="mt-6 btn btn-primary" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Paymentsuccess;
