import "react";

function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6">
      <div className="max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-6">
          About Food Delight
        </h1>
        <p className="text-lg text-white">
          Welcome to <span className="font-semibold">FOOD DELIGHT</span> - your
          ultimate destination for delicious food, delivered fast and fresh! We
          partner with the best restaurants to bring you mouthwatering meals at
          your doorstep.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="card bg-black-900 shadow-xl p-6 border border-black-700 rounded-xl">
          <h2 className="text-2xl font-semibold text-secondary">Our Mission</h2>
          <p className="mt-2 text-gray-300">
            To make food delivery quick, convenient, and delightful for
            everyone.
          </p>
        </div>

        <div className="card bg-black-900 shadow-xl p-6 border border-black-700 rounded-xl">
          <h2 className="text-2xl font-semibold text-secondary">
            Why Choose Us?
          </h2>
          <p className="mt-2 text-gray-300">
            Fast delivery, wide restaurant selection, exclusive discounts, and
            24/7 customer support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
