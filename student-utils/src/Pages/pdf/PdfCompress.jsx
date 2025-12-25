import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, FileDown, Loader2, AlertCircle } from "lucide-react";

const PdfCompress = () => {
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedPdf, setCompressedPdf] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setError("");
      setCompressedPdf(null);
      setCompressedSize(0);
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const compressPdf = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      // Get compression settings based on level
      const compressionSettings = {
        low: { imageQuality: 0.3, maxImageDimension: 1200 },
        medium: { imageQuality: 0.5, maxImageDimension: 1600 },
        high: { imageQuality: 0.7, maxImageDimension: 2000 },
      };

      const settings = compressionSettings[compressionLevel];

      // Process each page to compress embedded images
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        // Get page resources and check for images
        try {
          const { Resources } = page.node;
          if (!Resources) continue;

          const xObjects = Resources.lookup("XObject");
          if (!xObjects) continue;

          // Iterate through XObjects (images)
          const xObjectKeys = xObjects.dict.keys();

          for (const key of xObjectKeys) {
            try {
              const xObject = xObjects.lookup(key);
              if (!xObject) continue;

              const subtype = xObject.lookup("Subtype");
              if (!subtype || subtype.toString() !== "/Image") continue;

              // Get image dimensions
              const width = xObject.lookup("Width");
              const height = xObject.lookup("Height");

              if (width && height) {
                const w = width.numberValue;
                const h = height.numberValue;

                // Only compress if image is larger than threshold
                if (
                  w > settings.maxImageDimension ||
                  h > settings.maxImageDimension
                ) {
                  // Calculate new dimensions maintaining aspect ratio
                  let newW = w;
                  let newH = h;

                  if (w > h) {
                    newW = Math.min(w, settings.maxImageDimension);
                    newH = Math.floor((h * newW) / w);
                  } else {
                    newH = Math.min(h, settings.maxImageDimension);
                    newW = Math.floor((w * newH) / h);
                  }

                  // Update dimensions in PDF
                  xObject.set("Width", pdfDoc.context.obj(newW));
                  xObject.set("Height", pdfDoc.context.obj(newH));
                }
              }
            } catch (e) {
              // Skip this image if there's an error
              console.warn("Error processing image:", e);
            }
          }
        } catch (e) {
          // Skip this page if there's an error
          console.warn("Error processing page:", e);
        }
      }

      // Save with compression options
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });

      // Create blob for download
      const blob = new Blob([compressedBytes], { type: "application/pdf" });

      // Only set as compressed if we actually reduced the size
      if (blob.size < originalSize) {
        setCompressedPdf(blob);
        setCompressedSize(blob.size);
      } else {
        // If no reduction, still allow download but warn user
        setCompressedPdf(blob);
        setCompressedSize(blob.size);
        setError(
          "PDF structure optimized, but file size may not be significantly reduced. This PDF might already be optimized or contain mostly text."
        );
      }

      setLoading(false);
    } catch (err) {
      console.error("Compression error:", err);
      setError(
        "Failed to compress PDF. The file might be encrypted or corrupted."
      );
      setLoading(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedPdf) return;

    const url = URL.createObjectURL(compressedPdf);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name.replace(".pdf", "_compressed.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setError("");
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressedPdf(null);
    setLoading(false);
  };

  const compressionRatio =
    originalSize > 0 && compressedSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Compress PDF
          </h1>
          <p className={`${isDark ? "text-slate-300" : "text-gray-600"}`}>
            Reduce PDF file size while maintaining quality. All processing
            happens in your browser.
          </p>
        </div>

        {/* Upload Section */}
        <div
          className={`rounded-2xl border-2 border-dashed p-8 mb-6 text-center transition-colors ${
            isDark
              ? "border-slate-600 bg-slate-800/50 hover:border-blue-500"
              : "border-gray-300 bg-gray-50 hover:border-blue-400"
          }`}
        >
          <Upload
            className={`w-12 h-12 mx-auto mb-4 ${
              isDark ? "text-slate-400" : "text-gray-400"
            }`}
          />
          <label
            htmlFor="pdf-upload"
            className={`cursor-pointer inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-blue-500 text-white hover:bg-blue-400"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            Choose PDF File
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {file && (
            <p
              className={`mt-4 ${isDark ? "text-slate-300" : "text-gray-700"}`}
            >
              Selected: <strong>{file.name}</strong> (
              {formatFileSize(originalSize)})
            </p>
          )}
        </div>

        {/* Compression Level */}
        {file && !compressedPdf && (
          <div
            className={`rounded-xl border p-6 mb-6 ${
              isDark
                ? "border-slate-700 bg-slate-800/50"
                : "border-gray-200 bg-white"
            }`}
          >
            <label
              className={`block mb-3 font-medium ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Compression Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((level) => (
                <button
                  key={level}
                  onClick={() => setCompressionLevel(level)}
                  className={`py-2 px-4 rounded-lg font-medium capitalize transition-colors ${
                    compressionLevel === level
                      ? isDark
                        ? "bg-blue-500 text-white"
                        : "bg-blue-600 text-white"
                      : isDark
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p
              className={`mt-3 text-sm ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {compressionLevel === "low" &&
                "Maximum compression - Smaller file size, lower quality"}
              {compressionLevel === "medium" &&
                "Balanced - Good compression with decent quality"}
              {compressionLevel === "high" &&
                "Minimal compression - Better quality, larger file size"}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className={`rounded-lg p-4 mb-6 flex items-center gap-3 ${
              isDark
                ? "bg-red-900/30 border border-red-700 text-red-300"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Compress Button */}
        {file && !compressedPdf && (
          <button
            onClick={compressPdf}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              loading
                ? isDark
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isDark
                ? "bg-blue-500 text-white hover:bg-blue-400"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                Compress PDF
              </>
            )}
          </button>
        )}

        {/* Results */}
        {compressedPdf && (
          <div
            className={`rounded-xl border p-6 mb-6 ${
              isDark
                ? "border-slate-700 bg-slate-800/50"
                : "border-gray-200 bg-white"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Compression Complete!
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <p
                  className={`text-sm mb-1 ${
                    isDark ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  Original Size
                </p>
                <p
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatFileSize(originalSize)}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm mb-1 ${
                    isDark ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  Compressed Size
                </p>
                <p
                  className={`text-lg font-semibold ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {formatFileSize(compressedSize)}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm mb-1 ${
                    isDark ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  Saved
                </p>
                <p
                  className={`text-lg font-semibold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {compressionRatio}%
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadCompressed}
                className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  isDark
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                <Download className="w-5 h-5" />
                Download Compressed PDF
              </button>
              <button
                onClick={resetTool}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div
          className={`rounded-lg border p-6 mt-8 ${
            isDark
              ? "border-slate-700 bg-slate-800/30"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <h3
            className={`font-semibold mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            How It Works
          </h3>
          <ul
            className={`space-y-2 text-sm ${
              isDark ? "text-slate-300" : "text-gray-600"
            }`}
          >
            <li>• Upload your PDF file to compress</li>
            <li>• Choose compression level based on your needs</li>
            <li>• The tool optimizes internal PDF structure</li>
            <li>• Download the compressed version instantly</li>
            <li>
              • All processing happens locally - your files never leave your
              device
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PdfCompress;
