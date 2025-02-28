import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/features/userSlice";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

function Profiles() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useFetch("/restaurantowner/profile");
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData?.name || "",
        email: profileData?.email || "",
        address: profileData?.address || "",
        phone: profileData?.phone || "",
        profilePic: profileData?.profilePic || "",
        role: profileData?.role || "",
        password: "",
      });
    }
  }, [profileData]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axiosInstance.get("/restaurantowner/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(" Profile Data Fetched:", response.data);
        setProfileData(response.data.data);
      } catch (err) {
        console.error(" Error Fetching Profile:", err);
        setError(err.response?.data?.message || "Failed to fetch profile");

        if (err.response?.status === 401) {
          console.log(" Unauthorized: Redirecting to login");
          localStorage.removeItem("token");
          dispatch(clearUser());
          navigate("/restaurantowner/login");
        }
      }

      setLoading(false);
    };
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.put(
        "/restaurantowner/updateprofile",
        formData
      );
      if (response.status === 200) {
        setProfileData(response.data.data);
        setFormData(response.data.data);
        setEditMode(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
    setLoading(false);
  };

  const handleLogOut = async () => {
    try {
      const response = await axiosInstance.get("/restaurantowner/logout");
      if (response.status === 200) {
        localStorage.removeItem("token");
        dispatch(clearUser());

        setTimeout(() => {
          navigate("/restaurantowner/login", { replace: true });
        }, 200);
      }
    } catch (error) {
      console.error(" Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-all">
        <div className="flex justify-between mb-6">
          {!editMode ? (
            <button
              className="btn btn-secondary"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              className="btn btn-outline btn-error"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          <img
            src={formData.profilePic}
            className="w-32 h-32 rounded-full shadow-md"
            alt="profile"
          />
          <div className="mt-6 w-full text-left">
            <div className="mb-4">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                Name:
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  className="input input-bordered w-full dark:bg-gray-700"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-lg font-medium">{formData.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                Email:
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="email"
                  className="input input-bordered w-full dark:bg-gray-700"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-lg font-medium">{formData.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                Address:
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  className="input input-bordered w-full dark:bg-gray-700"
                  value={formData.address}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-lg font-medium">{formData.address}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                role:
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="role"
                  className="input input-bordered w-full dark:bg-gray-700"
                  value={formData.role}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-lg font-medium">{formData.role}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">
                Phone:
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="phone"
                  className="input input-bordered w-full dark:bg-gray-700"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-lg font-medium">{formData.phone}</p>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-center gap-4 mt-6">
            {editMode && (
              <button
                className="btn btn-primary w-full sm:w-auto"
                onClick={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
            <button
              className="btn btn-accent w-full sm:w-auto"
              onClick={handleLogOut}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profiles;
