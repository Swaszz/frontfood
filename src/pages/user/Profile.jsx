import useFetch from "../../hooks/useFetch";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/features/userSlice";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileData] = useFetch("/user/profile");

  const handleLogOut = async () => {
    try {
      const response = await axiosInstance.get("/user/logout");

      if (response.status === 200) {
        console.log("Logout successful:", response.data);
        localStorage.removeItem("token");

        dispatch(clearUser());
        console.log("User logged out, navigating to login...");

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
            <button className="btn btn-primary mr-auto ">Orders</button>
            <button className="btn btn-secondary ml-auto">Edit Profile</button>
          </div>
          <div className="flex flex-col items-center text-center mt-6 ">
            <img
              src={profileData?.profilePic}
              className="w-40 h-40 rounded-full"
              alt="profileImage"
            />
            <div className="mt-4 text-left">
              <p className="mt-4 text-xl font-semibold">
                <span className="font-semibold">Name:</span> {profileData?.name}
              </p>
              <p className="mt-4 text-xl font-semibold">
                <span className="font-semibold">Email:</span>{" "}
                {profileData?.email}
              </p>
              <p className="mt-4 text-xl font-semibold">
                <span className="font-semibold">Address:</span>{" "}
                {profileData?.address}
              </p>
              <p className="mt-4 text-xl font-semibold">
                <span className="font-semibold">Phone:</span>{" "}
                {profileData?.phone}
              </p>
            </div>
            <button
              className="btn btn-accent  mt-4 w-40"
              onClick={handleLogOut}
            >
              Logout
            </button>{" "}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
