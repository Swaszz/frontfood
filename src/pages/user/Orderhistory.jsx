import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "../../redux/features/OrderSlice";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orderHistory, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    console.log("Fetching Order History...");
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  console.log("Order History Fetched:", orderHistory);

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
        Order History
      </h2>

      {loading && <p className="text-center">Loading orders...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="border rounded-lg shadow-md p-4 overflow-x-auto">
        {orderHistory.length === 0 ? (
          <p className="text-center">No previous orders found.</p>
        ) : (
          <div className="w-full">
            <table className="w-full border-collapse border border-gray-200 min-w-[400px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((order) => (
                  <tr key={order._id} className="text-center hover:bg-gray-50">
                    <td className="border p-2">{order._id}</td>
                    <td className="border p-2">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="border p-2 font-semibold">
                      {order.totalPrice || order.totalAmount
                        ? `₹${(order.totalPrice || order.totalAmount).toFixed(
                            2
                          )}`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
