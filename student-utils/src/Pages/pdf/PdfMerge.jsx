import { useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { useTheme } from "../../context/ThemeContext";

const PdfMerge = () => {
  const { isDark } = useTheme();
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [message, setMessage] = useState("");
  const [mergedUrl, setMergedUrl] = useState("");

  const previewUrlsRef = useRef(new Set());
  const mergedUrlRef = useRef("");

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      const currentMergedUrl = mergedUrlRef.current;
      if (currentMergedUrl) {
        URL.revokeObjectURL(currentMergedUrl);
      }
    };
  }, []);

  const totalSizeMB = useMemo(() => {
    if (!files.length) return "0.00";
    const bytes = files.reduce((sum, entry) => sum + entry.file.size, 0);
    return (bytes / (1024 * 1024)).toFixed(2);
  }, [files]);

  const readPageCount = async (file) => {
    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      return pdfDoc.getPageCount();
    } catch (err) {
      console.error("Failed to read pages", err);
      return undefined;
    }
  };

  const generateFirstPageImage = async (file) => {
    try {
      // Use the PDF as a data URL for rendering - browser will render first page only in object tag
      // For a true first-page-only approach, we'd need a PDF rendering library like pdfjs
      // But since we're constrained to current deps, the object tag will show the PDF
      // and we'll just limit display height to show mostly first page
      const url = URL.createObjectURL(file);
      return url;
    } catch (err) {
      console.error("Failed to generate preview", err);
      return null;
    }
  };

  const addFiles = async (fileList) => {
    const selected = Array.from(fileList);
    const enriched = await Promise.all(
      selected.map(async (file) => {
        const previewUrl = await generateFirstPageImage(file);
        if (previewUrl) previewUrlsRef.current.add(previewUrl);
        const pages = await readPageCount(file);
        return {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          file,
          previewUrl,
          pages,
        };
      })
    );
    setFiles((prev) => [...prev, ...enriched]);
    setMessage("");
  };

  const handleFileChange = async (event) => {
    const incoming = event.target.files;
    if (!incoming || !incoming.length) return;
    await addFiles(incoming);
    event.target.value = "";
  };

  const move = (id, direction) => {
    setFiles((prev) => {
      const idx = prev.findIndex((entry) => entry.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const remove = (id) => {
    setFiles((prev) => {
      const entry = prev.find((item) => item.id === id);
      if (entry?.previewUrl) {
        URL.revokeObjectURL(entry.previewUrl);
        previewUrlsRef.current.delete(entry.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setMessage("Add at least two PDFs to merge.");
      return;
    }

    setMerging(true);
    setMessage("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const entry of files) {
        const bytes = await entry.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(
          doc,
          doc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      if (mergedUrlRef.current) {
        URL.revokeObjectURL(mergedUrlRef.current);
      }

      mergedUrlRef.current = url;
      setMergedUrl(url);

      const link = document.createElement("a");
      link.href = url;
      link.download = "merged.pdf";
      link.click();
    } catch (err) {
      console.error(err);
      setMessage("Failed to merge. Please try again.");
    } finally {
      setMerging(false);
    }
  };

  const [zoom, setZoom] = useState(100);

  return (
    <div
      className={`min-h-screen pb-10 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <section className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with controls */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between gap-4">
            {/* Zoom & View Tabs */}
            <div className="flex items-center gap-3">
              {/* Zoom Control */}
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  isDark
                    ? "border-slate-600 bg-slate-800/60"
                    : "border-gray-300 bg-white"
                }`}
              >
                <button
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className={`px-2 py-1 text-lg transition-colors ${
                    isDark ? "hover:text-blue-400" : "hover:text-blue-600"
                  }`}
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{zoom}%</span>
                <button
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  className={`px-2 py-1 text-lg transition-colors ${
                    isDark ? "hover:text-blue-400" : "hover:text-blue-600"
                  }`}
                >
                  +
                </button>
              </div>

              {/* Divider */}
              <div
                className={`w-px h-6 ${
                  isDark ? "bg-slate-600" : "bg-gray-300"
                }`}
              />

              {/* View Tabs */}
              <div className="flex gap-2">
                <button
                  className={`px-3 py-2 rounded-lg font-medium border transition-colors ${
                    isDark
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-blue-500 bg-blue-500/10 text-blue-600"
                  }`}
                >
                  📄 Files
                </button>
                <button
                  className={`px-3 py-2 rounded-lg font-medium border transition-colors ${
                    isDark
                      ? "border-slate-600 text-slate-400 hover:border-slate-500"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  📄 Pages
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Total size: {totalSizeMB} MB
              </span>
              <label className="inline-flex cursor-pointer">
                <span
                  className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                    isDark
                      ? "border-slate-600 text-slate-300 hover:border-slate-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  ▼ Add Files
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleMerge}
                disabled={merging || files.length < 2}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-blue-500 text-white hover:bg-blue-400"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                {merging ? "Merging..." : "Merge"}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`px-4 py-2 rounded-lg text-sm ${
                isDark
                  ? "bg-red-500/20 text-red-300"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Files Grid */}
        {files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((entry, index) => (
              <div key={entry.id} className="flex flex-col gap-3">
                {/* Thumbnail */}
                <div
                  className={`relative rounded-xl overflow-hidden border-2 bg-slate-900/30 transition-all ${
                    isDark
                      ? "border-slate-600 hover:border-blue-500"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                  style={{ aspectRatio: "8.5/11" }}
                >
                  {entry.previewUrl ? (
                    <embed
                      src={`${entry.previewUrl}#toolbar=0&navpanes=0&page=1`}
                      type="application/pdf"
                      title={`${entry.file.name} preview`}
                      className="w-full h-full"
                      style={{ pointerEvents: "none" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      No preview
                    </div>
                  )}
                  {entry.pages ? (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/70 text-white">
                      {entry.pages}
                    </div>
                  ) : null}

                  {/* Remove Button Overlay */}
                  <button
                    onClick={() => remove(entry.id)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-md bg-red-500 text-white opacity-0 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <p
                    className={`text-sm font-medium truncate ${
                      isDark ? "text-slate-200" : "text-gray-900"
                    }`}
                  >
                    {entry.file.name.replace(/\.pdf$/i, "")}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    {entry.pages} page{entry.pages === 1 ? "" : "s"} ·{" "}
                    {(entry.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                  {/* Reorder Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => move(entry.id, "up")}
                      disabled={index === 0}
                      className={`flex-1 px-2 py-1 rounded text-xs border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark
                          ? "border-slate-600 text-slate-200 hover:border-slate-400"
                          : "border-gray-300 text-gray-700 hover:border-gray-500"
                      }`}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(entry.id, "down")}
                      disabled={index === files.length - 1}
                      className={`flex-1 px-2 py-1 rounded text-xs border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark
                          ? "border-slate-600 text-slate-200 hover:border-slate-400"
                          : "border-gray-300 text-gray-700 hover:border-gray-500"
                      }`}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border-2 border-dashed ${
              isDark
                ? "border-slate-600 bg-slate-800/30"
                : "border-gray-300 bg-gray-100"
            }`}
          >
            <p
              className={`text-lg font-medium ${
                isDark ? "text-slate-400" : "text-gray-600"
              }`}
            >
              No files yet
            </p>
            <label className="inline-flex cursor-pointer">
              <span
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-blue-500 text-white hover:bg-blue-400"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                Choose PDFs to start
              </span>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Merged Preview */}
        {mergedUrl && (
          <div className="mt-12 space-y-4">
            <h2
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Merged Preview
            </h2>
            <div
              className={`rounded-2xl overflow-hidden border ${
                isDark
                  ? "border-slate-700 bg-slate-800/60"
                  : "border-gray-200 bg-white"
              }`}
              style={{ aspectRatio: "8.5/11", maxWidth: "400px" }}
            >
              <embed
                src={`${mergedUrl}#toolbar=0&navpanes=0&page=1`}
                type="application/pdf"
                className="w-full h-full"
                aria-label="Merged PDF preview"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PdfMerge;
