import { useNavigate } from "react-router-dom";

import { XCircle } from "lucide-react";

function Paymentcancel() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-200">
        <XCircle className="text-error w-16 h-16 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800">
          Payment Failed!
        </h1>
        <p className="text-gray-600 mt-2">
          Something went wrong with your payment.
        </p>
        <button
          className="mt-6 btn btn-error"
          onClick={() => navigate("/order")}
        >
          OK
        </button>
      </div>
    </div>
  );
}
export default Paymentcancel;
