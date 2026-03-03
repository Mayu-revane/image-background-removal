import { useEffect, useState } from "react";
import { useContest } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Result = () => {
  const { image, resultImage, setImage, setResultImage } = useContest();
  const [originalUrl, setOriginalUrl] = useState("");
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgType, setBgType] = useState("solid");
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [selectedTexture, setSelectedTexture] = useState(0);

  // Background options
  const gradients = [
    { name: "Blue to Purple", colors: ["#667eea", "#764ba2"] },
    { name: "Sunset", colors: ["#ff7e5f", "#feb47b"] },
    { name: "Ocean", colors: ["#00b09b", "#96c93d"] },
    { name: "Pink Glow", colors: ["#ff9a9e", "#fecfef"] },
    { name: "Purple Dream", colors: ["#a8edea", "#fed6e3"] }
  ];

  const textures = [
    { name: "Paper", color: "#f8f9fa" },
    { name: "Marble", color: "#e8e3e0" },
    { name: "Wood", color: "#d4a574" },
    { name: "Canvas", color: "#f5f5f5" },
    { name: "Stone", color: "#b8b8b8" }
  ];

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setOriginalUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const handleReset = () => {
    setImage(false);
    setResultImage(false);
    navigate("/");
  };

  const downloadWithBackground = () => {
    if (!resultImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = resultImage;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Apply different background types
      if (bgType === "solid") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgType === "gradient") {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const g = gradients[selectedGradient];
        gradient.addColorStop(0, g.colors[0]);
        gradient.addColorStop(1, g.colors[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgType === "texture") {
        const t = textures[selectedTexture];
        ctx.fillStyle = t.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add subtle texture effect
        const gradient = ctx.createRadialGradient(
          canvas.width * 0.3, canvas.height * 0.3, 0,
          canvas.width * 0.7, canvas.height * 0.7, canvas.width * 0.5
        );
        gradient.addColorStop(0, "rgba(255,255,255,0.1)");
        gradient.addColorStop(1, "rgba(0,0,0,0.05)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw image on top
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Download
      const link = document.createElement("a");
      link.download = "image-with-background.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.onerror = () => {
      alert("Failed to load image for download.");
    };
  };

  // Dynamic preview background
  const getPreviewStyle = () => {
    if (bgType === "solid") {
      return { backgroundColor: bgColor };
    } else if (bgType === "gradient") {
      const g = gradients[selectedGradient];
      return { 
        background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`
      };
    } else if (bgType === "texture") {
      const t = textures[selectedTexture];
      return {
        backgroundColor: t.color,
        backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.05) 0%, transparent 50%)",
        backgroundSize: "cover"
      };
    }
    return { backgroundColor: bgColor };
  };

  return (
    <div className="mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        {/* Original Image */}
        <div className="flex flex-col items-center">
          <p className="font-semibold text-gray-600 mb-2">Original</p>
          {originalUrl && (
            <img
              src={originalUrl}
              alt="original"
              className="rounded-md object-contain max-w-[300px] max-h-[300px] border"
            />
          )}
        </div>

        {/* Result Image with Background Options */}
        <div className="flex flex-col items-center">
          <p className="font-semibold text-gray-600 mb-2">Background Removed</p>
          
          {/* Background Controls */}
          <div className="flex flex-col items-center gap-3 mb-6 p-4 bg-white rounded-lg shadow-sm border w-64">
            <label className="text-sm text-gray-600 font-medium">Background Style:</label>
            
            <select 
              value={bgType} 
              onChange={(e) => {
                setBgType(e.target.value);
                setBgColor("#ffffff"); // Reset color when changing type
              }}
              className="p-2 border rounded-md w-full"
            >
              <option value="solid">🎨 Solid Color</option>
              <option value="gradient">🌈 Gradient</option>
              <option value="texture">📄 Texture</option>
            </select>

            {bgType === "solid" && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 cursor-pointer rounded-lg border shadow-sm"
                />
                <span className="text-xs text-gray-500">Pick any color</span>
              </div>
            )}

            {bgType === "gradient" && (
              <select 
                value={selectedGradient} 
                onChange={(e) => setSelectedGradient(Number(e.target.value))}
                className="p-2 border rounded-md w-full"
              >
                {gradients.map((g, i) => (
                  <option key={i} value={i}>{g.name}</option>
                ))}
              </select>
            )}

            {bgType === "texture" && (
              <select 
                value={selectedTexture} 
                onChange={(e) => setSelectedTexture(Number(e.target.value))}
                className="p-2 border rounded-md w-full"
              >
                {textures.map((t, i) => (
                  <option key={i} value={i}>{t.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Preview Box */}
          <div
            className="rounded-md border-2 border-gray-200 relative overflow-hidden flex items-center justify-center min-h-[320px] max-w-[320px] shadow-xl"
            style={getPreviewStyle()}
          >
            {resultImage ? (
              <img
                src={resultImage}
                alt="result"
                className="object-contain max-w-[300px] max-h-[300px]"
              />
            ) : (
              image && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="border-4 border-indigo-600 rounded-full h-12 w-12 border-t-transparent animate-spin"></div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {resultImage && (
        <div className="flex justify-center items-center flex-wrap gap-4 mt-8">
          <button
            onClick={handleReset}
            className="border-2 border-indigo-600 text-indigo-600 font-semibold py-3 px-6 rounded-full text-lg hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-md"
          >
            🔄 Try another image
          </button>
          <button
            onClick={downloadWithBackground}
            className="py-3 px-8 text-white font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg hover:from-emerald-600 hover:to-green-700 hover:scale-105 transition-all duration-300 text-lg"
          >
            💾 Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default Result;
