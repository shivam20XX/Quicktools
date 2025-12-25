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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  const categories = [
    {
      id: 1,
      title: "PDF",
      icon: FileText,
      path: "/tools/pdf",
      tools: [
        { name: "Merge PDF", path: "/tools/pdf/merge" },
        { name: "Split PDF", path: "/tools/pdf/split" },
        { name: "Rotate PDF", path: "/tools/pdf/rotate" },
        { name: "JPG to PDF", path: "/tools/pdf/jpg-to-pdf" },
        { name: "Compress PDF", path: "/tools/pdf/compress" },
      ],
    },
    {
      id: 2,
      title: "Image",
      icon: Image,
      path: "/tools/image",
      tools: [
        { name: "Compress Image", path: "/tools/image/compress" },
        { name: "Resize Image", path: "/tools/image/resize" },
        { name: "Convert Image", path: "/tools/image/convert" },
        { name: "PDF to JPG", path: "/tools/image/pdf-to-jpg" },
      ],
    },
    { id: 3, title: "Write", icon: PenTool, tools: [] },
    { id: 4, title: "Video", icon: Video, tools: [] },
    { id: 5, title: "File", icon: Folder, tools: [] },
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

                  {/* Mobile Submenu */}
                  {openCategories[category.id] &&
                    category.tools?.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1">
                        {category.tools.map((tool, index) => (
                          <Link
                            key={index}
                            to={tool.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors text-sm"
                          >
                            {tool.name}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`backdrop-blur-sm  sticky top-0 z-40 ${
          isDark
            ? "border-slate-700 bg-slate-900/95"
            : "border-gray-200 bg-white/95"
        }`}
      >
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-2 py-4 flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="QuickTools logo"
              className="block h-10 w-10"
            />
            <span
              className={`ml-1 font-bold text-lg leading-none ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Quick<span className="text-orange-500">Tools</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-8 items-center flex-1 justify-center">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() =>
                  category.tools?.length > 0 && setActiveDropdown(category.id)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={category.path || "#"}
                  className={`font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    isDark
                      ? "text-white hover:text-blue-400"
                      : "text-gray-900 hover:text-blue-600"
                  }`}
                >
                  {category.title}
                  {category.tools?.length > 0 && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeDropdown === category.id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {category.tools?.length > 0 &&
                  activeDropdown === category.id && (
                    <div className={`absolute top-full left-0 pt-2`}>
                      <div
                        className={`w-48 rounded-lg shadow-xl border overflow-hidden ${
                          isDark
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {category.tools.map((tool, index) => (
                          <Link
                            key={index}
                            to={tool.path}
                            onClick={() => setActiveDropdown(null)}
                            className={`block px-4 py-3 text-sm transition-colors ${
                              isDark
                                ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            {tool.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
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
              className={`transition-colors cursor-pointer ${
                isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              className={`transition-colors cursor-pointer ${
                isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Share2 className="w-5 h-5" />
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 cursor-pointer ${
                isDark ? "text-white" : "text-gray-900"
              }`}
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
