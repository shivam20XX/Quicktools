import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const AttendanceCalculator = () => {
  const navigate = useNavigate();
  const [totalClasses, setTotalClasses] = useState(0);
  const [attendedClasses, setAttendedClasses] = useState(0);
  const [requiredPercent, setRequiredPercent] = useState(75);

  const handleClose = () => {
    if (
      typeof window !== "undefined" &&
      window.history &&
      window.history.length > 1
    ) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const { currentPercent, classesNeeded, status } = useMemo(() => {
    const total = Number(totalClasses) || 0;
    const attended = Number(attendedClasses) || 0;
    const required = Math.min(Math.max(Number(requiredPercent) || 0, 0), 100);

    if (total <= 0) {
      return {
        currentPercent: 0,
        classesNeeded: 0,
        status: "Add class counts",
      };
    }

    const rawCurrent = (attended / Math.max(total, 1)) * 100;
    const current = Number.isFinite(rawCurrent) ? rawCurrent : 0;

    if (required === 0) {
      return { currentPercent: current, classesNeeded: 0, status: "Safe" };
    }

    if (current >= required) {
      return { currentPercent: current, classesNeeded: 0, status: "Safe" };
    }

    const numerator = required * total - attended * 100;
    const denominator = 100 - required;
    const needed = Math.ceil(Math.max(numerator / denominator, 0));

    return {
      currentPercent: current,
      classesNeeded: needed,
      status: "Shortage",
    };
  }, [attendedClasses, requiredPercent, totalClasses]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Attendance Calculator
            </h1>
            <p className="text-sm text-slate-400">
              Plan your classes to stay above the required percentage.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close calculator"
          >
            <X size={18} />
            <span className="hidden sm:inline cursor-pointer">Close</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <label className="block">
            <span className="text-sm text-slate-300">Total Classes</span>
            <input
              type="number"
              min="0"
              value={totalClasses}
              onChange={(e) => setTotalClasses(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 60"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Attended Classes</span>
            <input
              type="number"
              min="0"
              value={attendedClasses}
              onChange={(e) => setAttendedClasses(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 45"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">Required Percentage</span>
            <input
              type="number"
              min="0"
              max="100"
              value={requiredPercent}
              onChange={(e) => setRequiredPercent(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 75"
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <p className="text-sm text-slate-400">Current Attendance</p>
            <p className="text-3xl font-semibold mt-2">
              {currentPercent.toFixed(2)}%
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <p className="text-sm text-slate-400">Classes Needed</p>
            <p className="text-3xl font-semibold mt-2">{classesNeeded}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4">
            <p className="text-sm text-slate-400">Status</p>
            <p
              className={`text-2xl font-semibold mt-2 ${
                status === "Safe"
                  ? "text-emerald-300"
                  : status === "Shortage"
                  ? "text-amber-300"
                  : "text-slate-200"
              }`}
            >
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalculator;
