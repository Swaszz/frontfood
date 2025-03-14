import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import { useSelector } from "react-redux";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { isOwnerAuth } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOwnerAuth) {
      fetchUsers();
    }
  }, [isOwnerAuth]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/restaurantowner/getUsers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="border p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
              onClick={() =>
                navigate(`/restaurantowner/getUserOrders/${user.id}`)
              }
            >
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
              <p>Address: {user.deliveryAddress}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;
