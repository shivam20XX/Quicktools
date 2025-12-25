import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import {
  Upload,
  Download,
  Loader2,
  AlertCircle,
  FileImage,
  RefreshCw,
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfToJpg = () => {
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
      setImages([]);
      setProgress(0);
    } else {
      setError("Please select a valid PDF file to proceed");
      setFile(null);
    }
  };

  const convertPdfToJpg = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setLoading(true);
    setError("");
    setImages([]);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const convertedImages = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(Math.round((pageNum / numPages) * 100));

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better quality

        // Create canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convert canvas to JPG blob
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/jpeg", 0.95);
        });

        convertedImages.push({
          blob,
          pageNumber: pageNum,
          width: viewport.width,
          height: viewport.height,
        });
      }

      setImages(convertedImages);
      setLoading(false);
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Failed to convert PDF. Please try another file.");
      setLoading(false);
    }
  };

  const downloadImage = (image) => {
    const url = URL.createObjectURL(image.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name.replace(".pdf", "")}_page_${
      image.pageNumber
    }.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAllImages = () => {
    images.forEach((image) => {
      setTimeout(() => downloadImage(image), image.pageNumber * 100);
    });
  };

  const resetTool = () => {
    setFile(null);
    setError("");
    setImages([]);
    setProgress(0);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            PDF to JPG Converter
          </h1>
          <p className={`${isDark ? "text-slate-300" : "text-gray-600"}`}>
            Convert each page of your PDF document to high-quality JPG images.
            All processing happens in your browser.
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
          <input
            type="file"
            id="pdf-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="pdf-upload"
            className={`cursor-pointer inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Choose PDF File
          </label>
          {file && (
            <p
              className={`mt-4 ${isDark ? "text-slate-300" : "text-gray-700"}`}
            >
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Convert Button */}
        {file && !images.length && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={convertPdfToJpg}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDark
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting... {progress}%
                </>
              ) : (
                <>
                  <FileImage className="w-5 h-5" />
                  Convert to JPG
                </>
              )}
            </button>

            {!loading && (
              <button
                onClick={resetTool}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {loading && (
          <div className="mb-8">
            <div
              className={`h-2 rounded-full overflow-hidden ${
                isDark ? "bg-slate-700" : "bg-gray-200"
              }`}
            >
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Results Section */}
        {images.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Converted Images ({images.length})
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={downloadAllImages}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <Download className="w-5 h-5" />
                  Download All
                </button>
                <button
                  onClick={resetTool}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.pageNumber}
                  className={`rounded-lg border overflow-hidden ${
                    isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={URL.createObjectURL(image.blob)}
                      alt={`Page ${image.pageNumber}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <p
                      className={`font-medium mb-2 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Page {image.pageNumber}
                    </p>
                    <p
                      className={`text-sm mb-3 ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      {Math.round(image.width / 2)} ×{" "}
                      {Math.round(image.height / 2)} px
                    </p>
                    <button
                      onClick={() => downloadImage(image)}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PdfToJpg;
