import { createContext, useContext, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Create context
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [image, setImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);

  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  
  const removeBg = async (selectedImage) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
      }

      setImage(selectedImage);
      setResultImage(null);
      navigate("/result");

      const token = await getToken();

      const formData = new FormData();
      if (selectedImage) {
        formData.append("file", selectedImage);
      }

      const { data } = await axios.post(
        `${backendUrl}/images/remove-background`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Backend may return raw base64 or wrapped response
      const base64Image =
        typeof data === "string" ? data : data?.data;

      if (!base64Image) {
        throw new Error("No image received from backend");
      }

      setResultImage(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error("Background removal error:", error);
      toast.error("Error while removing background image");
    }
  };

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        image,
        setImage,
        resultImage,
        setResultImage,
        removeBg,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;


export const useContest = () => useContext(AppContext);
