import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const UserOrders = () => {
  const { userId } = useParams();
  const [userOrders, setUserOrders] = useState(null);
  const { isOwnerAuth } = useSelector((state) => state.owner);
  const [loading, setLoading] = useState(true);

  const fetchUserOrders = async () => {
    try {
      const response = await axiosInstance.get(
        `/restaurantowner/getUserOrders/${userId}`
      );
      setUserOrders(response.data);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwnerAuth) {
      fetchUserOrders();
    }
  }, [isOwnerAuth]);

  if (loading) {
    return <p className="text-center text-lg">Loading user orders...</p>;
  }

  if (!userOrders) {
    return (
      <p className="text-center text-lg text-red-500">
        User not found or no orders available.
      </p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{userOrders.name}'s Orders</h1>
      <p>Email: {userOrders.email}</p>
      <p>Phone: {userOrders.phone}</p>
      <p>Delivery Address: {userOrders.deliveryAddress}</p>

      <h3 className="text-lg font-semibold mt-2">Orders:</h3>
      {userOrders.orders && userOrders.orders.length > 0 ? (
        <ul className="list-disc pl-5">
          {userOrders.orders.map((order) => (
            <li key={order.id} className="mb-4 border p-4 rounded-lg shadow-md">
              <div>
                <h3 className="font-medium text-lg mb-2">{order.name}</h3>

                <div className="flex gap-4 flex-wrap">
                  {order.menuItem?.map((item) => (
                    <img
                      key={item.id}
                      src={item.image}
                      alt={item.name || "Product Image"}
                      className="w-16 h-16 rounded-md"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/150")
                      }
                    />
                  ))}
                </div>

                <p>Price: ₹{order.price.toFixed(2)}</p>
                <p>Coupon Applied: {order.coupon || "No"}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders placed.</p>
      )}
    </div>
  );
};

export default UserOrders;
