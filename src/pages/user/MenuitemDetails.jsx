import "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import MenuSkelton from "../../components/shared/Skelton";
import { useDispatch } from "react-redux";
import { setCartDetails } from "../../redux/features/CartSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
function MenuitemDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  console.log("Restaurant ID:", restaurantId);

  const [MenuItemDetails, isLoading] = useFetch(
    `/menuitem/getmenudetails/${id}`
  );

  useEffect(() => {
    console.log("MenuItemDetails:", MenuItemDetails || "No Data");
    console.log("isLoading:", isLoading);
  }, [MenuItemDetails, isLoading]);

  const handleAddToCart = async (menuItemId, quantity) => {
    if (!menuItemId) {
      console.error(" Error: MenuItem ID is undefined!");
      return;
    }

    try {
      console.log("Adding item to cart:", { menuItemId, quantity });

      const response = await axiosInstance.post("/cart/addcart", {
        menuItemId,
        quantity: Number(quantity),
      });

      console.log("✅ Cart updated successfully:", response.data);

      if (!response.data.cartItems) {
        console.error("ERROR: cartItems missing in response:", response.data);
        throw new Error("Invalid response: cart data is missing");
      }

      const updatedCartResponse = await axiosInstance.get("/cart");

      dispatch(setCartDetails(updatedCartResponse.data));

      navigate("/user/cart");
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error?.response?.data || error.message
      );
      console.log("Error adding to cart! Check console for details.");
    }
  };

  return (
    <div>
      {isLoading ? (
        <MenuSkelton />
      ) : (
        <div>
          <section>
            <h1 className="text-3xl font-bold text-center text-primary mb-6">
              MenuItem Details
            </h1>
          </section>

          <section className="menu-item-container">
            <figure>
              <img
                className="card-images"
                src={MenuItemDetails?.image}
                alt="Shoes"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{MenuItemDetails?.name}</h2>
              <p className="description">{MenuItemDetails?.description}</p>
              <p className="card-price">{MenuItemDetails?.price}</p>
              <p className="card-category">{MenuItemDetails?.category}</p>
              <p className="card-restaurant">
                Restaurant: {MenuItemDetails?.restaurantId?.name || "Unknown"}
              </p>
              <p className="card-rating">
                Restaurant Rating: {MenuItemDetails?.restaurantRating}
              </p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary mt-2 w-full"
                  onClick={() => {
                    if (MenuItemDetails?._id) {
                      handleAddToCart(MenuItemDetails._id, 1);
                    } else {
                      console.error("Error: MenuItem ID is undefined");
                    }
                  }}
                  disabled={isLoading || !MenuItemDetails?._id}
                >
                  {isLoading ? "Loading..." : "Add to Cart "}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default MenuitemDetails;
