import "react";
import Carrousel from "../../components/user/Carrousel";
import Categorymenu from "../../components/user/Categorymenu";

function Home() {
  return (
    <div>
      <section>
        <Carrousel />
      </section>

      <section className="min-h-96 flex gap-20 px-20 py-10 w-full">
        <div className="w-8/12">
          <h1 className="font-bold text-4xl my-12 ">Welcome to Food Delight</h1>
          <p className="text-xl font-normal mt-4">
            Fast & Delicious Food Delivery
          </p>
          <p className="text-xl font-normal mt-4">
            &quot;Good Food&quot; = &quot;Good Mood !&quot; Order now!
          </p>
          <p className="text-xl font-normal mt-4">
            The first bite of happiness, delivered to your doorstep
          </p>
        </div>

        <div className="w-5/12">
          <img
            className="w-full"
            src="https://res.cloudinary.com/dkzoinzfh/image/upload/v1738827715/SES-cuisine-of-north-india-1957883-d32a933f506d43f59ac38a8eb956884a_rgcxtm.jpg"
            alt="home-image"
          />
        </div>
      </section>
      <section className="Categorybox">
        <Categorymenu />
      </section>
    </div>
  );
}

export default Home;
