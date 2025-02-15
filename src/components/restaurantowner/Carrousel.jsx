import "react";

function Carrousel() {
  return (
    <div className="carousel w-full max-h-[500px]">
      <div id="slide1" className="carousel-item relative w-full">
        <img
          src="https://res.cloudinary.com/dkzoinzfh/image/upload/v1738737114/FAW-recipes-pasta-sausage-basil-and-mustard-hero-06-cfd1c0a2989e474ea7e574a38182bbee_tzg80x.jpg"
          className="w-full h-64 md:h-96 lg:h-[500px] max-h-[500px] object-fit rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-between px-5">
          <a href="#slide4" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide2" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>

      <div id="slide2" className="carousel-item relative w-full">
        <img
          src="https://res.cloudinary.com/dkzoinzfh/image/upload/v1739170491/yenna-blog1_qdgh0k.png"
          className="w-full h-64 md:h-96 lg:h-[500px] max-h-[500px] object-fit rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-between px-5">
          <a href="#slide1" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide3" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>

      <div id="slide3" className="carousel-item relative w-full">
        <img
          src="https://res.cloudinary.com/dkzoinzfh/image/upload/v1738738676/smoked-chicken-lollipops_uo294u.jpg"
          className="w-full h-64 md:h-96 lg:h-[500px] max-h-[500px] object-fit rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-between px-5">
          <a href="#slide2" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide4" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>

      <div id="slide4" className="carousel-item relative w-full">
        <img
          src="https://res.cloudinary.com/dkzoinzfh/image/upload/v1739171299/strawberry_d2wmuw.png"
          className="w-full h-64 md:h-96 lg:h-[500px] max-h-[500px] object-fit rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-between px-5">
          <a href="#slide3" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide1" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
    </div>
  );
}

export default Carrousel;
