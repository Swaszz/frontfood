import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkMode from "../shared/DarkMode";

const Header = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search/${query}`);
      setQuery("");
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-6">
      <div className="navbar-start flex items-center gap-3">
        <div className="dropdown lg:hidden">
          <button
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow-md z-[10] mt-3 w-52 p-2"
          >
            <li className="block sm:hidden">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1 w-full">
                <input
                  type="text"
                  className="input input-sm border-none focus:outline-none w-full"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={() => query.trim() && navigate(`/search/${query}`)}
                  className="btn btn-sm btn-ghost"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </li>

            <li className="block sm:hidden">
              <DarkMode className="w-5 h-5" />
            </li>

            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/menuitem">Cuisine</Link>
            </li>
          </ul>
        </div>

        <Link
          to="/"
          className="font-bold italic text-red-600 btn btn-ghost text-xl md:text-2xl lg:text-3xl px-2 sm:px-4 font-[Trebuchet_MS] tracking-wide"
        >
          Food Delight
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-3 font-semibold space-x-6">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/menuitem">Cuisine</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end flex items-center gap-3">
        <div
          className="relative hidden sm:flex items-center border border-gray-300 rounded-lg px-3 py-1 transition-all duration-300 
            w-[80px] sm:w-[120px] md:w-[180px] lg:w-[250px] xl:w-[300px]"
        >
          <input
            type="text"
            className="input input-sm border-none focus:outline-none w-full"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => query.trim() && navigate(`/search/${query}`)}
            className="btn btn-sm btn-ghost"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <div className="hidden sm:flex">
          <DarkMode className="w-5 h-5" />
        </div>

        <button className="btn btn-primary" onClick={() => navigate("/signup")}>
          Join Us
        </button>
      </div>
    </div>
  );
};

export default Header;
