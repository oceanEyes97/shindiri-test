import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
import Logo from "../../../public/Logo/Rick_and_Morty.svg";
import { MdArrowForward, MdMenu, MdClose } from "react-icons/md";

const Navigation = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    sessionStorage.clear();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="relative bg-black text-white shadow-md px-4 py-3">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between relative">
        {/* Logo */}
        <Link to="/characters" className="flex items-center gap-3 z-10">
          <img src={Logo} alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Centered Nav Link */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform md:flex gap-6">
          <Link
            to="/characters"
            className="hover:text-green-400 transition duration-200"
          >
            Characters
          </Link>
        </div>

        {/* Logout + Mobile Toggle */}
        <div className="flex items-center gap-2 z-10">
          <button
            onClick={handleSignOut}
            className="hidden md:flex items-center gap-1 rounded-md bg-green-400 px-4 py-2 font-semibold text-black hover:bg-green-500 transition"
          >
            Logout <MdArrowForward />
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-green-400 text-3xl"
          >
            {isMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-3 flex flex-col gap-4 md:hidden text-center">
          <Link
            to="/characters"
            onClick={() => setIsMenuOpen(false)}
            className="block text-white hover:text-green-400"
          >
            Characters
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleSignOut();
            }}
            className="mx-auto mt-1 flex items-center justify-center gap-1 rounded-md bg-green-400 px-4 py-2 font-semibold text-black hover:bg-green-500 transition"
          >
            Logout <MdArrowForward />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
