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
      <h2 className="text-2xl font-bold mb-4">Order History</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="border rounded-lg shadow-md p-4">
        {orderHistory.length === 0 ? (
          <p>No previous orders found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border p-2">{order._id}</td>
                  <td className="border p-2">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border p-2">
                    {order.totalPrice || order.totalAmount
                      ? `$${(order.totalPrice || order.totalAmount).toFixed(2)}`
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
