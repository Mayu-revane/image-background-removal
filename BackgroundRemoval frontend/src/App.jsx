import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";
import Menubar from "./components/Menubar.jsx";
import Home from "./pages/Home.jsx";
import Result from "./pages/Result.jsx";
import { Route, Routes } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const App = () => {
  return (
    <div>
      <Menubar />
      <Toaster />
      <Routes>
        {/* Home page can be public */}
        <Route path="/" element={<Home />} />

        {/* Result page requires login */}
        <Route
          path="/result"
          element={
            <>
              <SignedIn>
                <Result />
              </SignedIn>
              <SignedOut>
                {/* Redirect to login if not signed in */}
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
