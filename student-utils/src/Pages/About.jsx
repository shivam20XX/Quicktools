import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Zap, Users, Shield, Lightbulb } from "lucide-react";

const About = () => {
  const { isDark } = useTheme();

  const values = [
    {
      icon: Zap,
      title: "Speed & Efficiency",
      description:
        "We believe powerful tools should be fast and effortless to use.",
    },
    {
      icon: Users,
      title: "User-Centric",
      description:
        "Every feature is designed with our users' needs and feedback in mind.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data security and privacy are our top priorities.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We continuously evolve to bring you the latest in web technology.",
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"}`}>
      {/* Mission Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h1
          className={`text-4xl sm:text-5xl font-bold mb-8 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Our Mission
        </h1>
        <p
          className={`text-lg sm:text-xl leading-relaxed ${
            isDark ? "text-slate-300" : "text-gray-600"
          }`}
        >
          To democratize digital productivity by providing free, powerful, and
          easy-to-use online tools that help people accomplish more with less
          effort. We envision a world where everyone has access to
          professional-grade digital tools, regardless of their technical
          expertise or budget.
        </p>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {value.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-slate-300" : "text-gray-600"
                  }`}
                >
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default About;
