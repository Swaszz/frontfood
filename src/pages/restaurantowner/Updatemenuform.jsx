import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";
import "react-toastify/dist/ReactToastify.css";

function UpdateMenuform() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenuItem();
  }, []);

  const fetchMenuItem = async () => {
    try {
      const response = await axiosInstance.get(
        `/menuitem/getmenudetails/${id}`
      );
      setMenuItem(response.data.data);
    } catch (error) {
      toast.error("Error fetching menu item.");
    }
  };

  const handleChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setMenuItem({ ...menuItem, image: imageUrl });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/menuitem/updatemenu/${id}`,
        menuItem
      );
      toast.success("Menu item updated successfully!");
      navigate("/restaurantowner/selectmenu");
    } catch (error) {
      toast.error("Error updating menu item.");
    } finally {
      setLoading(false);
    }
  };

  if (!menuItem) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Menu Item</h2>

      <div className="mb-4">
        <img
          src={menuItem.image || "/placeholder.jpg"}
          alt="Preview"
          className="w-full rounded-lg"
        />
        <input
          type="file"
          onChange={handleImageUpload}
          className="file-input w-full mt-2"
        />
      </div>

      <input
        type="text"
        name="name"
        value={menuItem.name}
        onChange={handleChange}
        className="input input-bordered w-full"
      />
      <input
        type="text"
        name="description"
        value={menuItem.description}
        onChange={handleChange}
        className="input input-bordered w-full"
      />
      <input
        type="number"
        name="price"
        value={menuItem.price}
        onChange={handleChange}
        className="input input-bordered w-full"
      />

      <button
        className="btn btn-success w-full mt-4"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export default UpdateMenuform;
