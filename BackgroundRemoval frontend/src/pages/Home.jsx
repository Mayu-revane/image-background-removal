import BgRemovalSteps from "../components/BgRemovalSteps";
import BgSlider from "../components/BgSlider";
import Header from "../components/Header";
import TryNow from "../components/TryNow";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-['Outfit']">
      
      {/* Hero section */}
      <Header />

      {/* Background removal steps */}
      <BgRemovalSteps />

      {/* Before / After slider */}
      <BgSlider />
      
      <Testimonials isLoggedIn={true} />

      {/* Try now – FREE image upload */}
      <TryNow />


    </div>
  );
};

export default Home;
