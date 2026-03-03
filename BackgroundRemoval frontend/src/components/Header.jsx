import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const {removeBg}=useContext(AppContext);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
      
      {/* Left side: Video Banner */}
      <div className="order-2 md:order-1 flex justify-center">
        <div className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden">
          <video
            src={assets.video_banner}
            autoPlay
            loop
            muted
            className="w-full max-w-[400px] h-auto object-cover"
          />
        </div>
      </div>

      {/* Right side: Text Content */}
      <div className="order-1 md:order-2">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            The Fastest  <span className ="text-indigo-700">Background Remover</span>
        </h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
             Explore before and after images in our interactive slider to see the magic of 
             our background removal technology in action.
              Removing backgrounds has never been easier.
            Just upload your image, and our AI-powered tool will instantly isolate the subject and remove the background for you. No complicated editing software needed!

        </p>
        <div>
            <input type="file" accept="image/*" id="upload1" hidden onChange={(e)=>removeBg(e.target.files[0])} />
            <label htmlFor="upload1"
             className="bg-black text-white font-medium px-8 py-4 rounded-full hover:opacity-90 transition-transform hover:scale-105 text-lg">
              Upload Your Image
            </label>
           

        </div>

      </div>
    </div>
  );
};

export default Header;
