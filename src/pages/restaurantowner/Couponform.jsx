import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

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
      toast.error("❌ All fields are required!");
      return;
    }

    try {
      if (editMode) {
        await axiosInstance.put(`/coupon/update/${selectedCoupon._id}`, coupon);
        toast.success("✅ Coupon updated successfully!");
      } else {
        await axiosInstance.post("/coupon/create", coupon);
        toast.success("✅ Coupon created successfully!");
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
      console.error("❌ Error saving coupon:", error.response?.data || error);
      toast.error(error.response?.data?.message || "❌ Error saving coupon");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/coupon/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("✅ Coupon deleted successfully!");

      setCoupons((prevCoupons) => prevCoupons.filter((c) => c._id !== id));
    } catch (error) {
      console.error("❌ Error deleting coupon:", error);
      toast.error("❌ Failed to delete coupon.");
    }
  };
  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Manage Your Coupons
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Your Coupons</h3>

          {coupons.length > 0 ? (
            coupons.map((item) => (
              <div
                key={item._id}
                className="border p-4 mb-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Code:</strong> {item.code}
                  </p>
                  <p>
                    <strong>Discount:</strong> {item.discountPercentage}%
                  </p>
                  <p>
                    <strong>Expires On:</strong>{" "}
                    {new Date(item.expirationDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedCoupon(item);
                      setEditMode(true);
                      setCoupon(item);
                    }}
                  >
                    Edit ✏️
                  </button>
                  <button
                    type="button"
                    className="btn btn-error"
                    onClick={() => handleDelete(item._id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No coupons added yet.</p>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editMode ? "Edit Coupon" : "Create New Coupon"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="code"
              placeholder="Coupon Code"
              value={coupon.code}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              type="number"
              name="discountPercentage"
              placeholder="Discount Percentage"
              value={coupon.discountPercentage}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              type="date"
              name="expirationDate"
              value={coupon.expirationDate}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <button type="submit" className="btn btn-primary w-full">
              {editMode ? "Update Coupon" : "Create Coupon"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Couponform;
