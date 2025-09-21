import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import useAuthStore from "@/store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="pt-3 sm:pt-5 px-3 sm:px-0">
      <header className="relative text-white body-font">
        <div className="container mx-auto flex flex-wrap p-3 sm:p-5 items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg relative overflow-hidden">
          {/* Enhanced Transparent Gradient Behind Glass */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-black/30 rounded-lg -z-10"></div>

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center title-font font-medium text-white cursor-pointer">
              <Image 
                src="/logobg.png" 
                className="h-8 sm:h-10 w-auto" 
                alt="FineSight Logo" 
                width={120} 
                height={100} 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center space-x-8">
            <a className="hover:text-gray-300 cursor-pointer transition-colors duration-200 text-sm font-medium">
              Home
            </a>
            <a className="hover:text-gray-300 cursor-pointer transition-colors duration-200 text-sm font-medium">
              About
            </a>
            <a className="hover:text-gray-300 cursor-pointer transition-colors duration-200 text-sm font-medium">
              Services
            </a>
            <a className="hover:text-gray-300 cursor-pointer transition-colors duration-200 text-sm font-medium">
              Contact
            </a>
          </nav>

          {/* Desktop Auth Button */}
          <div className="hidden lg:flex items-center">
            <Link href={user ? "/dashboard" : "/auth/login"}>
              <button className="px-4 sm:px-6 py-2 rounded-md border border-neutral-600 text-white hover:bg-gray-100 hover:text-black transition duration-200 text-sm font-medium">
                {user ? (user.name || user.email) : "Login / Sign Up"}
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden ml-auto flex items-center space-x-4">
            {/* Mobile Auth Button */}
            <Link href={user ? "/dashboard" : "/auth/login"} className="hidden sm:block">
              <button className="px-3 py-1.5 rounded-md border border-neutral-600 text-white hover:bg-gray-100 hover:text-black transition duration-200 text-xs font-medium">
                {user ? "Dashboard" : "Login"}
              </button>
            </Link>
            
            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors duration-200"
            >
              <svg
                className={`h-5 w-5 transition-transform duration-200 ${isMenuOpen ? 'rotate-45' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="container mx-auto mt-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <div className="px-4 py-3 space-y-3">
              <a className="block hover:text-gray-300 cursor-pointer transition-colors duration-200 text-sm font-medium py-2">
                Home
              </a>
              <a className="block hover:text-gray-300 cursor-pointer transition-colors duration-200 text-sm font-medium py-2">
                About
              </a>
              <a className="block hover:text-gray-300 cursor-pointer transition-colors duration-200 text-sm font-medium py-2">
                Services
              </a>
              <a className="block hover:text-gray-300 cursor-pointer transition-colors duration-200 text-sm font-medium py-2">
                Contact
              </a>
              <div className="sm:hidden pt-3 border-t border-white/10">
                <Link href={user ? "/dashboard" : "/auth/login"}>
                  <button className="w-full px-4 py-2 rounded-md border border-neutral-600 text-white hover:bg-gray-100 hover:text-black transition duration-200 text-sm font-medium">
                    {user ? (user.name || user.email) : "Login / Sign Up"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
