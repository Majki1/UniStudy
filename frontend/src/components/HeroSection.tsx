import { Link } from "react-router-dom";
import hero from "../assets/images/hero.svg";
import arrowRight from "../assets/icons/arrowRight.svg";

function HeroSection() {
  return (
    <div className="flex flex-row items-start justify-between bg-transparent p-4 px-10 pt-32">
      <div className="flex flex-col items-start justify-center w-2/5">
        <h1 className="text-6xl font-bold text-primary-text-color">
          The{" "}
          <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
            easiest
          </span>{" "}
          way to{" "}
          <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
            Study
          </span>
        </h1>

        <p className="text-secondary-text-color text-start mt-4">
          Stop wasting time on scattered tutorials. Let UniStudy create the
          perfect learning path for your needs, faster and better than ever.
        </p>
        <div className="mt-8 flex flex-row items-center">
          <Link
            to="/login"
            className="text-primary bg-gradient-to-r from-gradient-start to-gradient-end font-semibold text-base px-8 py-3 rounded-md"
          >
            Start Learning
          </Link>
          <a
            href="#"
            className="text-secondary-text-color bg-alt-bg-color px-8 py-3 rounded-lg font-semibold text-base ml-4 flex flex-row items-center"
          >
            Learn More
            <img src={arrowRight} alt="Arrow Right" className="ml-2" />
          </a>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <img src={hero} alt="Hero" />
      </div>
    </div>
  );
}

export default HeroSection;
