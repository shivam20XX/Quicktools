import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const PdfTools = () => {
  const { isDark } = useTheme();

  const tools = [
    {
      id: "merge",
      title: "Merge PDF",
      description: "Combine multiple PDF files into one organized document.",
      path: "/tools/pdf/merge",
    },
    {
      id: "split",
      title: "Split PDF",
      description:
        "Extract pages or break a PDF into smaller files effortlessly.",
      path: "/tools/pdf/split",
    },
    {
      id: "rotate",
      title: "Rotate PDF",
      description:
        "Fix sideways or annoyingly merge pages with quick left/right rotations.",
      path: "/tools/pdf/rotate",
    },
    {
      id: "jpg-to-pdf",
      title: "JPG to PDF",
      description:
        "Convert one or multiple JPG images into a single PDF document.",
      path: "/tools/pdf/jpg-to-pdf",
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
            PDF Toolkit
          </p>
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Work with PDFs in your browser
          </h1>
          <p
            className={`${
              isDark ? "text-slate-300" : "text-gray-600"
            } max-w-2xl`}
          >
            Simple, fast tools to manage your PDFs. No uploads required—your
            files stay on your device.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between h-full transition-all ${
                isDark
                  ? "border-slate-700 bg-slate-800/70 hover:border-slate-500"
                  : "border-gray-200 bg-white hover:border-blue-200 shadow-sm"
              }`}
            >
              <div>
                <h2
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tool.title}
                </h2>
                <p
                  className={`${
                    isDark ? "text-slate-300" : "text-gray-600"
                  } mb-6`}
                >
                  {tool.description}
                </p>
              </div>
              <Link
                to={tool.path}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-blue-500 text-white hover:bg-blue-400"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                Open tool
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PdfTools;
