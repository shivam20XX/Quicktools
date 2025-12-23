import React from "react";
import { useTheme } from "../../context/ThemeContext";

const PdfRotate = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1
          className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Rotate PDF
        </h1>
        <p className={`${isDark ? "text-slate-300" : "text-gray-600"} mb-8`}>
          Turn pages clockwise or counterclockwise to fix sideways documents.
          Everything runs locally in your browser.
        </p>
        <div
          className={`rounded-2xl border p-6 ${
            isDark
              ? "border-slate-700 bg-slate-800/60"
              : "border-gray-200 bg-white shadow-sm"
          }`}
        >
          <p className={isDark ? "text-slate-300" : "text-gray-700"}>
            PDF rotate functionality coming soon.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PdfRotate;
