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

        console.log("✅ Profile Data Fetched:", response.data);
        setProfileData(response.data.data);
      } catch (err) {
        console.error("❌ Error Fetching Profile:", err);
        setError(err.response?.data?.message || "Failed to fetch profile");

        if (err.response?.status === 401) {
          console.log("❌ Unauthorized: Redirecting to login");
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
          navigate("/restaurantowner/login", { replace: true }); // ✅ Corrected Navigation
        }, 200);
      }
    } catch (error) {
      console.error("❌ Logout failed:", error.response?.data || error.message);
    }
  };
  return (
    <div>
      <div>
        <section>
          <div className="flex">
            {!editMode ? (
              <button
                className="btn btn-secondary mr-auto"
                onClick={() => setEditMode(true)}
              >
                EDIT
              </button>
            ) : (
              <button
                className="btn btn-secondary ml-auto"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            )}
          </div>
          <div className="flex flex-col items-center text-center mt-6">
            <img
              src={formData.profilePic}
              className="w-40 h-40 rounded-full"
              alt="profileImage"
            />
            <div className="mt-4 text-left">
              <p className="mt-4 text-xl font-semibold">
                <span className="font-semibold">Name:</span>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  formData.name
                )}
              </p>
              <p className="mt-4 text-xl font-semibold">
                <span className="font-semibold">Email:</span>
                {editMode ? (
                  <input
                    type="text"
                    name="email"
                    className="input input-bordered w-full"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  formData.email
                )}
              </p>
              <p className="mt-4 text-xl font-semibold">
                <span className="font-semibold">Address:</span>
                {editMode ? (
                  <input
                    type="text"
                    name="address"
                    className="input input-bordered w-full"
                    value={formData.address}
                    onChange={handleChange}
                  />
                ) : (
                  formData.address
                )}
              </p>
              <p className="mt-4 text-xl font-semibold">
                <span className="font-semibold">Phone:</span>
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    className="input input-bordered w-full"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  formData.phone
                )}
              </p>
            </div>
            {editMode && (
              <button
                className="btn btn-primary mt-4 w-40"
                onClick={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
            <button className="btn btn-accent mt-4 w-40" onClick={handleLogOut}>
              {" "}
              Logout{" "}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profiles;
