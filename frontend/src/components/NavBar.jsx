import HeaderUser from "./HeaderUser";
import productIcon from "../assets/icons/product-icon.png";
import "./style.css";

export default function NavBar() {
  return (
        <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <div id="head_title" className="mr-2">FemmeNest world</div>
          <img
            src={productIcon}
            alt="Product Icon"
            className="h-8 w-8"
          />
        </a>

        <div className="flex-1 mx-6" id="head_search">
          <input
            type="text"
            placeholder="Search by Product | Category | Brand..."
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <HeaderUser />
        </div>

      </nav>
  );
}
