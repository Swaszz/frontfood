import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";

const RestaurantForm = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    restaurantOwner: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/getrestaurant");
      setRestaurants(response.data.data);
    } catch (error) {
      toast.error("Error fetching restaurants");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const addRestaurant = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/restaurant/addrestaurant", restaurant);
      toast.success("✅ Restaurant created successfully!");
      fetchRestaurants();
      setRestaurant({
        name: "",
        address: "",
        phone: "",
        email: "",
        restaurantOwner: "",
      });
    } catch (error) {
      console.error(
        "Error creating restaurant:",
        error.response?.data || error.message
      );
      toast.error("❌ Error saving restaurant details");
    }
  };

  const handleEdit = (restaurant) => {
    setRestaurant(restaurant);
    setEditingId(restaurant._id);
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/restaurant/updaterestaurant/${editingId}`, {
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        email: restaurant.email,
        restaurantOwner: restaurant.restaurantOwner,
      });

      toast.success("Restaurant updated successfully!");
      fetchRestaurants();
      setEditingId(null);
      setRestaurant({
        name: "",
        address: "",
        phone: "",
        email: "",
        restaurantOwner: "",
      });
    } catch (error) {
      console.error(
        "Error updating restaurant:",
        error.response?.data || error.message
      );
      toast.error(" Error updating restaurant");
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      await axiosInstance.delete(`/restaurant/deleterestaurant/${id}`);
      toast.success("Restaurant deleted successfully!");
      fetchRestaurants();
    } catch (error) {
      toast.error("Error deleting restaurant");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-gray-800 text-white p-4">
        <ul>
          <li className="mb-4">
            <Link to="/orders">Orders</Link>
          </li>
          <li className="mb-4">
            <Link to="/menu">Menu</Link>
          </li>
          <li className="mb-4">
            <Link to="/coupons">Coupons</Link>
          </li>
          <li className="mb-4">
            <Link to="/payments">Payments</Link>
          </li>
        </ul>
      </aside>

      <main className="w-full md:w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">Restaurant Management</h1>

        <form
          className="bg-white p-4 shadow-md rounded"
          onSubmit={addRestaurant}
        >
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            className="input input-bordered w-full mb-2"
            value={restaurant.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="input input-bordered w-full mb-2"
            value={restaurant.address}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="input input-bordered w-full mb-2"
            value={restaurant.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full mb-2"
            value={restaurant.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="restaurantOwner"
            placeholder="Restaurant Owner"
            className="input input-bordered w-full mb-2"
            value={restaurant.restaurantOwner}
            onChange={handleInputChange}
            required
          />

          <button className="btn btn-primary w-full" type="submit">
            Create Restaurant
          </button>
        </form>

        {/* ✅ Restaurant List */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Restaurants</h2>
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Owner</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r._id} className="text-center">
                  <td className="border p-2">{r.name}</td>
                  <td className="border p-2">{r.address}</td>
                  <td className="border p-2">{r.phone}</td>
                  <td className="border p-2">{r.email}</td>
                  <td className="border p-2">{r.restaurantOwner || "N/A"}</td>
                  <td className="border p-2">
                    {editingId === r._id ? (
                      <button
                        className="btn btn-success btn-sm mr-2"
                        onClick={handleUpdate}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEdit(r)}
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

export default RestaurantForm;
