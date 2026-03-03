import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const TryNow = () => {
  const { image, resultImage, removeBg } = useContext(AppContext);
  const [originalUrl, setOriginalUrl] = useState("");

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setOriginalUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // cleanup on unmount
    }
  }, [image]);

  return (
    <div className="flex flex-col items-center justify-center bg-white px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-7 text-center">
        Remove Image Background.
      </h2>
      <p className="text-gray-500 mb-8 text-center">
        Get a transparent background for any image.
      </p>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center space-y-4 mb-10">
        <input
          type="file"
          id="upload"
          hidden
          accept="image/*"
          onChange={(e) => removeBg(e.target.files[0])}
        />
        <label htmlFor="upload">
          <span className="bg-indigo-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full text-lg cursor-pointer">
            Upload Image
          </span>
        </label>
        <p className="text-gray-500 text-sm">
          or drop a file, paste image or <a href="#" className="text-blue-500 underline">URL</a>
        </p>
      </div>

      {/* Preview Images Side by Side */}
      {(image || resultImage) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-16">
          {/* Original Image */}
          <div className="flex flex-col items-center">
            <p className="font-semibold text-gray-600 mb-2">Original Image</p>
            {originalUrl && (
              <img
                src={originalUrl}
                alt="Original"
                className="w-full max-h-[40px] object-contain rounded-lg border"
              />
            )}
          </div>

          {/* Background Removed Image */}
          <div className="flex flex-col items-center">
            <p className="font-semibold text-gray-600 mb-2">Background Removed</p>
            <div className="w-full h-full min-h-[200px] relative border rounded-lg bg-gray-100">
              {resultImage ? (
                <img
                  src={resultImage}
                  alt="Background Removed"
                  className="w-full max-h-[40px] object-contain rounded-lg"
                />
              ) : image ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="border-4 border-indigo-600 rounded-full h-12 w-12 border-t-transparent animate-spin"></div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryNow;
