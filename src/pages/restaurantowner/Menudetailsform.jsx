import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import "react-toastify/dist/ReactToastify.css";

function Menudetailsform() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

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

  const fetchMenuItemsByRestaurantId = async (restaurantId) => {
    if (!restaurantId) return;
    try {
      console.log("Fetching menu items for restaurantId:", restaurantId);
      const response = await axiosInstance.get(
        `/menuitem/menubyrestaurant/${restaurantId}`
      );
      console.log("Menu Items Response:", response.data);
      setMenuItems(response.data.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Error fetching menu items.");
      setMenuItems([]);
    }
  };

  const handleRestaurantChange = (e) => {
    const restaurantId = e.target.value;
    setSelectedRestaurant(restaurantId);
    fetchMenuItemsByRestaurantId(restaurantId);
  };

  const deleteMenuItem = async (id) => {
    try {
      await axiosInstance.delete(`/menuitem/deletemenu/${id}`);
      toast.success("Menu item deleted successfully!");
      fetchMenuItemsByRestaurantId(selectedRestaurant);
    } catch (error) {
      toast.error("Error deleting menu item.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen transition-all duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 p-6 bg-gray-900 text-white dark:bg-gray-800 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Manage</h2>
        <ul className="space-y-3">
          <li>
            <a
              href="/restaurantowner/addrestaurant"
              className="block hover:text-gray-400"
            >
              Restaurant
            </a>
          </li>
          <li>
            <a
              href="/restaurantowner/createmenu"
              className="block hover:text-gray-400"
            >
              Menu Item
            </a>
          </li>
          <li>
            <a
              href="/restaurantowner/createcoupon"
              className="block hover:text-gray-400"
            >
              Coupon
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 dark:bg-black transition-colors duration-300">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
            Manage Menu Items
          </h2>

          {/* Select Restaurant */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Restaurant
            </label>
            <select
              onChange={handleRestaurantChange}
              className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white focus:ring focus:ring-green-500"
            >
              <option value="">Select a Restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Menu Items */}
          {selectedRestaurant && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                Menu Items
              </h2>
              {menuItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
                        <th className="border p-3">Image</th>
                        <th className="border p-3">Name</th>
                        <th className="border p-3">Price</th>
                        <th className="border p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item) => (
                        <tr
                          key={item._id}
                          className="text-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <td className="border p-3">
                            <img
                              src={item.image || "/placeholder.jpg"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </td>
                          <td className="border p-3 text-gray-800 dark:text-white">
                            {item.name}
                          </td>
                          <td className="border p-3 text-gray-800 dark:text-white">
                            ₹{item.price}
                          </td>
                          <td className="border p-3 flex justify-center space-x-2">
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
                              onClick={() =>
                                navigate(
                                  `/restaurantowner/updatemenu/${item._id}`
                                )
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
                              onClick={() => deleteMenuItem(item._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 mt-2 text-center">
                  No menu items available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Menudetailsform;
