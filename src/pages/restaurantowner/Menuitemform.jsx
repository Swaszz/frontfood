import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
function Menuitemform() {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availability: true,
    restaurantId: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

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

  const handleChange = (e) => {
    setMenuData({ ...menuData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", menuData.name);
      formData.append("description", menuData.description);
      formData.append("price", menuData.price);
      formData.append("category", menuData.category);
      formData.append("availability", menuData.availability);
      formData.append("restaurantId", menuData.restaurantId);

      if (image) {
        formData.append("image", image);
      }

      await axiosInstance.post("/menuitem/createmenu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(" Menu item created successfully!");
      setMenuData({
        name: "",
        description: "",
        price: "",
        category: "",
        availability: true,
        restaurantId: "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error creating menu item:", error);
      toast.error(error.response?.data?.message || "Error creating menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen transition-all duration-300">
      <ToastContainer />

      <aside className="w-full md:w-1/4 p-6 bg-gray-900 text-white dark:bg-gray-800 shadow-lg">
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
              to="/restaurantowner/createcoupon"
              className="block hover:text-gray-400"
            >
              Coupons
            </Link>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-6 bg-gray-50 dark:bg-black transition-colors duration-300 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
            Create New Menu Item
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={menuData.name}
                onChange={handleChange}
                required
                className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={menuData.description}
                onChange={handleChange}
                required
                className="textarea textarea-bordered w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={menuData.price}
                onChange={handleChange}
                required
                className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={menuData.category}
                onChange={handleChange}
                required
                className="input input-bordered w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Available
              </label>
              <input
                type="checkbox"
                name="availability"
                checked={menuData.availability}
                onChange={(e) =>
                  handleChange({
                    target: { name: "availability", value: e.target.checked },
                  })
                }
                className="checkbox"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Restaurant
              </label>
              <select
                name="restaurantId"
                value={menuData.restaurantId}
                onChange={handleChange}
                required
                className="select select-bordered w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Image
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="file-input w-full bg-gray-200 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg shadow-md transition-all"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Menu Item"}
              </button>
              <button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow-md transition-all"
                onClick={() => navigate("/restaurantowner/selectmenu")}
              >
                ✏️ Edit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Menuitemform;
