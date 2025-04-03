import { Link } from "react-router-dom";
import { icons } from "../constants/icons";

function NavBar({ authenticated }: { authenticated: boolean }) {
  return authenticated ? (
    <nav className="bg-transparent py-1 px-4 w-full z-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center">
          <Link to="/home" className="text-white text-xl font-bold">
            <img src={icons.logoText} alt="logo" className="mb-1" />
          </Link>
        </div>

        <div className="flex flex-row items-center">
          <a className="text-secondary-text-color text-sm font-semibold ml-4 hover:cursor-pointer">
            Current course
          </a>
          <a className="text-secondary-text-color text-sm font-semibold ml-4 hover:cursor-pointer">
            My courses
          </a>
          {/*add magnifying glass icon*/}
          <div className="relative inline-block bg-alt-bg-color rounded-lg ml-4">
            <img
              src={icons.magnifyingGlass}
              alt="magnifying glass"
              className="absolute top-3 left-2 w-4 h-4 text-secondary-text-color"
            />
            <input
              type="text"
              placeholder=""
              className="ml-4 w-10 text-secondary-text-color px-3 py-2 focus:outline-none focus:w-auto"
            />
          </div>
          <div className="flex flex-row items-center ml-4 rounded-full size-10 bg-secondary-text-color" />
        </div>
      </div>
    </nav>
  ) : (
    // Render different navbar for unauthenticated users
    <nav className="bg-transparent py-1 px-4 w-full z-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center">
          <Link to="/" className="text-white text-xl font-bold">
            <img src={icons.logoText} alt="logo" className="mb-1" />
          </Link>
          <a className="text-secondary-text-color text-sm font-semibold ml-4">
            Pricing
          </a>
          <a className="text-secondary-text-color text-sm font-semibold ml-4">
            Features
          </a>
          <a className="text-secondary-text-color text-sm font-semibold ml-4">
            Contact
          </a>
        </div>

        <div>
          <Link
            to="/login"
            className="text-primary bg-gradient-to-b from-gradient-start to-gradient-end px-8 py-2 rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
