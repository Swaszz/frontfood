import { useParams, Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const Categorypages = () => {
  const { categoryName } = useParams();
  const [menuItems, isLoading] = useFetch(`/menuitem/category/${categoryName}`);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">{categoryName} Menu</h1>
      {isLoading ? (
        <p className="text-center text-lg mt-6">Loading...</p>
      ) : menuItems.length === 0 ? (
        <p className="text-center text-lg mt-6">
          No items found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {menuItems.map((item) => (
            <div key={item._id} className="border p-4 rounded-lg shadow-md">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-black-600">${item.price.toFixed(2)}</p>

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

export default Categorypages;
