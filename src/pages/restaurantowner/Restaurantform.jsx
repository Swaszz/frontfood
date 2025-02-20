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
    <div className="flex flex-col md:flex-row h-screen">
      <ToastContainer />

      <aside className="w-full md:w-1/4 bg-gray-800 text-white p-4">
        <ul>
          <li className="mb-4">
            <Link to="/restaurantowner/createmenu">MenuItem</Link>
          </li>
          <li className="mb-4">
            <Link to="/restaurantowner/createcoupon">Coupons</Link>
          </li>
        </ul>
      </aside>

      <main className="w-full md:w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">Restaurant Management</h1>

        <div className="bg-white p-4 shadow-md rounded mb-6">
          <h2 className="text-lg font-bold mb-2">Add New Restaurant</h2>
          <form onSubmit={addRestaurant} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              className="input input-bordered w-full"
              value={newRestaurant.name}
              onChange={handleNewRestaurantChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="input input-bordered w-full"
              value={newRestaurant.address}
              onChange={handleNewRestaurantChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="input input-bordered w-full"
              value={newRestaurant.phone}
              onChange={handleNewRestaurantChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={newRestaurant.email}
              onChange={handleNewRestaurantChange}
              required
            />
            <button
              className="btn btn-primary col-span-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Restaurant"}
            </button>
          </form>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Restaurants</h2>
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r._id} className="text-center">
                  <td className="border p-2">
                    <input
                      type="text"
                      name="name"
                      value={r.name}
                      onChange={(e) => handleFieldChange(e, r._id)}
                      disabled={editingId !== r._id}
                      className={`input input-bordered w-full ${
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
                      className={`input input-bordered w-full ${
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
                      className={`input input-bordered w-full ${
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
                      className={`input input-bordered w-full ${
                        editingId === r._id ? "border-blue-500" : ""
                      }`}
                    />
                  </td>
                  <td className="border p-2">
                    {editingId === r._id ? (
                      <button
                        className="btn btn-success btn-sm mr-2"
                        onClick={() => handleSave(r._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEdit(r._id)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
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
      </main>
    </div>
  );
};

export default Restaurantform;
