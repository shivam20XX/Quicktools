import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import imageCompression from "browser-image-compression";
import {
  Upload,
  Download,
  Minimize2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const ImageCompress = () => {
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedImage, setCompressedImage] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [preview, setPreview] = useState(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")
    ) {
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setError("");
      setCompressedImage(null);
      setCompressedSize(0);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError("Please select a valid JPG or PNG image");
      setFile(null);
      setPreview(null);
    }
  };

  const compressImage = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Calculate max size in MB based on quality
      let maxSizeMB = 1;
      if (quality < 0.3) {
        maxSizeMB = 0.5;
      } else if (quality < 0.5) {
        maxSizeMB = 1;
      } else if (quality < 0.7) {
        maxSizeMB = 2;
      } else {
        maxSizeMB = 3;
      }

      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight:
          quality < 0.3
            ? 1200
            : quality < 0.5
            ? 1600
            : quality < 0.7
            ? 2000
            : undefined,
        useWebWorker: true,
        initialQuality: quality,
      };

      const compressedFile = await imageCompression(file, options);

      // Only accept if file size is actually reduced
      if (compressedFile.size < originalSize) {
        setCompressedImage(compressedFile);
        setCompressedSize(compressedFile.size);
        setLoading(false);
      } else {
        setCompressedImage(compressedFile);
        setCompressedSize(compressedFile.size);
        setError(
          "Image processed, but size reduction is minimal. Image may already be optimized."
        );
        setLoading(false);
      }
    } catch (err) {
      console.error("Compression error:", err);
      setError("Failed to compress image. Please try another file.");
      setLoading(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;

    const url = URL.createObjectURL(compressedImage);
    const link = document.createElement("a");
    link.href = url;

    // Determine file extension based on blob type
    let extension = ".jpg";
    if (compressedImage.type === "image/png") {
      extension = ".png";
    } else if (compressedImage.type === "image/jpeg") {
      extension = ".jpg";
    }

    link.download =
      file.name.replace(/\.[^/.]+$/, "") + "_compressed" + extension;
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
    setCompressedImage(null);
    setPreview(null);
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
            Compress Image
          </h1>
          <p className={`${isDark ? "text-slate-300" : "text-gray-600"}`}>
            Reduce image file size while maintaining quality. Supports JPG and
            PNG formats.
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
            accept="image/jpeg,image/png"
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

        {/* Preview */}
        {preview && !compressedImage && (
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

        {/* Quality Slider */}
        {file && !compressedImage && (
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
              Compression Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700"
            />
            <div className="flex justify-between mt-2">
              <span
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Lower quality (smaller file)
              </span>
              <span
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Higher quality (larger file)
              </span>
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
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Compress Button */}
        {file && !compressedImage && (
          <button
            onClick={compressImage}
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
                <Minimize2 className="w-5 h-5" />
                Compress Image
              </>
            )}
          </button>
        )}

        {/* Results */}
        {compressedImage && (
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
                Download Compressed Image
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
            <li>• Upload your JPG or PNG image</li>
            <li>• Adjust quality slider to control compression level</li>
            <li>
              • Lower quality = smaller file size, Higher quality = better image
            </li>
            <li>• Preview and download your compressed image</li>
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

export default ImageCompress;
