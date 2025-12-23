import React from "react";
import { useTheme } from "../context/ThemeContext";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark ? "bg-slate-900" : "bg-white"
      }`}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
