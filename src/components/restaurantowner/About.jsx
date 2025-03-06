import { useEffect, useState } from "react";
function About() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme(systemTheme);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-6">
          About Food Delight
        </h1>
        <p className="text-lg">
          Welcome to <span className="font-semibold">FOOD DELIGHT</span> - your
          ultimate destination for delicious food, delivered fast and fresh! We
          partner with the best restaurants to bring you mouthwatering meals at
          your doorstep.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div
          className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <h2 className="text-2xl font-semibold text-primary">Our Mission</h2>
          <p className="mt-2 text-base">
            To make food delivery quick, convenient, and delightful for
            everyone.
          </p>
        </div>

        <div
          className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <h2 className="text-2xl font-semibold text-primary">
            Why Choose Us?
          </h2>
          <p className="mt-2 text-base">
            Fast delivery, wide restaurant selection, exclusive discounts, and
            24/7 customer support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
