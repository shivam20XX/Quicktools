import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import imageCompression from "browser-image-compression";
import {
  Upload,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

const ImageConvert = () => {
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [convertedImage, setConvertedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [targetFormat, setTargetFormat] = useState("png");
  const [originalFormat, setOriginalFormat] = useState("");

  const formatOptions = [
    { value: "png", label: "PNG" },
    { value: "jpeg", label: "JPG" },
    { value: "webp", label: "WebP" },
    { value: "svg", label: "SVG (embedded)" },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError("");
      setConvertedImage(null);

      // Determine original format
      let format = selectedFile.type.split("/")[1];
      if (format === "jpeg") format = "jpg";
      setOriginalFormat(format);

      // Set default target format based on original
      if (format === "png") {
        setTargetFormat("jpeg");
      } else {
        setTargetFormat("png");
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError("Please select a valid JPG, PNG, WebP, or GIF image");
      setFile(null);
      setPreview(null);
    }
  };

  const convertImage = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    if (
      originalFormat === targetFormat ||
      (originalFormat === "jpg" && targetFormat === "jpeg")
    ) {
      setError("Source and target formats are the same");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (targetFormat === "svg") {
        // Convert to SVG by embedding image as data URI
        convertToSVG();
      } else {
        // Convert using canvas
        convertUsingCanvas();
      }
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Failed to convert image. Please try another file.");
      setLoading(false);
    }
  };

  const convertUsingCanvas = async () => {
    try {
      // Map format to MIME type
      const mimeType =
        targetFormat === "jpeg"
          ? "image/jpeg"
          : targetFormat === "webp"
          ? "image/webp"
          : "image/png";

      const options = {
        maxSizeMB: 10, // Don't compress, just convert
        useWebWorker: true,
        fileType: mimeType,
        initialQuality: 0.95,
      };

      const convertedFile = await imageCompression(file, options);
      setConvertedImage(convertedFile);
      setLoading(false);
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Failed to convert image");
      setLoading(false);
    }
  };

  const convertToSVG = () => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create SVG with embedded image
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
  <image width="${img.width}" height="${img.height}" xlink:href="${e.target.result}"/>
</svg>`;

        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        setConvertedImage(blob);
        setLoading(false);
      };

      img.onerror = () => {
        setError("Failed to create SVG");
        setLoading(false);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const downloadConverted = () => {
    if (!convertedImage) return;

    const url = URL.createObjectURL(convertedImage);
    const link = document.createElement("a");
    link.href = url;

    const extension = targetFormat === "jpeg" ? ".jpg" : `.${targetFormat}`;
    link.download =
      file.name.replace(/\.[^/.]+$/, "") + `_converted${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setError("");
    setConvertedImage(null);
    setPreview(null);
    setOriginalFormat("");
    setTargetFormat("png");
    setLoading(false);
  };

  const getConversionInfo = () => {
    const info = {
      jpeg: "JPG format is best for photographs with high compression and smaller file sizes.",
      png: "PNG format supports transparency and is ideal for graphics and logos.",
      webp: "WebP provides superior compression for both lossy and lossless images.",
      svg: "SVG embeds your image in a scalable vector format (image remains raster).",
    };
    return info[targetFormat] || "";
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Convert Image
          </h1>
          <p className={`${isDark ? "text-slate-300" : "text-gray-600"}`}>
            Convert between JPG, PNG, WebP, GIF, and SVG formats. All processing
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
            htmlFor="image-upload"
            className={`cursor-pointer inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-blue-500 text-white hover:bg-blue-400"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            Choose Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
          {file && (
            <p
              className={`mt-4 ${isDark ? "text-slate-300" : "text-gray-700"}`}
            >
              Selected: <strong>{file.name}</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  isDark ? "bg-slate-700" : "bg-gray-200"
                }`}
              >
                {originalFormat.toUpperCase()}
              </span>
            </p>
          )}
        </div>

        {/* Preview */}
        {preview && !convertedImage && (
          <div
            className={`rounded-xl border p-6 mb-6 ${
              isDark
                ? "border-slate-700 bg-slate-800/50"
                : "border-gray-200 bg-white"
            }`}
          >
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
            />
          </div>
        )}

        {/* Format Selection */}
        {file && !convertedImage && (
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
              Convert to Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {formatOptions.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setTargetFormat(format.value)}
                  disabled={
                    originalFormat === format.value ||
                    (originalFormat === "jpg" && format.value === "jpeg")
                  }
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    targetFormat === format.value
                      ? isDark
                        ? "bg-blue-500 text-white"
                        : "bg-blue-600 text-white"
                      : originalFormat === format.value ||
                        (originalFormat === "jpg" && format.value === "jpeg")
                      ? "opacity-40 cursor-not-allowed " +
                        (isDark
                          ? "bg-slate-800 text-slate-500"
                          : "bg-gray-100 text-gray-400")
                      : isDark
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
            <p
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {getConversionInfo()}
            </p>
          </div>
        )}

        {/* Conversion Guide */}
        {file && !convertedImage && (
          <div
            className={`rounded-lg border p-4 mb-6 ${
              isDark
                ? "border-blue-700/50 bg-blue-900/20"
                : "border-blue-200 bg-blue-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <RefreshCw
                className={`w-5 h-5 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <p
                className={`text-sm ${
                  isDark ? "text-blue-300" : "text-blue-700"
                }`}
              >
                Converting from <strong>{originalFormat.toUpperCase()}</strong>{" "}
                to <strong>{targetFormat.toUpperCase()}</strong>
              </p>
            </div>
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

        {/* Convert Button */}
        {file && !convertedImage && (
          <button
            onClick={convertImage}
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
                Converting...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Convert Image
              </>
            )}
          </button>
        )}

        {/* Results */}
        {convertedImage && (
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
              Conversion Complete!
            </h3>

            <div className="mb-6">
              <p
                className={`text-sm mb-2 ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Converted from <strong>{originalFormat.toUpperCase()}</strong>{" "}
                to <strong>{targetFormat.toUpperCase()}</strong>
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                {targetFormat === "svg"
                  ? "Note: SVG contains embedded raster image, not true vector graphics"
                  : "Image dimensions and quality preserved"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadConverted}
                className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  isDark
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                <Download className="w-5 h-5" />
                Download {targetFormat.toUpperCase()}
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
            Supported Conversions
          </h3>
          <ul
            className={`space-y-2 text-sm ${
              isDark ? "text-slate-300" : "text-gray-600"
            }`}
          >
            <li>
              • JPG ↔ PNG - Convert between compressed and lossless formats
            </li>
            <li>• WebP ↔ JPG/PNG - Modern format with better compression</li>
            <li>• GIF → PNG - Convert animated or static GIFs to PNG</li>
            <li>• Any format → SVG - Embed raster image in SVG container</li>
            <li>
              • All processing happens in your browser - images never leave your
              device
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default ImageConvert;
