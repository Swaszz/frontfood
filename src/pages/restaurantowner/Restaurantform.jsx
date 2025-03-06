import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";
import "react-toastify/dist/ReactToastify.css";

const Restaurantform = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/getrestaurant");
      setRestaurants(response.data.data);
    } catch (error) {
      toast.error("Error fetching restaurants.");
    }
  };

  const handleNewRestaurantChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (e, id) => {
    const { name, value } = e.target;
    setRestaurants((prev) =>
      prev.map((r) => (r._id === id ? { ...r, [name]: value } : r))
    );
  };

  const addRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post("/restaurant/addrestaurant", newRestaurant);
      toast.success("Restaurant created successfully!");
      fetchRestaurants();
      setNewRestaurant({ name: "", address: "", phone: "", email: "" });
    } catch (error) {
      toast.error("Error saving restaurant details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    const updatedRestaurant = restaurants.find((r) => r._id === id);
    if (!updatedRestaurant) return;

    try {
      await axiosInstance.put(
        `/restaurant/updaterestaurant/${id}`,
        updatedRestaurant
      );
      toast.success("Restaurant updated successfully!");
      fetchRestaurants();
      setEditingId(null);
    } catch (error) {
      toast.error("Error updating restaurant.");
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      await axiosInstance.delete(`/restaurant/deleterestaurant/${id}`);
      toast.success("Restaurant deleted successfully!");
      fetchRestaurants();
    } catch (error) {
      toast.error("Error deleting restaurant.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-base-100 dark:bg-black transition-all duration-300">
      <ToastContainer />

      <aside className="w-full md:w-1/4 bg-gray-900 dark:bg-gray-800 text-white p-6 md:h-screen sticky top-0">
        <h2 className="text-xl font-bold mb-6 text-center">Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/restaurantowner/createmenu"
              className="hover:text-gray-400 transition"
            >
              Menu Item
            </Link>
          </li>
          <li>
            <Link
              to="/restaurantowner/createcoupon"
              className="hover:text-gray-400 transition"
            >
              Coupons
            </Link>
          </li>
        </ul>
      </aside>

      <main className="w-full md:w-3/4 p-6 flex-grow text-white dark:text-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          Restaurant Management
        </h1>

        <div className="bg-gray-800 dark:bg-gray-900 p-6 shadow-lg rounded-lg mb-8 w-full">
          <h2 className="text-lg font-bold mb-4 text-center md:text-left">
            Add New Restaurant
          </h2>
          <form
            onSubmit={addRestaurant}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
              value={newRestaurant.name}
              onChange={handleNewRestaurantChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
              value={newRestaurant.address}
              onChange={handleNewRestaurantChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
              value={newRestaurant.phone}
              onChange={handleNewRestaurantChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full dark:bg-gray-700 dark:text-white"
              value={newRestaurant.email}
              onChange={handleNewRestaurantChange}
              required
            />
            <button
              className="btn btn-primary col-span-1 md:col-span-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Restaurant"}
            </button>
          </form>
        </div>

        <div className="bg-gray-800 dark:bg-gray-900 p-6 shadow-lg rounded-lg overflow-auto w-full">
          <h2 className="text-xl font-bold mb-4 text-center md:text-left">
            Restaurants
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border text-white">
              <thead>
                <tr className="bg-gray-700 dark:bg-gray-800 text-gray-300">
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Address</th>
                  <th className="border p-3">Phone</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((r) => (
                  <tr key={r._id} className="text-center hover:bg-gray-600">
                    <td className="border p-2">
                      <input
                        type="text"
                        name="name"
                        value={r.name}
                        onChange={(e) => handleFieldChange(e, r._id)}
                        disabled={editingId !== r._id}
                        className={`input input-bordered w-full dark:bg-gray-700 dark:text-white ${
                          editingId === r._id ? "border-blue-500" : ""
                        }`}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="address"
                        value={r.address}
                        onChange={(e) => handleFieldChange(e, r._id)}
                        disabled={editingId !== r._id}
                        className={`input input-bordered w-full dark:bg-gray-700 dark:text-white ${
                          editingId === r._id ? "border-blue-500" : ""
                        }`}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="phone"
                        value={r.phone}
                        onChange={(e) => handleFieldChange(e, r._id)}
                        disabled={editingId !== r._id}
                        className={`input input-bordered w-full dark:bg-gray-700 dark:text-white ${
                          editingId === r._id ? "border-blue-500" : ""
                        }`}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="email"
                        name="email"
                        value={r.email}
                        onChange={(e) => handleFieldChange(e, r._id)}
                        disabled={editingId !== r._id}
                        className={`input input-bordered w-full dark:bg-gray-700 dark:text-white ${
                          editingId === r._id ? "border-blue-500" : ""
                        }`}
                      />
                    </td>
                    <td className="border p-2 flex flex-col md:flex-row gap-2 justify-center">
                      {editingId === r._id ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSave(r._id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(r._id)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => deleteRestaurant(r._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Restaurantform;
