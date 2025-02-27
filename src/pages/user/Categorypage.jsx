import { useParams, Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const Categorypage = () => {
  const { categoryName } = useParams();
  const [menuItems, isLoading] = useFetch(`/menuitem/category/${categoryName}`);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
        {categoryName} Menu
      </h1>

      {isLoading ? (
        <p className="text-center text-lg mt-6 text-gray-700 dark:text-gray-300">
          Loading...
        </p>
      ) : menuItems.length === 0 ? (
        <p className="text-center text-lg mt-6 text-gray-700 dark:text-gray-300">
          No items found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md bg-white dark:bg-black transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {item.name}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                ₹{item.price.toFixed(2)}
              </p>

              <Link
                to={`/menuitemdetails/${item._id}`}
                className="block text-center mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categorypage;
