import CreateStory from "./CreateStory";
import HeroSection from "./HeroSection";
import HomeProfileSection from "./HomeProfileSection";
import WhyChooseUs from "./WhyChooseUs";

const HomeRoot = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <WhyChooseUs></WhyChooseUs>
            <HomeProfileSection></HomeProfileSection>
            <CreateStory></CreateStory>
        </div>
    );
};

export default HomeRoot;