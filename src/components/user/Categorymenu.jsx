import "react";
import useFetch from "../../hooks/useFetch";
import { Link, useNavigate } from "react-router-dom";
import MenuSkelton from "../../components/shared/Skelton";

const Categorymenu = () => {
  const [category, isLoading] = useFetch("/menuitem/category");
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };
  return (
    <div>
      {isLoading ? (
        <MenuSkelton />
      ) : (
        <div className="container mx-auto   p-4">
          <h2 className="categorytitle text-2xl font-bold text-center mt-19 ">
            What&apos;s in your mind!
          </h2>
          <div className="categoryitem grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-20 gap-4">
            {category.map((category, index) => (
              <div
                key={index}
                className="cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => handleCategoryClick(category._id)}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryCard = ({ category }) => {
  return (
    <div className="flex flex-col items-center gap-1 mt-19">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-lg">
        <img
          src={category.image || "https://via.placeholder.com/100"}
          alt={category._id}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-sm font-semibold mt-2">{category._id}</p>
    </div>
  );
};
export default Categorymenu;
