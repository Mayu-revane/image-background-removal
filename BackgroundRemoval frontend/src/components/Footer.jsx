import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="flex items-center justify-between px-4 lg:px-44 py-3">
      {/* Logo */}
      <img src={assets.logo} alt="logo" width={32} />

      {/* Optional text (you can change or remove this) */}
      <p className="text-center text-gray-700 font-medium">
        © 2025 Your Company Name
      </p>
    </footer>
  );
};

export default Footer;
