import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkMode from "../shared/DarkMode";

function Headerowner() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search/${query}`);
      setQuery("");
    }
  };

  return (
    <div className="navbar bg-base-100 px-4 md:px-6 shadow-md">
      <div className="navbar-start flex items-center gap-3">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost btn-circle">
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
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow-md z-10 mt-3 w-52 p-2"
          >
            <li>
              <Link to={"/restaurantowner"}>HOME</Link>
            </li>
            <li>
              <Link to={"/restaurantowner/about"}>ABOUT</Link>
            </li>
            <li>
              <Link to={"/restaurantowner/login"}>LOGIN</Link>
            </li>
            <li>
              <DarkMode className="w-6 h-6" />
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-center">
        <Link
          to="/restaurantowner"
          className="font-bold italic text-red-600 btn btn-ghost text-xl md:text-2xl lg:text-3xl px-2 sm:px-4 font-[Trebuchet_MS] tracking-wide"
        >
          Food Delight
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-3 relative">
        <div
          className="hidden md:flex items-center border border-gray-300 rounded-lg px-3 py-1 transition-all duration-300 
        w-[100px] sm:w-[140px] md:w-[180px] lg:w-[250px] xl:w-[300px]"
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

        <div className="relative">
          <button
            className="md:hidden btn btn-ghost btn-circle"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <div
            className={`absolute top-1/2 right-12 transform -translate-y-1/2 bg-white border border-gray-300 rounded-lg px-3 py-1 shadow-md transition-all duration-300
            ${
              isSearchVisible
                ? "w-40 opacity-100"
                : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            <input
              type="text"
              className="input input-sm border-none focus:outline-none w-full"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              onClick={() => {
                if (query.trim()) {
                  navigate(`/search/${query}`);
                  setIsSearchVisible(false);
                }
              }}
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
        </div>
      </div>
    </div>
  );
}

export default Headerowner;
