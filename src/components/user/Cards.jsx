import "react";
import { useNavigate } from "react-router-dom";

function MenuCards({ menuItem }) {
  console.log("response====", menuItem);
  const navigate = useNavigate();
  return (
    <div className="cardbox">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure>
          <img className="card-image" src={menuItem?.image} alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{menuItem?.name}</h2>
          <p className="card-price">{menuItem?.price}</p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/menuItemDetails/${menuItem?._id}`)}
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuCards;
