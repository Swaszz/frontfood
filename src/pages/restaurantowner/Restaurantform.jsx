import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";

const Restaurantform = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    restaurantOwner: "",
  });

  const [restaurantId, setRestaurantId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axiosInstance.get("/restaurant/getrestaurant");
        if (response.data?.data) {
          setRestaurant({
            ...response.data.data,
            restaurantOwner: response.data.data.restaurantownerId?.name || "",
          });
          setRestaurantId(response.data.data._id);
          toast.info("✅ Restaurant details loaded.", { autoClose: 1500 });
        }
      } catch (error) {
        console.log("No restaurant found. Showing Create Form");
      }
      setLoading(false);
    };

    fetchRestaurant();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setRestaurant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Create Restaurant
  const addRestaurant = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/restaurant/addrestaurant", {
        ...restaurant,
        restaurantOwner: restaurant.restaurantOwner,
      });

      setRestaurantId(response.data.data._id);
      setRestaurant(response.data.data);
      toast.success("✅ Restaurant created successfully!", { autoClose: 1500 });
    } catch (error) {
      toast.error("❌ Error saving restaurant details", { autoClose: 2000 });
    }
  };

  // ✅ Update Restaurant
  const updateRestaurant = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/restaurant/updaterestaurant/${restaurantId}`, {
        ...restaurant,
        restaurantOwner: restaurant.restaurantOwner,
      });

      toast.success("✅ Restaurant updated successfully!", { autoClose: 1500 });
      setEditMode(false);
    } catch (error) {
      toast.error("❌ Error updating restaurant details", { autoClose: 2000 });
    }
  };

  // ✅ Delete Restaurant
  const deleteRestaurant = async () => {
    try {
      await axiosInstance.delete(
        `/restaurant/deleterestaurant/${restaurantId}`
      );
      setRestaurant({
        name: "",
        address: "",
        phone: "",
        email: "",
        restaurantOwner: "",
      });
      setRestaurantId(null);
      toast.success("✅ Restaurant deleted successfully!", { autoClose: 1500 });
    } catch (error) {
      toast.error("❌ Error deleting restaurant", { autoClose: 2000 });
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

      {/* Main Content */}
      <main className="w-full md:w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">Restaurant Management</h1>

        {/* ✅ "Create Restaurant" Form */}
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
            placeholder="Restaurant Owner Name"
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
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Restaurant Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurantId && (
                <tr>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.address}</td>
                  <td>{restaurant.phone}</td>
                  <td>{restaurant.email}</td>
                  <td>{restaurant.restaurantOwner}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </button>
                    {editMode && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={updateRestaurant}
                      >
                        Save Changes
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm ml-2"
                      onClick={deleteRestaurant}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Restaurantform;
