import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../redux/features/DeliverySlice";
import { fetchCart } from "../../redux/features/CartSlice";
import { setOrder } from "../../redux/features/orderSlice";
import "react-toastify/dist/ReactToastify.css";
//import { saveSelectedAddress } from "../../Utils/Orderutils";

function DeliveryAddress() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderState = useSelector((state) => state.order);
  const { addresses, isLoading, error } = useSelector(
    (state) => state.delivery
  );
  const { cart } = useSelector((state) => state.cart);

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCart());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateAddress({ addressId: editingId, form })).unwrap();
        toast.success("Address updated successfully!");
      } else {
        await dispatch(addAddress(form)).unwrap();
        toast.success("Address added successfully!");
      }
      setForm({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        isDefault: false,
      });
      setEditingId(null);
      dispatch(fetchAddresses());
    } catch (error) {
      toast.error(error || "Error saving address");
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error(error || "Error deleting address");
    }
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setForm({ ...address });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false,
    });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  useEffect(() => {
    console.log(" Watching Redux order state updates...", orderState.order);

    if (
      orderState?.order?.orderItems &&
      orderState.order.orderItems.length > 0
    ) {
      console.log(" Order is set, Navigating to Order Page...");
      navigate("/user/order");
    } else {
      console.warn("Order items are still empty, waiting for update...");
    }
  }, [orderState?.order?.orderItems?.length, navigate]);
  const handleDeliverToThisAddress = async () => {
    console.log(" Checking Cart Data Before Navigation:", cart);

    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      console.error("No items found in cart:", cart);
      toast.error("No items in the cart to proceed.");
      return;
    }

    await dispatch(
      setOrder({
        orderItems: cart.cartItems,
        totalAmount: cart.totalAmount,
        discountAmount: cart.discountAmount || 0,
        appliedCoupon: cart.appliedCoupon,
        deliveryAddress: selectedAddress,
      })
    );

    console.log(" Waiting for Redux to update...");
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-black-800 mb-6 text-center">
        Delivery Addresses
      </h1>

      <form
        onSubmit={handleSaveAddress}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Address" : "Add New Address"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={form.street}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={form.zipCode}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
            className="p-3 border rounded-lg w-full"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full transition"
          >
            {editingId ? "Update Address" : "Add Address"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md w-full transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-black-800 mb-4">
            Saved Addresses
          </h2>
          {addresses.length === 0 ? (
            <p className="text-center text-gray-500">No addresses found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer ${
                    selectedAddress?._id === addr._id
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <p className="font-semibold text-gray-700">
                    {addr.street}, {addr.city}, {addr.state} - {addr.zipCode},{" "}
                    {addr.country}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(addr);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr._id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleDeliverToThisAddress}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md mt-6 w-full transition"
      >
        Deliver to this Address
      </button>
    </div>
  );
}

export default DeliveryAddress;
