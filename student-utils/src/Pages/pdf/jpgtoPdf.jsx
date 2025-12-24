import React, { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { useTheme } from "../../context/ThemeContext";

const JpgToPdf = () => {
  const { isDark } = useTheme();
  const [images, setImages] = useState([]); // [{file, url, id}]
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // cleanup object URLs on unmount
    return () => {
      images.forEach((img) => img.url && URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const handleSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const accepted = files.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    const withUrls = accepted.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...withUrls]);
    event.target.value = ""; // allow re-selecting same files
  };

  const remove = (id) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((img) => img.url && URL.revokeObjectURL(img.url));
    setImages([]);
  };

  const buildPdf = async () => {
    if (!images.length) return;
    setBusy(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const bytes = await item.file.arrayBuffer();
        const isJpg = item.file.type === "image/jpeg";
        const embedded = isJpg
          ? await pdfDoc.embedJpg(bytes)
          : await pdfDoc.embedPng(bytes);

        const { width, height } = embedded.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embedded, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "images.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to create PDF", err);
      alert("Failed to create PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            JPG/PNG to PDF
          </h1>
          <p className={isDark ? "text-slate-300" : "text-gray-600"}>
            Add one or multiple images; each becomes its own page. Everything
            stays in your browser.
          </p>
        </div>

        <div
          className={`rounded-2xl border p-6 flex flex-col gap-6 ${
            isDark
              ? "border-slate-700 bg-slate-800/70"
              : "border-gray-200 bg-white shadow-sm"
          }`}
        >
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => inputRef.current?.click()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${
                isDark
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              Select images
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={handleSelect}
            />

            {images.length > 0 && (
              <>
                <button
                  onClick={clearAll}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? "text-slate-200 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Clear all
                </button>
                <div
                  className={`text-sm font-medium px-3 py-2 rounded-full ${
                    isDark
                      ? "bg-slate-700 text-slate-100"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {images.length} file{images.length > 1 ? "s" : ""}
                </div>
              </>
            )}
          </div>

          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border overflow-hidden flex ${
                    isDark
                      ? "border-slate-700 bg-slate-800/70"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 bg-black/5 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.file.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <p
                        className={`text-sm font-semibold line-clamp-2 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.file.name}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isDark ? "text-slate-300" : "text-gray-600"
                        }`}
                      >
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className={`self-start text-xs font-medium mt-2 px-3 py-1 rounded-lg transition-colors ${
                        isDark
                          ? "text-red-200 hover:text-red-100"
                          : "text-red-600 hover:text-red-700"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center ${
                isDark
                  ? "border-slate-700 bg-slate-800/50 text-slate-300"
                  : "border-gray-300 bg-gray-50 text-gray-600"
              }`}
            >
              <p className="font-medium mb-1">No images selected</p>
              <p className="text-sm">Upload JPG or PNG files to get started.</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={buildPdf}
              disabled={busy || !images.length}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto ${
                isDark
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              {busy ? "Creating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JpgToPdf;
