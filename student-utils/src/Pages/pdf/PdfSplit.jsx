import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { PDFDocument } from "pdf-lib";

const PdfSplit = () => {
  const { isDark } = useTheme();

  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [mode, setMode] = useState("all"); // 'all' | 'ranges'
  const [rangesText, setRangesText] = useState("");
  const [rangeWarning, setRangeWarning] = useState("");
  const [busy, setBusy] = useState(false);
  const [outputs, setOutputs] = useState([]); // [{name,url}]
  const originalBytesRef = useRef(null);
  const fileUrlRef = useRef("");

  useEffect(() => {
    return () => {
      outputs.forEach((o) => URL.revokeObjectURL(o.url));
      if (fileUrlRef.current) {
        URL.revokeObjectURL(fileUrlRef.current);
        fileUrlRef.current = "";
      }
    };
  }, [outputs]);

  const handleSelect = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const bytes = await f.arrayBuffer();
      originalBytesRef.current = bytes;
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
      setFile({ name: f.name, size: f.size });
      // create/reuse object URL for thumbnail rendering
      if (fileUrlRef.current) {
        URL.revokeObjectURL(fileUrlRef.current);
      }
      fileUrlRef.current = URL.createObjectURL(f);
      setOutputs((prev) => {
        prev.forEach((o) => URL.revokeObjectURL(o.url));
        return [];
      });
    } catch (err) {
      console.error("Failed to read PDF", err);
      alert("Unable to open PDF. Please select a valid file.");
    } finally {
      e.target.value = "";
    }
  };

  const parseRangesWithWarnings = (text, maxPages) => {
    const parts = text.split(/[,\s]+/).filter(Boolean);
    const ranges = [];
    const warnings = [];
    for (const part of parts) {
      const m = part.match(/^(\d+)(?:-(\d+))?$/);
      if (!m) {
        warnings.push(`Ignored "${part}"`);
        continue;
      }
      let start = parseInt(m[1], 10);
      let end = m[2] ? parseInt(m[2], 10) : start;
      if (Number.isNaN(start) || Number.isNaN(end)) {
        warnings.push(`Ignored "${part}"`);
        continue;
      }
      if (start > end) {
        [start, end] = [end, start];
        warnings.push(`Reordered "${part}" to ${start}-${end}`);
      }
      const adjStart = Math.max(1, Math.min(maxPages, start));
      const adjEnd = Math.max(1, Math.min(maxPages, end));
      if (adjStart !== start || adjEnd !== end) {
        warnings.push(`Adjusted "${part}" to ${adjStart}-${adjEnd}`);
      }
      ranges.push([adjStart, adjEnd]);
    }
    return { ranges, warnings };
  };

  const splitAllPages = async () => {
    const srcDoc = await PDFDocument.load(originalBytesRef.current);
    const results = [];
    for (let i = 0; i < srcDoc.getPageCount(); i++) {
      const out = await PDFDocument.create();
      const [page] = await out.copyPages(srcDoc, [i]);
      out.addPage(page);
      const bytes = await out.save();
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" })
      );
      results.push({ name: `page-${i + 1}.pdf`, url });
    }
    return results;
  };

  const splitByRanges = async (ranges) => {
    const srcDoc = await PDFDocument.load(originalBytesRef.current);
    const results = [];
    for (const [start, end] of ranges) {
      const out = await PDFDocument.create();
      const indices = Array.from(
        { length: end - start + 1 },
        (_, k) => start - 1 + k
      );
      const pages = await out.copyPages(srcDoc, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" })
      );
      results.push({ name: `pages-${start}-${end}.pdf`, url });
    }
    return results;
  };

  const generate = async () => {
    if (!originalBytesRef.current) return;
    setBusy(true);
    try {
      let results = [];
      if (mode === "all") {
        results = await splitAllPages();
      } else {
        const { ranges, warnings } = parseRangesWithWarnings(
          rangesText.trim(),
          pageCount || 1
        );
        setRangeWarning(warnings.join("; "));
        if (!ranges.length) {
          alert("Enter valid ranges like 1-3,4,7-9");
          return;
        }
        results = await splitByRanges(ranges);
      }
      // cleanup previous
      setOutputs((prev) => {
        prev.forEach((o) => URL.revokeObjectURL(o.url));
        return results;
      });
    } catch (err) {
      console.error("Split failed", err);
      alert("Failed to split PDF");
    } finally {
      setBusy(false);
    }
  };

  const clearOutputs = () => {
    setOutputs((prev) => {
      prev.forEach((o) => URL.revokeObjectURL(o.url));
      return [];
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1
          className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Split PDF
        </h1>
        <p className={`${isDark ? "text-slate-300" : "text-gray-600"} mb-8`}>
          Separate a PDF into individual pages or custom ranges. Runs locally in
          your browser for privacy.
        </p>
        <div
          className={`rounded-2xl border p-6 flex flex-col gap-6 ${
            isDark
              ? "border-slate-700 bg-slate-800/60"
              : "border-gray-200 bg-white shadow-sm"
          }`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <label
              className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isDark
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleSelect}
              />
              Select PDF
            </label>
            {file && (
              <div
                className={`text-sm px-3 py-2 rounded-full ${
                  isDark
                    ? "bg-slate-700 text-slate-100"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {file.name} • {pageCount} pages •{" "}
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer ${
                isDark
                  ? "border-slate-700 bg-slate-800/50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <input
                type="radio"
                name="mode"
                value="all"
                checked={mode === "all"}
                onChange={(e) => setMode(e.target.value)}
              />
              <div>
                <p
                  className={
                    isDark
                      ? "text-white font-semibold"
                      : "text-gray-900 font-semibold"
                  }
                >
                  Split every page
                </p>
                <p
                  className={
                    isDark ? "text-slate-300 text-sm" : "text-gray-600 text-sm"
                  }
                >
                  Creates one PDF per page.
                </p>
              </div>
            </label>
            <div
              className={`rounded-xl border p-4 ${
                isDark
                  ? "border-slate-700 bg-slate-800/50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <label className="flex items-start gap-3">
                <input
                  type="radio"
                  name="mode"
                  value="ranges"
                  checked={mode === "ranges"}
                  onChange={(e) => setMode(e.target.value)}
                />
                <div className="flex-1">
                  <p
                    className={
                      isDark
                        ? "text-white font-semibold"
                        : "text-gray-900 font-semibold"
                    }
                  >
                    Split by page range
                  </p>
                  <p
                    className={
                      isDark
                        ? "text-slate-300 text-sm"
                        : "text-gray-600 text-sm"
                    }
                  >
                    Example: 1-3, 4, 7-9
                  </p>
                  <input
                    type="text"
                    placeholder="Enter ranges"
                    value={rangesText}
                    onChange={(e) => setRangesText(e.target.value)}
                    className={`mt-2 w-full px-3 py-2 rounded-md border ${
                      isDark
                        ? "bg-slate-900 border-slate-700 text-white placeholder-slate-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  {rangeWarning && (
                    <p
                      className={`mt-1 text-xs ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {rangeWarning}
                    </p>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Thumbnails */}
          {file && pageCount && (
            <div className="mt-2">
              <p
                className={
                  isDark ? "text-slate-300 mb-2" : "text-gray-600 mb-2"
                }
              >
                Preview pages
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <div
                      key={pageNum}
                      className={`rounded-lg border overflow-hidden ${
                        isDark
                          ? "border-slate-700 bg-slate-800/50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="h-28 sm:h-32 overflow-hidden">
                        {fileUrlRef.current && (
                          <object
                            data={`${fileUrlRef.current}#page=${pageNum}`}
                            type="application/pdf"
                            className="w-full h-full pointer-events-none"
                          ></object>
                        )}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 ${
                          isDark ? "text-slate-300" : "text-gray-700"
                        }`}
                      >
                        Page {pageNum}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={generate}
              disabled={busy || !file}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              {busy ? "Splitting..." : "Generate"}
            </button>
          </div>

          {/* Outputs */}
          {outputs.length > 0 && (
            <div
              className={`rounded-xl border p-4 ${
                isDark
                  ? "border-slate-700 bg-slate-800/50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p
                  className={
                    isDark
                      ? "text-white font-semibold"
                      : "text-gray-900 font-semibold"
                  }
                >
                  Generated files ({outputs.length})
                </p>
                <button
                  onClick={clearOutputs}
                  className={
                    isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {outputs.map((o, idx) => (
                  <a
                    key={idx}
                    href={o.url}
                    download={o.name}
                    className={`block px-4 py-2 rounded-lg font-medium text-center transition-colors ${
                      isDark
                        ? "bg-slate-700 text-white hover:bg-slate-600"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {o.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PdfSplit;
