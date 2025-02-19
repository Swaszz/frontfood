import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/features/userSlice";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useFetch("/user/profile");
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.put("/user/updateprofile", formData);
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
      const response = await axiosInstance.get("/user/logout");
      if (response.status === 200) {
        localStorage.removeItem("token");
        dispatch(clearUser());
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 200);
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
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

export default Profile;
