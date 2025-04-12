import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { MdArrowForward, MdMenu, MdClose } from 'react-icons/md';

const Navigation = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //Sign out the user when he clicks Logout
  const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="relative bg-black px-4 py-3 text-white shadow-md shadow-green-500">
      <div className="relative mx-auto flex max-w-screen-xl items-center justify-between">
        {/* Logo */}
        <Link to="/characters" className="z-10 flex items-center gap-3">
          <img src="/Logo/Rick_and_Morty.svg" alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Centered Nav Link */}
        <div className="hidden justify-center md:flex">
          <Link to="/characters" className="transition duration-200 hover:text-green-400">
            Characters
          </Link>
        </div>

        {/* Logout + Mobile Toggle */}
        <div className="z-10 flex items-center gap-2">
          <button
            onClick={handleSignOut}
            className="hidden items-center gap-1 rounded-md bg-green-400 px-4 py-2 font-semibold text-black transition hover:bg-green-500 md:flex"
          >
            Logout <MdArrowForward />
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-3xl text-green-400 md:hidden"
          >
            {isMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-3 flex flex-col gap-4 text-center md:hidden">
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
            className="mx-auto mt-1 flex items-center justify-center gap-1 rounded-md bg-green-400 px-4 py-2 font-semibold text-black transition hover:bg-green-500"
          >
            Logout <MdArrowForward />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
