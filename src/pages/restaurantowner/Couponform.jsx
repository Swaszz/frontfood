import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Couponform() {
  const [coupon, setCoupon] = useState({
    code: "",
    discountPercentage: "",
    expirationDate: "",
  });

  const [coupons, setCoupons] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axiosInstance.get("/coupon/get");
        if (response.data?.data) {
          setCoupons(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coupon.code || !coupon.discountPercentage || !coupon.expirationDate) {
      toast.error(" All fields are required!");
      return;
    }

    try {
      if (editMode) {
        await axiosInstance.put(`/coupon/update/${selectedCoupon._id}`, coupon);
        toast.success("Coupon updated successfully!");
      } else {
        await axiosInstance.post("/coupon/create", coupon);
        toast.success("Coupon created successfully!");
      }

      setEditMode(false);
      setSelectedCoupon(null);
      setCoupon({
        code: "",
        discountPercentage: "",
        expirationDate: "",
      });

      const response = await axiosInstance.get("/coupon/get");
      if (response.data?.data) {
        setCoupons(response.data.data);
      }
    } catch (error) {
      console.error("Error saving coupon:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Error saving coupon");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/coupon/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Coupon deleted successfully!");

      setCoupons((prevCoupons) => prevCoupons.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(" Failed to delete coupon.");
    }
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-black transition-all duration-300">
      <ToastContainer />

      {/* Sidebar - Fixed Height on Desktop */}
      <aside className="w-full md:w-1/4 p-6 bg-gray-900 text-white dark:bg-gray-800 shadow-lg sticky top-0 md:h-screen">
        <h2 className="text-xl font-semibold mb-4">Manage</h2>
        <ul className="space-y-3">
          <li>
            <Link
              to="/restaurantowner/addrestaurant"
              className="block hover:text-gray-400"
            >
              Restaurant
            </Link>
          </li>
          <li>
            <Link
              to="/restaurantowner/createmenu"
              className="block hover:text-gray-400"
            >
              Menu Item
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-black transition-colors duration-300 min-h-screen">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
          Manage Your Coupons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coupons List */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-all overflow-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Your Coupons
            </h3>

            {coupons.length > 0 ? (
              coupons.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-300 dark:border-gray-700 p-4 mb-4 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Code:</strong> {item.code}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Discount:</strong> {item.discountPercentage}%
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Expires On:</strong>{" "}
                      {new Date(item.expirationDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                      onClick={() => {
                        setSelectedCoupon(item);
                        setEditMode(true);
                        setCoupon(item);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
                      onClick={() => handleDelete(item._id)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No coupons added yet.
              </p>
            )}
          </div>

          {/* Create/Edit Coupon Form */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-all">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {editMode ? "Edit Coupon" : "Create New Coupon"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="code"
                placeholder="Coupon Code"
                value={coupon.code}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
                required
              />

              <input
                type="number"
                name="discountPercentage"
                placeholder="Discount Percentage"
                value={coupon.discountPercentage}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
                required
              />

              <input
                type="date"
                name="expirationDate"
                value={coupon.expirationDate}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg shadow-md transition-all"
              >
                {editMode ? "Update Coupon" : "Create Coupon"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Couponform;
