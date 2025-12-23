import React from "react";
import { useTheme } from "../context/ThemeContext";

const PrivacyPolicy = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div
          className={`rounded-2xl border p-8 sm:p-10 ${
            isDark
              ? "border-slate-700 bg-slate-800/60"
              : "border-gray-200 bg-white"
          }`}
        >
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Privacy Policy
          </h1>
          <p className={`${isDark ? "text-slate-300" : "text-gray-700"} mb-6`}>
            We keep things simple and transparent. This site is frontend-only
            and focuses on protecting your privacy while you use our tools.
          </p>
          <ul
            className={`space-y-4 ${
              isDark ? "text-slate-300" : "text-gray-700"
            }`}
          >
            <li>
              <strong className={isDark ? "text-white" : "text-gray-900"}>
                No personal data collected.
              </strong>{" "}
              We do not ask for or store personal information.
            </li>
            <li>
              <strong className={isDark ? "text-white" : "text-gray-900"}>
                Files stay on your device.
              </strong>{" "}
              All processing happens locally in your browser.
            </li>
            <li>
              <strong className={isDark ? "text-white" : "text-gray-900"}>
                No uploads, no storage.
              </strong>{" "}
              We don’t send your files to our servers or keep copies.
            </li>
            <li>
              <strong className={isDark ? "text-white" : "text-gray-900"}>
                Cookies may be used for analytics or ads.
              </strong>{" "}
              Any cookies are only for improving the experience or supporting
              the site.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
