import "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import MenuSkelton from "../../components/shared/Skelton";
import { useDispatch } from "react-redux";
import { addItemToCart, setCart } from "../../redux/features/CartSlice";
import { useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";

function MenuitemDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [MenuItemDetails, isLoading] = useFetch(
    `/menuitem/getmenudetails/${id}`
  );

  useEffect(() => {
    console.log("MenuItemDetails:", MenuItemDetails || "No Data");
  }, [MenuItemDetails]);

  const handleAddToCart = async (menuItemId, quantity) => {
    if (!menuItemId) {
      console.error("Error: MenuItem ID is undefined!");
      return;
    }

    try {
      console.log("Attempting to add item to cart:", {
        menuItemId,
        quantity,
      });

      const response = await axiosInstance.post("/cart/addcart", {
        menuItemId,
        quantity: Number(quantity),
      });

      console.log("API Response:", response);

      if (response.data && response.data.data) {
        dispatch(setCart(response.data.data));
        dispatch(addItemToCart(response.data.data));

        console.log("Item added to cart:", response.data.data);

        const updatedCartResponse = await axiosInstance.get("/cart/getcart");

        if (updatedCartResponse.data && updatedCartResponse.data.data) {
          dispatch(setCart(updatedCartResponse.data.data));
        } else {
          console.error(
            "Error: Cart response is undefined or incorrect structure:",
            updatedCartResponse
          );
        }

        navigate("/user/cart");
      } else {
        console.error(
          " API Response does not contain expected data:",
          response
        );
      }
    } catch (error) {
      console.error(
        " Error adding item to cart:",
        error?.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      {isLoading ? (
        <MenuSkelton />
      ) : (
        <div className="max-w-5xl w-full bg-base-100 rounded-lg shadow-lg overflow-hidden">
          <h1 className="text-3xl font-bold text-center text-primary py-6">
            Menu Item Details
          </h1>

          <div className="flex flex-col lg:flex-row items-center gap-8 p-6">
            <div className="w-full lg:w-1/2">
              <img
                src={MenuItemDetails?.image}
                alt={MenuItemDetails?.name}
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
            </div>

            <div className="w-full lg:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold text-black-800">
                {MenuItemDetails?.name}
              </h2>
              <p className="text-black-600">{MenuItemDetails?.description}</p>
              <p className="text-lg font-semibold text-primary">
                ₹{MenuItemDetails?.price}
              </p>
              <p className="text-black-700">
                Category: {MenuItemDetails?.category}
              </p>
              <p className="text-black-700">
                Restaurant: {MenuItemDetails?.restaurantId?.name || "Unknown"}
              </p>

              <button
                className="btn btn-primary w-full mt-4"
                onClick={() => handleAddToCart(MenuItemDetails?._id, 1)}
                disabled={isLoading || !MenuItemDetails?._id}
              >
                {isLoading ? "Loading..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuitemDetails;
