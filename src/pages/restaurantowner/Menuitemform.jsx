import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

function Menuitemform() {
  const [menuItem, setMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availability: true,
    restaurantName: "",
    image: null,
  });

  const [menuItems, setMenuItems] = useState([]); // ✅ Store menu items for this restaurant only
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null); // ✅ Store restaurantId for API

  // ✅ Fetch the logged-in restaurant's details
  useEffect(() => {
    const fetchRestaurantMenu = async () => {
      try {
        const res = await axiosInstance.get("/restaurant/getrestaurant");
        if (res.data?.data) {
          const id = res.data.data._id;
          setRestaurantId(id);

          setMenuItem((prev) => ({
            ...prev,
            restaurantName: res.data.data.name, // Pre-fill restaurant name
          }));

          if (id) {
            const menuResponse = await axiosInstance.get(
              `/menuitem/getmenu/${id}`
            );
            if (menuResponse.data?.data) {
              setMenuItems(menuResponse.data.data);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchRestaurantMenu();
  }, []);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Selection
  const handleFileChange = (e) => {
    setMenuItem({ ...menuItem, image: e.target.files[0] });
  };

  // ✅ Handle Create or Update Menu Item
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!restaurantId) {
      toast.error("❌ Error: Restaurant ID is missing!");
      return;
    }

    const formData = new FormData();
    Object.keys(menuItem).forEach((key) => {
      if (menuItem[key] !== null) {
        formData.append(key, menuItem[key]);
      }
    });

    formData.append("restaurantId", restaurantId); // ✅ Ensure restaurantId is included

    try {
      if (editMode) {
        await axiosInstance.put(
          `/menuitem/updatemenu/${menuItem._id}`,
          formData
        );
        toast.success("✅ Menu item updated successfully!");
      } else {
        await axiosInstance.post("/menuitem/createmenu", formData);
        toast.success("✅ Menu item created successfully!");
      }

      setEditMode(false);
      setSelectedItem(null);
      setMenuItem({
        name: "",
        description: "",
        price: "",
        category: "",
        availability: true,
        restaurantName: menuItem.restaurantName,
        image: null,
      });

      // ✅ Refresh menu items list
      const menuResponse = await axiosInstance.get(
        `/menuitem/getmenu/${restaurantId}`
      );
      if (menuResponse.data?.data) {
        setMenuItems(menuResponse.data.data);
      }
    } catch (error) {
      console.error(
        "❌ Error saving menu item:",
        error.response?.data || error
      );
      toast.error(error.response?.data?.message || "❌ Error saving menu item");
    }
  };

  // ✅ Handle Delete Menu Item
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/menuitem/deletemenu/${id}`);
      toast.success("✅ Menu item deleted successfully!");

      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("❌ Error deleting menu item:", error);
      toast.error("❌ Failed to delete menu item.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Manage Your Menu Items
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Left Box: Fetched Menu Items */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Your Menu Items</h3>

          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div
                key={item._id}
                className="border p-4 mb-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Name:</strong> {item.name}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p>
                    <strong>Price:</strong> ${item.price}
                  </p>
                  <p>
                    <strong>Availability:</strong>{" "}
                    {item.availability ? "✅ Available" : "❌ Not Available"}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedItem(item);
                      setEditMode(true);
                      setMenuItem(item);
                    }}
                  >
                    Edit ✏️
                  </button>
                  <button
                    type="button"
                    className="btn btn-error"
                    onClick={() => handleDelete(item._id)}
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No menu items added yet.</p>
          )}
        </div>

        {/* ✅ Right Box: Create/Edit Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editMode ? "Edit Menu Item" : "Create New Menu Item"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Menu Item Name"
              value={menuItem.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={menuItem.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={menuItem.price}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={menuItem.category}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              type="text"
              name="restaurantName"
              placeholder="Restaurant Name"
              value={menuItem.restaurantName}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="availability"
                checked={menuItem.availability}
                onChange={(e) =>
                  setMenuItem({ ...menuItem, availability: e.target.checked })
                }
              />
              <span>Available</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />

            <button type="submit" className="btn btn-primary w-full">
              {editMode ? "Update Menu Item" : "Create Menu Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Menuitemform;
