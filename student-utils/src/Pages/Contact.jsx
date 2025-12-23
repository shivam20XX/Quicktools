import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Mail, Send } from "lucide-react";

const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log and clear the form
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
    alert("Thank you for reaching out! We'll get back to you soon.");
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"}`}>
      {/* Header Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h1
          className={`text-4xl sm:text-5xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Get in Touch
        </h1>
        <p
          className={`text-lg mb-8 ${
            isDark ? "text-slate-300" : "text-gray-600"
          }`}
        >
          How can we help? We'd
          love to hear from you.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
        <div
          className={`rounded-lg p-8 border ${
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your-email@example.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
                required
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
