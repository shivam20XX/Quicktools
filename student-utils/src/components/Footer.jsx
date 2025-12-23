import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`px-4 sm:px-6 lg:px-8 py-12 mt-12 border-t ${
        isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Brand + blurb */}
        <div>
          <h3
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Quick<span className="text-orange-400">Tools</span>
          </h3>
          <p
            className={`mt-4 max-w-xl ${
              isDark ? "text-slate-300" : "text-gray-600"
            }`}
          >
            StudentWow provides free online tools to help with everyday student
            tasks like attendance calculations, working with PDFs, and quick
            image utilities. All tools run in your browser.
          </p>
        </div>

        {/* Right: Navigate */}
        <div className="md:justify-self-end">
          <h4
            className={`text-center text-lg font-semibold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Navigation
          </h4>
          <ul
            className={`space-y-3 ${
              isDark ? "text-slate-300" : "text-gray-600"
            } md:flex gap-8`}
          >
            <li>
              <Link to="/about" className="hover:text-blue-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-blue-400">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10">
        <p
          className={`text-xs sm:text-sm text-center ${
            isDark ? "text-slate-500" : "text-gray-500"
          }`}
        >
          © {new Date().getFullYear()} StudentWow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
