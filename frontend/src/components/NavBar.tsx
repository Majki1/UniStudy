import { Link } from "react-router-dom";
import logo from "../assets/icons/Logo-text.svg";

function NavBar() {
  return (
    <nav className="bg-transparent px-2 py-1 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-row items-center">
          <Link to="/" className="text-white text-xl font-bold">
            <img src={logo} alt="logo" className="mb-1" />
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
            className="text-primary bg-gradient-to-r from-gradient-start to-gradient-end px-8 py-2 rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
