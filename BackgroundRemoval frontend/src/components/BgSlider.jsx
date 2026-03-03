import React, { useState } from "react";
import { assets } from "../assets/assets";

const categories = ["People", "Products", "Animals", "Cars", "Graphics"];

const BgSlider = () => {
  const [activeCategory, setActiveCategory] = useState("People");
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(Number(e.target.value));
  };

  // Dynamically select images based on active category
  const key = activeCategory.toLowerCase();
  const originalImage = assets[`${key}_org`];
  const processedImage = assets[key];

  return (
    <div className="mb-16">
      {/* Section title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
        Stunning Quality
      </h2>

      {/* Category buttons */}
      <div className="flex justify-center mb-10 flex-wrap">
        <div className="inline-flex gap-2 bg-gray-100 p-2 rounded-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeCategory === cat
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Image comparison slider */}
      <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg">
        {/* Original image */}
        <img
          src={originalImage}
          alt="original"
          className="w-full h-auto object-cover"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        />

        {/* Processed image */}
        <img
          src={processedImage}
          alt="processed"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        />

        {/* Invisible range input */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default BgSlider;
