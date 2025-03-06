import "react";

function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6">
      <div className="max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-6">
          About Food Delight
        </h1>
        <p className="text-lg text-black-700">
          Welcome to <span className="font-semibold">FOOD DELIGHT</span> - your
          ultimate destination for delicious food, delivered fast and fresh! We
          partner with the best restaurants to bring you mouthwatering meals at
          your doorstep.
        </p>
      </div>
      <div
        className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        <h2 className="text-2xl font-semibold text-primary">Our Mission</h2>
        <p className="mt-2 text-base">
          To make food delivery quick, convenient, and delightful for everyone.
        </p>
      </div>

      <div
        className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        <h2 className="text-2xl font-semibold text-primary">Why Choose Us?</h2>
        <p className="mt-2 text-base">
          Fast delivery, wide restaurant selection, exclusive discounts, and
          24/7 customer support.
        </p>
      </div>
    </div>
  );
}

export default About;
