import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Upload,
  Download,
  Crop,
  Loader2,
  AlertCircle,
  Lock,
  Unlock,
} from "lucide-react";

const ImageResize = () => {
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resizedImage, setResizedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")
    ) {
      setFile(selectedFile);
      setError("");
      setResizedImage(null);

      // Create preview and get dimensions
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(img.width.toString());
          setHeight(img.height.toString());
          setPreview(reader.result);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setError("Please select a valid JPG or PNG image");
      setFile(null);
      setPreview(null);
    }
  };

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions.width > 0 && newWidth) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      const calculatedHeight = Math.round(parseInt(newWidth) * aspectRatio);
      setHeight(calculatedHeight.toString());
    }
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions.height > 0 && newHeight) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const calculatedWidth = Math.round(parseInt(newHeight) * aspectRatio);
      setWidth(calculatedWidth.toString());
    }
  };

  const resizeImage = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    const newWidth = parseInt(width);
    const newHeight = parseInt(height);

    if (!newWidth || !newHeight || newWidth <= 0 || newHeight <= 0) {
      setError("Please enter valid width and height values");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // For resizing, we'll use canvas for precise dimension control
      // browser-image-compression doesn't support exact width AND height
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResizedImage(blob);
              setLoading(false);
            } else {
              setError("Failed to resize image");
              setLoading(false);
            }
          },
          file.type,
          1.0 // Use max quality for resizing
        );
      };

      img.onerror = () => {
        setError("Failed to load image");
        setLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Resize error:", err);
      setError("Failed to resize image. Please try another file.");
      setLoading(false);
    }
  };

  const downloadResized = () => {
    if (!resizedImage) return;

    const url = URL.createObjectURL(resizedImage);
    const link = document.createElement("a");
    link.href = url;

    const extension = file.type === "image/jpeg" ? ".jpg" : ".png";
    link.download =
      file.name.replace(/\.[^/.]+$/, "") + `_${width}x${height}` + extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setError("");
    setResizedImage(null);
    setPreview(null);
    setWidth("");
    setHeight("");
    setOriginalDimensions({ width: 0, height: 0 });
    setLoading(false);
  };

  const setPresetSize = (presetWidth, presetHeight) => {
    setWidth(presetWidth.toString());
    setHeight(presetHeight.toString());
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
            Resize Image
          </h1>
          <p className={`${isDark ? "text-slate-300" : "text-gray-600"}`}>
            Change image dimensions to any size you need. Supports JPG and PNG
            formats.
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
              Selected: <strong>{file.name}</strong> ({originalDimensions.width}{" "}
              x {originalDimensions.height}px)
            </p>
          )}
        </div>

        {/* Preview */}
        {preview && !resizedImage && (
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

        {/* Dimension Controls */}
        {file && !resizedImage && (
          <div
            className={`rounded-xl border p-6 mb-6 ${
              isDark
                ? "border-slate-700 bg-slate-800/50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <label
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                New Dimensions
              </label>
              <button
                onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  maintainAspectRatio
                    ? isDark
                      ? "bg-blue-500 text-white"
                      : "bg-blue-600 text-white"
                    : isDark
                    ? "bg-slate-700 text-slate-300"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {maintainAspectRatio ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Aspect Ratio Locked
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Aspect Ratio Unlocked
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className={`block text-sm mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-600"
                  }`}
                >
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Width"
                />
              </div>
              <div>
                <label
                  className={`block text-sm mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-600"
                  }`}
                >
                  Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Height"
                />
              </div>
            </div>

            {/* Preset Sizes */}
            <div>
              <label
                className={`block text-sm mb-2 ${
                  isDark ? "text-slate-300" : "text-gray-600"
                }`}
              >
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPresetSize(1920, 1080)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    isDark
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  1920x1080 (HD)
                </button>
                <button
                  onClick={() => setPresetSize(1280, 720)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    isDark
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  1280x720 (HD)
                </button>
                <button
                  onClick={() => setPresetSize(800, 600)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    isDark
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  800x600
                </button>
                <button
                  onClick={() => setPresetSize(500, 500)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    isDark
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  500x500 (Square)
                </button>
              </div>
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

        {/* Resize Button */}
        {file && !resizedImage && (
          <button
            onClick={resizeImage}
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
                Resizing...
              </>
            ) : (
              <>
                <Crop className="w-5 h-5" />
                Resize Image
              </>
            )}
          </button>
        )}

        {/* Results */}
        {resizedImage && (
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
              Resize Complete!
            </h3>

            <div className="mb-6">
              <p
                className={`text-sm mb-2 ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                New Dimensions:{" "}
                <strong>
                  {width} x {height}px
                </strong>
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Original: {originalDimensions.width} x{" "}
                {originalDimensions.height}px
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadResized}
                className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  isDark
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                <Download className="w-5 h-5" />
                Download Resized Image
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
            <li>• Enter new width and height or choose a preset size</li>
            <li>
              • Lock aspect ratio to maintain proportions or unlock for custom
              sizing
            </li>
            <li>• Preview and download your resized image</li>
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

export default ImageResize;
