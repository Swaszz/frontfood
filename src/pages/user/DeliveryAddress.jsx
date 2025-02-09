import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../config/axiosInstance";
import useFetch from "../../hooks/useFetch";

function DeliveryAddress() {
  const [addresses, isLoading, error, setAddresses] = useFetch(
    "/delivery/getdelivery"
  );
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingId) {
        response = await axiosInstance.put("/delivery/updatedelivery", {
          addressId: editingId,
          ...form,
        });
        toast.success("Delivery address updated successfully!");
      } else {
        response = await axiosInstance.post("/delivery/adddelivery", form);
        toast.success("Delivery address added successfully!");
      }

      const updatedAddresses = editingId
        ? addresses.map((addr) =>
            addr._id === editingId ? response.data.data : addr
          )
        : [...addresses, response.data.data];
      setAddresses(updatedAddresses);

      setEditingId(null);
      setForm({
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        isDefault: false,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving address");
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await axiosInstance.delete(`/delivery/deletedelivery/${addressId}`);
      toast.success("Delivery address deleted successfully!");

      setAddresses(addresses.filter((addr) => addr._id !== addressId));

      if (selectedAddress && selectedAddress._id === addressId) {
        setSelectedAddress(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting address");
    }
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setForm(address);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address before placing an order.");
      return;
    }
    navigate("/user/order", { state: { selectedAddress } });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4"> Delivery Addresses</h1>

      <ToastContainer />

      <form
        onSubmit={handleSaveAddress}
        className="bg-gray-100 p-4 rounded-md shadow-md"
      >
        <h2 className="text-xl font-semibold mb-3">
          {editingId ? "Edit Address" : "Add New Address"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={form.zipCode}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
        </div>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          />
          <span className="ml-2">Set as Default</span>
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full"
        >
          {editingId ? "Update Address" : "Add Address"}
        </button>
      </form>

      {isLoading && <p>Loading addresses...</p>}
      {error && <p className="text-red-500">Error fetching addresses</p>}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        {addresses?.length === 0 ? (
          <p>No addresses found.</p>
        ) : (
          addresses?.map((addr) => (
            <div
              key={addr._id}
              className={`bg-white p-4 rounded-md shadow-md mt-3 flex justify-between items-center ${
                selectedAddress && selectedAddress._id === addr._id
                  ? "border-2 border-blue-500"
                  : ""
              }`}
              onClick={() => handleSelectAddress(addr)}
            >
              <div>
                <p className="font-semibold">
                  {addr.address}, {addr.city}, {addr.state} - {addr.zipCode},{" "}
                  {addr.country}
                </p>
                {addr.isDefault && (
                  <span className="text-green-600 font-bold">[Default]</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(addr);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(addr._id);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handlePlaceOrder}
        className="bg-green-600 text-white px-6 py-2 rounded mt-6 w-full"
      >
        Place Order
      </button>
    </div>
  );
}

export default DeliveryAddress;
