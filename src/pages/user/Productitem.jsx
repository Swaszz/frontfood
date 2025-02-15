import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";

function ProductItem() {
  const { query } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          `/menuitem/search?query=${query}&searchBy=name,restaurant,description`
        );
        setMenuItems(response.data.data);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Error loading menu items");
      }

      setLoading(false);
    };

    fetchMenuItems();
  }, [query]);

  if (loading)
    return <p className="text-center text-lg">Loading menu items...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!menuItems.length)
    return <p className="text-center text-gray-600">No menu items found</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
        Search Results for &quot;{query}&quot;
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-gray-800 truncate">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {item.description.slice(0, 60)}...
              </p>
              <p className="text-lg font-bold text-primary">${item.price}</p>
              <p className="text-gray-700 text-sm">
                Restaurant: {item.restaurant}
              </p>

              <button
                className="mt-3 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-200"
                onClick={() => navigate(`/menuItemDetails/${item._id}`)}
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductItem;
