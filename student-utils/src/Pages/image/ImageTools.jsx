import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  Minimize2,
  Crop,
  Image as ImageIcon,
  Sparkles,
  FileText,
} from "lucide-react";

const ImageTools = () => {
  const { isDark } = useTheme();

  const tools = [
    {
      id: "compress",
      title: "Compress Image",
      description:
        "Reduce image file size while preserving quality for faster loading.",
      path: "/tools/image/compress",
      icon: Minimize2,
    },
    {
      id: "resize",
      title: "Resize Image",
      description: "Change image dimensions and scale to any size you need.",
      path: "/tools/image/resize",
      icon: Crop,
    },
    {
      id: "convert",
      title: "Convert Image",
      description: "Convert between JPG, PNG, WebP, and other image formats.",
      path: "/tools/image/convert",
      icon: ImageIcon,
    },
    {
      id: "pdf-to-jpg",
      title: "PDF to JPG",
      description:
        "Convert each page of your PDF document into high-quality JPG images.",
      path: "/tools/image/pdf-to-jpg",
      icon: FileText,
    },
    {
      id: "optimize",
      title: "Optimize Image",
      description:
        "Auto-optimize images for web with best quality and size balance.",
      icon: Sparkles,
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <p
            className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
              isDark ? "text-blue-300" : "text-blue-600"
            }`}
          >
            Image Toolkit
          </p>
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Work with Images in your browser
          </h1>
          <p
            className={`${
              isDark ? "text-slate-300" : "text-gray-600"
            } max-w-2xl`}
          >
            Fast, secure tools to compress, resize, and convert images. All
            processing happens locally.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path || "#"}
                className={`rounded-2xl border p-6 flex flex-col justify-between h-full transition-all hover:scale-105 cursor-pointer ${
                  isDark
                    ? "border-slate-700 bg-slate-800/70 hover:border-slate-500 hover:bg-slate-700/70"
                    : "border-gray-200 bg-white hover:border-blue-300 shadow-sm hover:shadow-md"
                } ${!tool.path ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div>
                  <IconComponent
                    className={`w-12 h-12 mb-4 ${
                      isDark ? "text-blue-400" : "text-blue-500"
                    }`}
                  />
                  <h2
                    className={`text-xl font-semibold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {tool.title}
                  </h2>
                  <p
                    className={`${isDark ? "text-slate-300" : "text-gray-600"}`}
                  >
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ImageTools;
