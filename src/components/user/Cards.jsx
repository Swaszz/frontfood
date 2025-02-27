import "react";
import { useNavigate } from "react-router-dom";

function MenuCards({ menuItem }) {
  const navigate = useNavigate();

  return (
    <div className="w-full sm:w-80 md:w-96 bg-base-100 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <figure className="w-full h-56">
        <img
          className="w-full h-full object-cover"
          src={menuItem?.image}
          alt={menuItem?.name}
        />
      </figure>

      <div className="p-5 space-y-3">
        <h2 className="text-2xl font-bold text-black-800">{menuItem?.name}</h2>
        <p className="text-lg text-primary font-semibold">₹{menuItem?.price}</p>

        <div className="flex justify-end">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/menuItemDetails/${menuItem?._id}`)}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCards;
