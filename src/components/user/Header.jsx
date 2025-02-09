import "react";
import { Link, useNavigate } from "react-router-dom";
import DarkMode from "../shared/DarkMode";
const Header = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center p-14 h-20 shadow-2xl ">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <div className="flex-none gap-2">
                  <div className="form-control">
                    <input
                      type="text"
                      placeholder="Search"
                      className="input input-bordered w-24 md:w-auto"
                    />
                  </div>
                </div>
                <Link to={"/"}>
                  {" "}
                  <li>Home</li>{" "}
                </Link>
                <Link to={"/about"}>
                  {" "}
                  <li>About</li>{" "}
                </Link>
                <Link to={"/menuitem"}>
                  {" "}
                  <li>Cuisine</li>{" "}
                </Link>
              </ul>
            </div>
            <a className="headtitle btn btn-ghost text-2xl title">
              Food Delight
            </a>
          </div>
        </div>

        <div className="navbar-start hidden lg:flex w-full items-center">
          <nav className="flex gap-10 items-center  font-semibold ml-12">
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About</Link>
            <Link to={"/menuitem"}>Cuisine</Link>
            <div className="flex-none ">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-bordered w-24 md:w-auto"
                />
              </div>
            </div>
          </nav>
        </div>
        <div className="flex justify-center gap-3">
          <DarkMode />
          <button
            className="btn btn-primary"
            onClick={() => navigate("/signup")}
          >
            Join Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
