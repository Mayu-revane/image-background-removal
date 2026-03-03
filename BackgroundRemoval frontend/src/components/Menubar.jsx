import React, { useState } from "react";
import { assets } from "../assets/assets.js";
import { Menu, X } from "lucide-react";
//import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  SignedOut,
  SignedIn,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import AdminPanel from "./AdminPanel";  // ✅ ADD THIS IMPORT

const Menubar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);  // ✅ ADD THIS STATE
  const { openSignIn, openSignUp } = useClerk();
  const { user } = useUser();
  
  const navigate = useNavigate();

  const openRegister = () => openSignUp();
  const openLogin = () => openSignIn();

  const toggleAdminPanel = () => setShowAdminPanel(!showAdminPanel);  // ✅ ADD THIS FUNCTION

  return (
    <nav className="bg-white px-8 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src={assets.logo}
          alt="logo"
          className="h-8 w-8 object-contain cursor-pointer"
        />
        <span className="text-2xl font-semibold text-indigo-700 cursor-pointer">
          remove.<span className="text-gray-400">bg</span>
        </span>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <SignedOut>
          <button
            className="text-gray-700 hover:text-blue-500 font-medium"
            onClick={openLogin}
          >
            Login
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-full"
            onClick={openRegister}
          >
            Sign up
          </button>
        </SignedOut>

        <SignedIn>
          <p className="text-gray-600">
            Hi, {user?.fullName}!
          </p>
          <UserButton />
        </SignedIn>

        {/* ✅ FIXED: Now connects to AdminPanel */}
        <button
          onClick={toggleAdminPanel}  // ✅ CHANGED: toggleAdminPanel()
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Admin
        </button>
      </div>

      {/* Mobile Toggle */}
      <div className="flex md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-8 bg-white shadow-md rounded-md flex flex-col space-y-2 p-4 w-40 z-50">
          <SignedOut>
            <button
              className="px-4 py-2 text-gray-700 hover:text-blue-500"
              onClick={() => {
                openLogin();
                setMenuOpen(false);
              }}
            >
              Login
            </button>
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
              onClick={() => {
                openRegister();
                setMenuOpen(false);
              }}
            >
              Sign up
            </button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
          
          {/* ✅ Mobile Admin button */}
          <button
            onClick={() => {
              toggleAdminPanel();
              setMenuOpen(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Admin
          </button>
        </div>
      )}

      {/* ✅ RENDER ADMIN PANEL MODAL */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
    </nav>
  );
};

export default Menubar;
