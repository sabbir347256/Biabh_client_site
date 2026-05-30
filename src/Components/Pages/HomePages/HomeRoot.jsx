import CreateStory from "./CreateStory";
import HeroSection from "./HeroSection";
import HomeProfileSection from "./HomeProfileSection";
import WhyChooseUs from "./WhyChooseUs";

const HomeRoot = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <HomeProfileSection></HomeProfileSection>
            <WhyChooseUs></WhyChooseUs>
            <CreateStory></CreateStory>
        </div>
    );
};

export default HomeRoot;