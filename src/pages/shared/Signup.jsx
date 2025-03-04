import { useForm } from "react-hook-form";
import axiosInstance from "../../config/axiosInstance";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { saveUser } from "../../redux/features/userSlice";
import { saveOwner } from "../../redux/features/OwnerSlice";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

function Signup() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const role = location.pathname.includes("restaurantowner")
    ? "restaurantowner"
    : location.pathname.includes("admin")
    ? "admin"
    : "user";

  const signupAPI =
    role === "restaurantowner" || role === "admin"
      ? "/restaurantowner/signup"
      : "/user/signup";
  const onSubmit = async (data) => {
    try {
      if (role === "restaurantowner") {
        data.role = "restaurantOwner";
      } else if (role === "admin") {
        data.role = "admin";
      } else {
        data.role = "user";
      }

      console.log("Sending Signup Request:", { signupAPI, data });

      const response = await axiosInstance.post(signupAPI, data);
      console.log("Signup Response:", response);

      if (role === "restaurantowner" || role === "admin") {
        localStorage.setItem("ownerToken", response?.data?.token);
        dispatch(saveOwner(response?.data?.data));
      } else {
        localStorage.setItem("userToken", response?.data?.token);
        dispatch(saveUser(response?.data?.data));
      }

      toast.success("Signup Successful! Redirecting...", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate(role === "restaurantowner" ? "/restaurantowner/" : "/");
      }, 2500);
    } catch (error) {
      console.error("Signup Failed:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Signup Failed! Please try again.",
        { position: "top-center", autoClose: 3000 }
      );
    }
  };
  return (
    <div className="hero min-h-[80vh] bg-base-200 flex justify-center items-center py-12">
      <ToastContainer />

      <div className="w-full max-w-2xl bg-base-100 shadow-xl rounded-lg p-10">
        <h1 className="text-4xl font-bold text-center mb-6">Signup Now!</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name")}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              placeholder="Enter your address"
              {...register("address")}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              placeholder="Enter your mobile number"
              {...register("phone")}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="input input-bordered w-full"
              required
            />
          </div>

          {(role === "restaurantowner" || role === "admin") && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                {...register("role")}
                className="select select-bordered w-full"
                required
              >
                <option value="restaurantOwner">Restaurant Owner</option>{" "}
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <Link
                to={
                  role === "restaurantowner"
                    ? "/restaurantowner/login"
                    : "/login"
                }
                className="label-text-alt link link-hover"
              >
                Existing User? Login Here
              </Link>
            </label>
          </div>

          <div className="form-control mt-4">
            <button className="btn btn-primary w-full">Signup</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
