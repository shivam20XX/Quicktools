import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FileText,
  Image,
  PenTool,
  Video,
  Folder,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Share2,
} from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const { isDark, toggleTheme } = useTheme();

  const categories = [
    { id: 1, title: "PDF", icon: FileText },
    { id: 2, title: "Image", icon: Image },
    { id: 3, title: "Write", icon: PenTool },
    { id: 4, title: "Video", icon: Video },
    { id: 5, title: "File", icon: Folder },
  ];

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900 z-50 overflow-y-auto"
          onClick={() => setMobileMenuOpen(false)}
          role="presentation"
        >
          <div
            className="p-6"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">S</span>
                </div>
                <div>
                  <h1 className="text-white text-xl font-bold">QuickTools</h1>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white p-2 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            {/* <div className="mb-8">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-slate-700/50 text-white placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div> */}

            {/* Categories */}
            <nav className="space-y-1">
              {categories.map((category) => (
                <div key={category.id}>
                  {category.path ? (
                    <Link
                      to={category.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="text-lg font-medium">
                        {category.title}
                      </span>
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="text-lg font-medium">
                        {category.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          openCategories[category.id] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="backdrop-blur-sm border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <div className="hidden sm:block">
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Quick<span className="text-orange-400">Tools</span>
              </h3>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-8 items-center flex-1 justify-center">
            {categories.map((category) => {
              const content = (
                <span className="text-white hover:text-blue-400 font-medium transition-colors cursor-pointer">
                  {category.title}
                </span>
              );

              return category.path ? (
                <Link
                  key={category.id}
                  to={category.path}
                  className="inline-flex items-center"
                >
                  {content}
                </Link>
              ) : (
                <span key={category.id}>{content}</span>
              );
            })}
          </nav>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {/* <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-slate-700/50 text-white placeholder-slate-400 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48"
                />
              </div>
            </div> */}
            <button
              onClick={toggleTheme}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <Share2 className="w-5 h-5" />
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-white p-2 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
