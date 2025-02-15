import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Restaurantform() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [restaurantId, setRestaurantId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Restaurant Details for Logged-in Owner
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axiosInstance.get("/restaurant/getrestaurant");
        if (response.data?.data) {
          setRestaurant(response.data.data);
          setRestaurantId(response.data.data._id);
          toast.info("✅ Your restaurant details loaded.", { autoClose: 1500 });
        }
      } catch (error) {
        console.log("No restaurant found. Showing Create Form");
      }
      setLoading(false);
    };

    fetchRestaurant();
  }, []);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  // ✅ Handle Create Restaurant (Only If No Restaurant Exists)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (restaurantId) {
      toast.warning("⚠️ You already have a restaurant. Please edit it.", {
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/restaurant/addrestaurant",
        restaurant
      );
      setRestaurant(response.data.data);
      setRestaurantId(response.data.data._id);
      setEditMode(false);
      toast.success("✅ Restaurant created successfully!", { autoClose: 1500 });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Error saving restaurant details",
        { autoClose: 2000 }
      );
    }
  };

  // ✅ Handle Update Restaurant (After Editing)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        `/restaurant/updaterestaurant/${restaurantId}`,
        restaurant
      );
      setEditMode(false); // ✅ Stays on the same page instead of redirecting
      toast.success("✅ Restaurant updated successfully!", { autoClose: 1500 });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Error updating restaurant details",
        { autoClose: 2000 }
      );
    }
  };

  // ✅ Handle Navigation to Create Menu (Can Go Anytime)
  const handleNext = () => {
    navigate(`/restaurantowner/createmenu`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Manage Your Restaurant
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Right Box: Create Restaurant Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Create Your Restaurant</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              value={restaurant.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Restaurant Address"
              value={restaurant.address}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={restaurant.phone}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Restaurant Email"
              value={restaurant.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            {/* ✅ Create Restaurant Button */}
            <button type="submit" className="btn btn-primary w-full">
              Create Restaurant
            </button>
          </form>
        </div>

        {/* ✅ Left Box: Restaurant Details */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {restaurantId ? "Your Restaurant Details" : "No Restaurant Found"}
          </h3>

          {restaurantId ? (
            <div>
              <p>
                <strong>Name:</strong> {restaurant.name}
              </p>
              <p>
                <strong>Address:</strong> {restaurant.address}
              </p>
              <p>
                <strong>Phone:</strong> {restaurant.phone}
              </p>
              <p>
                <strong>Email:</strong> {restaurant.email}
              </p>

              {editMode ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Restaurant Name"
                    value={restaurant.name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Restaurant Address"
                    value={restaurant.address}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={restaurant.phone}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Restaurant Email"
                    value={restaurant.email}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />

                  <button type="submit" className="btn btn-success w-full">
                    Done ✅ Save Changes
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary w-full mt-2"
                  onClick={() => setEditMode(true)}
                >
                  Edit ✏️ Restaurant
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No restaurant added yet.</p>
          )}
        </div>
      </div>

      {/* ✅ Bottom: Next Button (Always Visible) */}
      <div className="flex justify-center mt-6">
        <button type="button" className="btn btn-accent" onClick={handleNext}>
          Next ➡ Create Menu
        </button>
      </div>
    </div>
  );
}

export default Restaurantform;
