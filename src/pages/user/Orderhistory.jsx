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

  const sortedOrders = [...orderHistory].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
        Order History
      </h2>

      {loading && <p className="text-center">Loading orders...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="border rounded-lg shadow-md p-4 overflow-x-auto">
        {sortedOrders.length > 0 ? (
          <div className="w-full">
            <table className="w-full border-collapse border border-gray-200 min-w-[400px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Order Items</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order._id} className="text-center hover:bg-gray-50">
                    <td className="border p-2 flex flex-wrap justify-center gap-2">
                      {order.menuItems && order.menuItems.length > 0 ? (
                        order.menuItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex flex-col items-center"
                          >
                            <img
                              src={
                                item.image || "https://via.placeholder.com/100"
                              }
                              alt={item.name}
                              className="w-12 h-12 rounded-md"
                            />
                            <span className="text-sm">
                              {item.name} (x{item.quantity})
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500">No items found</span>
                      )}
                    </td>

                    <td className="border p-2">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="border p-2 font-semibold">
                      {order.totalAmount && !isNaN(order.totalAmount)
                        ? `₹${order.totalAmount.toFixed(2)}`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No previous orders found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
