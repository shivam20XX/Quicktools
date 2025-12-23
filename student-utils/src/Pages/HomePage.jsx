import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FileText, Image, PenTool, Video, Folder, BookA } from "lucide-react";

const HomePage = () => {
  const { isDark } = useTheme();

  const categories = [
    {
      id: 1,
      title: "PDF",
      icon: FileText,
      desc: "Merge, split, rotate, and secure PDFs quickly.",
      path: "/tools/pdf",
    },
    {
      id: 2,
      title: "Image",
      icon: Image,
      desc: "Resize, convert, and optimize images in seconds.",
    },
    {
      id: 3,
      title: "Write",
      icon: PenTool,
      desc: "Draft, summarize, or format text without distractions.",
    },
    {
      id: 4,
      title: "Video",
      icon: Video,
      desc: "Lightweight tools for quick video tweaks and trims.",
    },
    {
      id: 5,
      title: "File",
      icon: Folder,
      desc: "Convert archives, check hashes, and organize files.",
    },
    {
      id: 6,
      title: "Attendance Calculator",
      desc: "Check your college or school attendance instantly.",
      icon: BookA,
      path: "/tools/attendance",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:pt-26">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Free Utility Tools to make life easier
            <span className="block text-blue-400 mt-2">All in One Place</span>
          </h1>
          <p
            className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto ${
              isDark ? "text-slate-300" : "text-gray-600"
            }`}
          >
            Simple, fast, and secure online tools. No installation required,
            everything runs in your browser.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        id="tools"
      >
        <h2
          className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Popular Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`backdrop-blur-sm border rounded-xl p-6 transition-all cursor-pointer group ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600"
                    : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {category.path ? (
                  <Link to={category.path} className="block h-full">
                    <IconComponent className="w-12 h-12 text-blue-400 mb-4" />
                    <h3
                      className={`text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-slate-400" : "text-gray-600"
                      }`}
                    >
                      {category.desc ??
                        `View all ${category.title.toLowerCase()} tools`}
                    </p>
                  </Link>
                ) : (
                  <>
                    <IconComponent className="w-12 h-12 text-blue-400 mb-4" />
                    <h3
                      className={`text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-slate-400" : "text-gray-600"
                      }`}
                    >
                      {category.desc ??
                        `View all ${category.title.toLowerCase()} tools`}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
