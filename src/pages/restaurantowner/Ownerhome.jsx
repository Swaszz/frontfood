import "react";
import Carrousel from "../../components/user/Carrousel";
import Categorymenu from "../../components/user/Categorymenu";

function Ownerhome() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto px-2">
      <section>
        <Carrousel />
      </section>

      <section className="min-h-96 flex flex-col lg:flex-row items-center gap-10 px-6 lg:px-20 py-10 w-full mt-10 lg:mt-20">
        <div className="w-full lg:w-7/12">
          <h1 className="font-bold text-3xl lg:text-4xl my-6">
            Welcome to Food Delight
          </h1>
          <p className="text-lg lg:text-xl font-normal mt-3">
            Fast & Delicious Food Delivery
          </p>
          <p className="text-lg lg:text-xl font-normal mt-3">
            &quot;Good Food&quot; = &quot;Good Mood!&quot; Order now!
          </p>
          <p className="text-lg lg:text-xl font-normal mt-3">
            The first bite of happiness, delivered to your doorstep.
          </p>
        </div>

        <div className="w-full lg:w-5/12">
          <img
            className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-md"
            src="https://res.cloudinary.com/dkzoinzfh/image/upload/v1738827715/SES-cuisine-of-north-india-1957883-d32a933f506d43f59ac38a8eb956884a_rgcxtm.jpg"
            alt="home-image"
          />
        </div>
      </section>

      <section className="px-6 lg:px-20 py-10">
        <Categorymenu />
      </section>
    </div>
  );
}

export default Ownerhome;
